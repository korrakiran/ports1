/**
 * Generates /data/trade-demo.json — the PROTOTYPE DEMO DATASET.
 *
 * Prototype demo dataset. Replace with production trade data.
 *
 * This file fabricates nothing that is presented to users as fact: every value it
 * writes is a qualitative label ("High", "Premium"), never a statistic. There are
 * deliberately no percentages, import values, tariff rates or profit margins,
 * because PortsAI has no real trade data behind this prototype.
 *
 * Output is deterministic — the seeded PRNG means re-running produces byte-identical
 * output, so the dataset can be regenerated in review without churning the diff.
 *
 * Usage: node scripts/generate-dataset.mjs
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, '../data/trade-demo.json');

const DISCLAIMER = 'Prototype demo dataset. Replace with production trade data.';

/* ------------------------------------------------------------------ */
/* Deterministic PRNG (mulberry32)                                     */
/* ------------------------------------------------------------------ */
function mulberry32(seed) {
  return function rng() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260804);

const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const shuffled = (arr) =>
  arr
    .map((v) => ({ v, k: rand() }))
    .sort((a, b) => a.k - b.k)
    .map(({ v }) => v);
const intBetween = (min, max) => min + Math.floor(rand() * (max - min + 1));

/* ------------------------------------------------------------------ */
/* Qualitative vocabularies — no numbers, ever                         */
/* ------------------------------------------------------------------ */
const DEMAND_LEVELS = ['Very High', 'High', 'Medium', 'Growing', 'Emerging'];
const MARKET_TYPES = [
  'Premium Market',
  'Volume Market',
  'Niche Market',
  'Manufacturing Hub',
  'Re-export Hub'
];

/* ------------------------------------------------------------------ */
/* Countries — real names, ISO-3166 alpha-3 codes, approximate centroids */
/* ------------------------------------------------------------------ */
const COUNTRIES = [
  ['Germany', 'DEU', 51.17, 10.45, 'Europe'],
  ['France', 'FRA', 46.23, 2.21, 'Europe'],
  ['Netherlands', 'NLD', 52.13, 5.29, 'Europe'],
  ['Italy', 'ITA', 41.87, 12.57, 'Europe'],
  ['Spain', 'ESP', 40.46, -3.75, 'Europe'],
  ['United Kingdom', 'GBR', 55.38, -3.44, 'Europe'],
  ['Belgium', 'BEL', 50.5, 4.47, 'Europe'],
  ['Poland', 'POL', 51.92, 19.15, 'Europe'],
  ['Sweden', 'SWE', 60.13, 18.64, 'Europe'],
  ['Denmark', 'DNK', 56.26, 9.5, 'Europe'],
  ['Norway', 'NOR', 60.47, 8.47, 'Europe'],
  ['Switzerland', 'CHE', 46.82, 8.23, 'Europe'],
  ['Austria', 'AUT', 47.52, 14.55, 'Europe'],
  ['Portugal', 'PRT', 39.4, -8.22, 'Europe'],
  ['Ireland', 'IRL', 53.41, -8.24, 'Europe'],
  ['Czechia', 'CZE', 49.82, 15.47, 'Europe'],
  ['Finland', 'FIN', 61.92, 25.75, 'Europe'],
  ['Greece', 'GRC', 39.07, 21.82, 'Europe'],
  ['United States', 'USA', 37.09, -95.71, 'North America'],
  ['Canada', 'CAN', 56.13, -106.35, 'North America'],
  ['Mexico', 'MEX', 23.63, -102.55, 'North America'],
  ['Brazil', 'BRA', -14.24, -51.93, 'South America'],
  ['Chile', 'CHL', -35.68, -71.54, 'South America'],
  ['Colombia', 'COL', 4.57, -74.3, 'South America'],
  ['Argentina', 'ARG', -38.42, -63.62, 'South America'],
  ['Peru', 'PER', -9.19, -75.02, 'South America'],
  ['United Arab Emirates', 'ARE', 23.42, 53.85, 'Middle East'],
  ['Saudi Arabia', 'SAU', 23.89, 45.08, 'Middle East'],
  ['Qatar', 'QAT', 25.35, 51.18, 'Middle East'],
  ['Kuwait', 'KWT', 29.31, 47.48, 'Middle East'],
  ['Oman', 'OMN', 21.51, 55.92, 'Middle East'],
  ['Bahrain', 'BHR', 26.07, 50.56, 'Middle East'],
  ['Israel', 'ISR', 31.05, 34.85, 'Middle East'],
  ['Turkey', 'TUR', 38.96, 35.24, 'Middle East'],
  ['Japan', 'JPN', 36.2, 138.25, 'Asia Pacific'],
  ['South Korea', 'KOR', 35.91, 127.77, 'Asia Pacific'],
  ['Singapore', 'SGP', 1.35, 103.82, 'Asia Pacific'],
  ['Malaysia', 'MYS', 4.21, 101.98, 'Asia Pacific'],
  ['Thailand', 'THA', 15.87, 100.99, 'Asia Pacific'],
  ['Vietnam', 'VNM', 14.06, 108.28, 'Asia Pacific'],
  ['Indonesia', 'IDN', -0.79, 113.92, 'Asia Pacific'],
  ['Philippines', 'PHL', 12.88, 121.77, 'Asia Pacific'],
  ['Australia', 'AUS', -25.27, 133.78, 'Asia Pacific'],
  ['New Zealand', 'NZL', -40.9, 174.89, 'Asia Pacific'],
  ['China', 'CHN', 35.86, 104.2, 'Asia Pacific'],
  ['Hong Kong', 'HKG', 22.32, 114.17, 'Asia Pacific'],
  ['South Africa', 'ZAF', -30.56, 22.94, 'Africa'],
  ['Kenya', 'KEN', -0.02, 37.91, 'Africa'],
  ['Nigeria', 'NGA', 9.08, 8.68, 'Africa'],
  ['Egypt', 'EGY', 26.82, 30.8, 'Africa'],
  ['Morocco', 'MAR', 31.79, -7.09, 'Africa'],
  ['Ghana', 'GHA', 7.95, -1.02, 'Africa']
];

/**
 * ISO-3166 alpha-3 -> alpha-2. The results heat map reuses WorldSVGMap, whose
 * country paths are keyed by lowercase alpha-2 ids.
 */
const ISO3_TO_ISO2 = {
  DEU: 'de', FRA: 'fr', NLD: 'nl', ITA: 'it', ESP: 'es', GBR: 'gb', BEL: 'be',
  POL: 'pl', SWE: 'se', DNK: 'dk', NOR: 'no', CHE: 'ch', AUT: 'at', PRT: 'pt',
  IRL: 'ie', CZE: 'cz', FIN: 'fi', GRC: 'gr', USA: 'us', CAN: 'ca', MEX: 'mx',
  BRA: 'br', CHL: 'cl', COL: 'co', ARG: 'ar', PER: 'pe', ARE: 'ae', SAU: 'sa',
  QAT: 'qa', KWT: 'kw', OMN: 'om', BHR: 'bh', ISR: 'il', TUR: 'tr', JPN: 'jp',
  KOR: 'kr', SGP: 'sg', MYS: 'my', THA: 'th', VNM: 'vn', IDN: 'id', PHL: 'ph',
  AUS: 'au', NZL: 'nz', CHN: 'cn', HKG: 'hk', ZAF: 'za', KEN: 'ke', NGA: 'ng',
  EGY: 'eg', MAR: 'ma', GHA: 'gh'
};

/* ------------------------------------------------------------------ */
/* Product catalogue — keywords drive the matcher                      */
/* ------------------------------------------------------------------ */
const CATALOGUE = {
  Handicrafts: [
    ['Hand-Carved Wooden Figurine', ['wood', 'carved', 'figurine', 'handmade', 'craft', 'sculpture']],
    ['Brass Decorative Bowl', ['brass', 'metal', 'bowl', 'decorative', 'handmade', 'craft']],
    ['Handwoven Cane Basket', ['cane', 'basket', 'woven', 'rattan', 'wicker', 'handmade', 'storage']],
    ['Blue Pottery Vase', ['pottery', 'ceramic', 'vase', 'clay', 'handmade', 'glazed']],
    ['Marble Inlay Coaster Set', ['marble', 'stone', 'inlay', 'coaster', 'handmade']],
    ['Papier Mache Ornament', ['papier mache', 'ornament', 'handpainted', 'handmade', 'decor']],
    ['Terracotta Planter', ['terracotta', 'clay', 'planter', 'pot', 'garden', 'handmade']],
    ['Bamboo Wind Chime', ['bamboo', 'wind chime', 'handmade', 'garden', 'decor']],
    ['Embroidered Wall Hanging', ['embroidered', 'wall hanging', 'textile', 'handmade', 'tapestry']]
  ],
  Textiles: [
    ['Cotton Bed Linen Set', ['cotton', 'bed', 'linen', 'bedsheet', 'bedding', 'fabric']],
    ['Pashmina Wool Shawl', ['pashmina', 'wool', 'shawl', 'scarf', 'cashmere', 'wrap']],
    ['Block Printed Cotton Fabric', ['block print', 'cotton', 'fabric', 'textile', 'yardage']],
    ['Silk Scarf', ['silk', 'scarf', 'stole', 'accessory', 'fabric']],
    ['Organic Cotton Towel', ['organic', 'cotton', 'towel', 'bath', 'terry']],
    ['Jute Table Runner', ['jute', 'table runner', 'natural fibre', 'dining', 'textile']],
    ['Handloom Cotton Rug', ['handloom', 'rug', 'carpet', 'dhurrie', 'floor', 'cotton']],
    ['Linen Cushion Cover', ['linen', 'cushion', 'pillow', 'cover', 'upholstery']],
    ['Denim Fabric Roll', ['denim', 'fabric', 'roll', 'apparel', 'textile']]
  ],
  Furniture: [
    ['Solid Sheesham Wood Dining Table', ['sheesham', 'wood', 'dining table', 'furniture', 'solid wood']],
    ['Rattan Lounge Chair', ['rattan', 'chair', 'lounge', 'furniture', 'cane', 'seating']],
    ['Industrial Metal Bookshelf', ['metal', 'bookshelf', 'shelving', 'industrial', 'furniture', 'storage']],
    ['Upholstered Fabric Sofa', ['sofa', 'couch', 'upholstered', 'furniture', 'seating', 'living room']],
    ['Teak Wood Bed Frame', ['teak', 'wood', 'bed frame', 'furniture', 'bedroom']],
    ['Folding Wooden Side Table', ['folding', 'side table', 'wood', 'furniture', 'accent']],
    ['Ergonomic Office Chair', ['office chair', 'ergonomic', 'furniture', 'desk', 'seating']],
    ['Nested Coffee Table Set', ['coffee table', 'nested', 'furniture', 'living room', 'wood']]
  ],
  'Home Decor': [
    ['Scented Soy Candle', ['candle', 'soy', 'scented', 'fragrance', 'home', 'decor']],
    ['Ceramic Table Lamp', ['ceramic', 'lamp', 'lighting', 'table lamp', 'decor']],
    ['Macrame Wall Art', ['macrame', 'wall art', 'cotton', 'handmade', 'decor', 'boho']],
    ['Decorative Mirror Frame', ['mirror', 'frame', 'decorative', 'wall', 'decor']],
    ['Glass Hurricane Lantern', ['glass', 'lantern', 'hurricane', 'candle holder', 'decor']],
    ['Woven Floor Cushion', ['floor cushion', 'pouffe', 'woven', 'decor', 'seating']],
    ['Metal Photo Frame Set', ['photo frame', 'metal', 'picture', 'decor', 'frame']],
    ['Handmade Paper Notebook', ['paper', 'notebook', 'journal', 'handmade', 'stationery']]
  ],
  Fashion: [
    ['Handmade Leather Wallet', ['leather', 'wallet', 'billfold', 'purse', 'handmade', 'accessory', 'card holder']],
    ['Leather Crossbody Bag', ['leather', 'bag', 'crossbody', 'handbag', 'purse', 'accessory']],
    ['Cotton Kurta Shirt', ['cotton', 'kurta', 'shirt', 'apparel', 'clothing', 'ethnic']],
    ['Beaded Statement Necklace', ['beaded', 'necklace', 'jewellery', 'jewelry', 'accessory', 'statement']],
    ['Silver Filigree Earrings', ['silver', 'earrings', 'filigree', 'jewellery', 'jewelry', 'accessory']],
    ['Leather Belt', ['leather', 'belt', 'accessory', 'buckle']],
    ['Embroidered Tote Bag', ['tote', 'bag', 'embroidered', 'canvas', 'accessory', 'shopper']],
    ['Handloom Cotton Dress', ['dress', 'handloom', 'cotton', 'apparel', 'clothing', 'womenswear']],
    ['Leather Sandals', ['leather', 'sandals', 'footwear', 'shoes', 'chappal']]
  ],
  Electronics: [
    ['Wireless Bluetooth Earbuds', ['earbuds', 'bluetooth', 'wireless', 'headphones', 'audio', 'electronics', 'tws']],
    ['Portable Power Bank', ['power bank', 'battery', 'charger', 'portable', 'electronics']],
    ['LED Smart Bulb', ['led', 'bulb', 'smart', 'lighting', 'electronics', 'iot']],
    ['USB-C Charging Cable', ['usb', 'cable', 'charging', 'type-c', 'electronics', 'accessory']],
    ['Bluetooth Speaker', ['speaker', 'bluetooth', 'audio', 'portable', 'electronics', 'sound']],
    ['Solar Home Lighting Kit', ['solar', 'lighting', 'kit', 'renewable', 'electronics', 'off-grid']],
    ['Fitness Tracker Band', ['fitness tracker', 'wearable', 'smart band', 'electronics', 'health']],
    ['Wired Computer Keyboard', ['keyboard', 'computer', 'peripheral', 'electronics', 'wired']]
  ],
  Cosmetics: [
    ['Ayurvedic Herbal Face Cream', ['ayurvedic', 'herbal', 'face cream', 'skincare', 'cosmetics', 'natural']],
    ['Cold Pressed Coconut Hair Oil', ['coconut', 'hair oil', 'cold pressed', 'haircare', 'cosmetics', 'natural']],
    ['Handmade Glycerin Soap', ['soap', 'glycerin', 'handmade', 'bath', 'cosmetics', 'natural']],
    ['Organic Lip Balm', ['lip balm', 'organic', 'lip care', 'cosmetics', 'natural']],
    ['Turmeric Face Mask Powder', ['turmeric', 'face mask', 'powder', 'skincare', 'cosmetics', 'ayurvedic']],
    ['Essential Oil Gift Set', ['essential oil', 'aromatherapy', 'gift set', 'cosmetics', 'natural']],
    ['Henna Hair Colour', ['henna', 'hair colour', 'hair dye', 'natural', 'cosmetics']],
    ['Rose Water Facial Toner', ['rose water', 'toner', 'facial', 'skincare', 'cosmetics']]
  ],
  Food: [
    ['Organic Basmati Rice', ['basmati', 'rice', 'organic', 'grain', 'food', 'staple']],
    ['Single Origin Filter Coffee', ['coffee', 'single origin', 'filter', 'beverage', 'food', 'arabica']],
    ['Assam Black Tea', ['tea', 'assam', 'black tea', 'beverage', 'food']],
    ['Whole Spice Gift Box', ['spices', 'masala', 'cardamom', 'pepper', 'food', 'seasoning']],
    ['Raw Forest Honey', ['honey', 'raw', 'forest', 'natural', 'food', 'sweetener']],
    ['Cashew Nut Kernels', ['cashew', 'nuts', 'kernels', 'dry fruit', 'food', 'snack']],
    ['Cold Pressed Mustard Oil', ['mustard oil', 'cold pressed', 'cooking oil', 'food', 'edible oil']],
    ['Millet Snack Bars', ['millet', 'snack', 'bar', 'healthy', 'food', 'cereal']],
    ['Mango Fruit Pulp', ['mango', 'pulp', 'fruit', 'puree', 'food', 'processed']]
  ],
  Toys: [
    ['Wooden Educational Puzzle', ['wooden', 'puzzle', 'educational', 'toy', 'kids', 'learning']],
    ['Handmade Cloth Doll', ['cloth doll', 'handmade', 'toy', 'kids', 'soft toy']],
    ['Wooden Building Blocks', ['building blocks', 'wooden', 'toy', 'kids', 'construction']],
    ['Board Game Set', ['board game', 'game', 'toy', 'family', 'kids']],
    ['Plush Stuffed Animal', ['plush', 'stuffed', 'soft toy', 'teddy', 'toy', 'kids']],
    ['Ride-On Toy Car', ['ride-on', 'toy car', 'kids', 'toy', 'outdoor']],
    ['Montessori Sensory Kit', ['montessori', 'sensory', 'educational', 'toy', 'kids', 'learning']]
  ],
  Automotive: [
    ['Rubber Floor Mat Set', ['floor mat', 'rubber', 'automotive', 'car', 'accessory', 'interior']],
    ['Brake Pad Assembly', ['brake pad', 'brake', 'automotive', 'spare part', 'component']],
    ['Car Seat Cover Set', ['seat cover', 'automotive', 'car', 'upholstery', 'accessory']],
    ['LED Headlamp Unit', ['headlamp', 'led', 'automotive', 'lighting', 'car', 'component']],
    ['Two-Wheeler Chain Sprocket', ['chain sprocket', 'motorcycle', 'two-wheeler', 'automotive', 'spare part']],
    ['Oil Filter Cartridge', ['oil filter', 'filter', 'automotive', 'spare part', 'engine']],
    ['Alloy Wheel Rim', ['alloy wheel', 'rim', 'automotive', 'car', 'wheel']]
  ],
  'Industrial Products': [
    ['Stainless Steel Fastener Set', ['fastener', 'bolt', 'screw', 'stainless steel', 'industrial', 'hardware']],
    ['Industrial Ball Bearing', ['bearing', 'ball bearing', 'industrial', 'machinery', 'component']],
    ['Hydraulic Hose Assembly', ['hydraulic', 'hose', 'industrial', 'machinery', 'fluid']],
    ['CNC Machined Component', ['cnc', 'machined', 'precision', 'industrial', 'component', 'engineering']],
    ['Industrial Safety Gloves', ['safety gloves', 'ppe', 'industrial', 'protective', 'workwear']],
    ['Rubber Conveyor Belt', ['conveyor belt', 'rubber', 'industrial', 'machinery', 'material handling']],
    ['Submersible Water Pump', ['pump', 'submersible', 'water', 'industrial', 'machinery']],
    ['Powder Coated Steel Sheet', ['steel sheet', 'powder coated', 'industrial', 'metal', 'fabrication']]
  ]
};

/* ------------------------------------------------------------------ */
/* Note templates — qualitative only, no figures                       */
/* ------------------------------------------------------------------ */
const NOTE_TEMPLATES = [
  'Buyers in {country} show {demandLower} interest in {product} sourced from established exporters.',
  'Retail and distribution channels in {country} actively list {category} lines comparable to {product}.',
  '{country} is a {marketLower} where {product} competes on finish and consistency rather than price.',
  'Importers in {country} favour suppliers of {product} who can document material origin and compliance.',
  'Demand for {product} in {country} is concentrated in specialist {category} retailers.',
  '{product} is typically sourced into {country} through consolidated shipments rather than direct retail supply.',
  'Distributors in {country} report steady enquiries for {category} products in the {product} segment.',
  'The {marketLower} profile of {country} suits {product} positioned toward quality-led buyers.',
  'Certification and labelling expectations for {product} in {country} are strict but well documented.',
  'Seasonal buying cycles shape how {product} enters {country}, with orders placed ahead of peak retail periods.'
];

/* Country traits nudge which labels a country tends to get, so the dataset
 * reads coherently instead of randomly (e.g. Switzerland skews premium). */
const PREMIUM_SKEW = new Set(['CHE', 'NOR', 'DNK', 'SWE', 'JPN', 'SGP', 'ARE', 'QAT', 'USA', 'GBR', 'FRA', 'AUT', 'IRL', 'FIN', 'HKG']);
const HUB_SKEW = new Set(['ARE', 'SGP', 'NLD', 'HKG', 'BEL', 'OMN', 'BHR']);
const MANUFACTURING_SKEW = new Set(['CHN', 'VNM', 'THA', 'MYS', 'MEX', 'TUR', 'POL', 'IDN', 'CZE']);
const EMERGING_SKEW = new Set(['KEN', 'NGA', 'GHA', 'EGY', 'MAR', 'PER', 'COL', 'PHL', 'VNM', 'IDN']);

function marketTypeFor(iso) {
  if (HUB_SKEW.has(iso) && rand() < 0.5) return 'Re-export Hub';
  if (MANUFACTURING_SKEW.has(iso) && rand() < 0.5) return 'Manufacturing Hub';
  if (PREMIUM_SKEW.has(iso) && rand() < 0.65) return 'Premium Market';
  if (rand() < 0.25) return 'Niche Market';
  return pick(['Volume Market', 'Premium Market', 'Niche Market']);
}

function demandFor(iso) {
  if (EMERGING_SKEW.has(iso)) return pick(['Emerging', 'Growing', 'Growing', 'Medium']);
  if (PREMIUM_SKEW.has(iso)) return pick(['Very High', 'High', 'High', 'Medium']);
  return pick(DEMAND_LEVELS);
}

/* ------------------------------------------------------------------ */
/* Build records                                                       */
/* ------------------------------------------------------------------ */
const records = [];
let seq = 0;

/**
 * Major import markets carry entries for every product. Real destination markets
 * of this size import across essentially all of these categories, so restricting
 * them to a random subset would make the demo behave oddly — a wallet query
 * returning Kuwait but not Germany.
 */
const CORE_MARKETS = new Set(['DEU', 'USA', 'ARE', 'FRA', 'CAN', 'JPN', 'GBR', 'AUS']);

for (const [category, products] of Object.entries(CATALOGUE)) {
  for (const [product, keywords] of products) {
    const core = COUNTRIES.filter(([, iso]) => CORE_MARKETS.has(iso));
    const rest = shuffled(COUNTRIES.filter(([, iso]) => !CORE_MARKETS.has(iso)));
    const chosen = [...core, ...rest.slice(0, intBetween(3, 7))];

    for (const [country, iso] of chosen) {
      const demand = demandFor(iso);
      const marketType = marketTypeFor(iso);
      const template = pick(NOTE_TEMPLATES);

      const notes = template
        .replaceAll('{country}', country)
        .replaceAll('{product}', product.toLowerCase())
        .replaceAll('{category}', category.toLowerCase())
        .replaceAll('{demandLower}', demand.toLowerCase())
        .replaceAll('{marketLower}', marketType.toLowerCase());

      records.push({
        id: `td-${String(++seq).padStart(4, '0')}`,
        country,
        country_iso: iso,
        product,
        category,
        keywords,
        demand,
        market_type: marketType,
        notes
      });
    }
  }
}

/* ------------------------------------------------------------------ */
/* Write                                                               */
/* ------------------------------------------------------------------ */
const payload = {
  _disclaimer: DISCLAIMER,
  meta: {
    disclaimer: DISCLAIMER,
    generator: 'scripts/generate-dataset.mjs',
    seed: 20260804,
    generated_for: 'PortsAI Wednesday prototype',
    is_official_statistics: false,
    note:
      'Every value here is a qualitative label chosen by a seeded generator. ' +
      'Nothing in this file is derived from real trade statistics, and no figure, ' +
      'percentage, tariff rate or import value appears anywhere in it.',
    demand_levels: DEMAND_LEVELS,
    market_types: MARKET_TYPES,
    categories: Object.keys(CATALOGUE),
    record_count: records.length,
    country_count: COUNTRIES.length
  },
  countries: COUNTRIES.map(([name, iso3, lat, lng, region]) => ({
    name,
    iso3,
    iso2: ISO3_TO_ISO2[iso3],
    lat,
    lng,
    region
  })),
  records
};

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2) + '\n');

console.log(`Wrote ${records.length} records across ${COUNTRIES.length} countries -> ${OUT_PATH}`);
console.log(`Categories: ${Object.keys(CATALOGUE).length}, products: ${Object.values(CATALOGUE).flat().length}`);
