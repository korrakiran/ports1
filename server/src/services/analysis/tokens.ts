/** Lowercase, strip punctuation, collapse whitespace. */
export function normalise(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/[-\s]+/g, ' ')
    .trim();
}

/** Words carrying no product signal — dropped before matching. */
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'from', 'has', 'have',
  'i', 'in', 'is', 'it', 'its', 'my', 'of', 'on', 'or', 'our', 'that', 'the', 'their',
  'them', 'these', 'they', 'this', 'to', 'was', 'we', 'were', 'what', 'which', 'with',
  'you', 'your', 'we', 'want', 'would', 'like', 'looking', 'sell', 'selling', 'export',
  'exporting', 'exports', 'product', 'products', 'make', 'making', 'made', 'manufacture',
  'manufacturing', 'quality', 'best', 'good', 'new', 'also', 'can', 'will', 'need',
  'business', 'company', 'india', 'indian', 'price', 'cheap', 'buy', 'small', 'large'
]);

/**
 * Very small suffix stemmer. Deliberately conservative: it only strips plurals,
 * because aggressive stemming would collapse distinct product terms
 * (e.g. "coating" -> "coat") and produce matches the user never asked for.
 */
function singularise(word: string): string {
  if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && (word.endsWith('ches') || word.endsWith('shes') || word.endsWith('sses')))
    return word.slice(0, -2);
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

/**
 * Turns free text into the terms used for dataset lookup: meaningful unigrams
 * (both as written and singularised) plus adjacent bigrams, which are needed
 * because many catalogue keywords are two words ("power bank", "hair oil").
 */
export function extractTerms(text: string): string[] {
  const words = normalise(text).split(' ').filter(Boolean);
  const kept = words.filter((w) => w.length > 1 && !STOPWORDS.has(w));

  const terms = new Set<string>();

  for (const word of kept) {
    terms.add(word);
    const singular = singularise(word);
    if (singular !== word) terms.add(singular);
  }

  // Bigrams are built from the unfiltered sequence so that phrases survive even
  // when one half is a stopword-adjacent token.
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    terms.add(bigram);
    terms.add(`${singularise(words[i])} ${singularise(words[i + 1])}`);
  }

  return [...terms];
}

/** Pulls readable words out of a URL so a pasted product link contributes signal. */
export function termsFromUrl(url: string): string[] {
  try {
    const parsed = new URL(url);
    const path = `${parsed.hostname.replace(/^www\./, '')} ${parsed.pathname}`;
    return extractTerms(path.replace(/\.(html?|php|aspx)$/i, ''));
  } catch {
    return [];
  }
}
