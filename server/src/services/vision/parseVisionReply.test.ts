/**
 * Self-check for the vision reply parser.
 *
 * Run: npx tsx --tsconfig server/tsconfig.json server/src/services/vision/parseVisionReply.test.ts
 *
 * The single-line case is the regression that mattered: the model routinely
 * ignores the "two lines" instruction, and the original regex captured the
 * TERMS list into the description, which then rendered as the product summary.
 */
import assert from 'node:assert/strict';
import { parseVisionReply } from './NvidiaVisionProvider.js';

const cases: [string, string, string, string[]][] = [
  [
    'both fields on one line (the regression)',
    'DESCRIPTION: Leather wallet. TERMS: leather, wallet, accessory, personal item, fashion',
    'Leather wallet.',
    ['leather', 'wallet', 'accessory', 'personal item', 'fashion']
  ],
  [
    'proper two-line reply',
    'DESCRIPTION: A hand-stitched cotton tote bag\nTERMS: cotton, tote, bag, textile',
    'A hand-stitched cotton tote bag',
    ['cotton', 'tote', 'bag', 'textile']
  ],
  [
    'model pads with prose after the terms',
    'DESCRIPTION: Ceramic vase\nTERMS: ceramic, vase, pottery\nHope this helps!',
    'Ceramic vase',
    ['ceramic', 'vase', 'pottery']
  ],
  [
    'lowercase labels and stray whitespace',
    'description:   Brass bowl   \nterms:  brass , bowl ,  decor ',
    'Brass bowl',
    ['brass', 'bowl', 'decor']
  ],
  [
    'duplicate terms are collapsed',
    'DESCRIPTION: Wooden chair\nTERMS: wood, chair, wood, Chair, furniture',
    'Wooden chair',
    ['wood', 'chair', 'furniture']
  ],
  [
    'no labels at all — falls back to first line, no terms',
    'This looks like a leather belt.',
    'This looks like a leather belt.',
    []
  ],
  [
    'not-a-product reply',
    'DESCRIPTION: not a product\nTERMS:',
    'not a product',
    []
  ]
];

let failures = 0;

for (const [label, input, expectedDesc, expectedTerms] of cases) {
  const result = parseVisionReply(input);
  try {
    assert.equal(result.description, expectedDesc, 'description');
    assert.deepEqual(result.terms, expectedTerms, 'terms');
    console.log(`  ok  ${label}`);
  } catch (err) {
    failures++;
    console.error(`FAIL  ${label}`);
    console.error(`      got description: ${JSON.stringify(result.description)}`);
    console.error(`      got terms:       ${JSON.stringify(result.terms)}`);
  }
}

// The description must never contain the terms label, whatever the model returns.
for (const [, input] of cases) {
  assert.ok(
    !/TERMS:/i.test(parseVisionReply(input).description),
    'description leaked the TERMS label'
  );
}

console.log(failures === 0 ? '\nAll parser checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
