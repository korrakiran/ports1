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
  'business', 'company', 'india', 'indian', 'price', 'cheap', 'buy', 'small', 'large',
  // Image / file artifact terms carrying no product intent
  'image', 'images', 'photo', 'photos', 'img', 'picture', 'pictures', 'file', 'files',
  'upload', 'uploads', 'screenshot', 'screenshots', 'download', 'downloads', 'unknown',
  'temp', 'jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'
]);

/**
 * Very small suffix stemmer. Deliberately conservative: it only strips plurals.
 */
function singularise(word: string): string {
  if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && (word.endsWith('ches') || word.endsWith('shes') || word.endsWith('sses')))
    return word.slice(0, -2);
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

/**
 * Turns free text into the terms used for dataset lookup.
 */
export function extractTerms(text: string): string[] {
  const words = normalise(text).split(' ').filter(Boolean);
  const kept = words.filter((w) => w.length > 1 && !STOPWORDS.has(w));

  const terms = new Set<string>();

  for (const word of kept) {
    terms.add(word);
    const singular = singularise(word);
    if (singular !== word && !STOPWORDS.has(singular)) terms.add(singular);
  }

  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i];
    const w2 = words[i + 1];
    if (!STOPWORDS.has(w1) || !STOPWORDS.has(w2)) {
      const bigram = `${w1} ${w2}`;
      terms.add(bigram);
      terms.add(`${singularise(w1)} ${singularise(w2)}`);
    }
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
