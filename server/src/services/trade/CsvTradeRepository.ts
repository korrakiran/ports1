import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { CountryTotals, MarketRecommendation } from '@shared/types';
import { DATA_SOURCE } from '@shared/types';
import { ISO3_TO_ISO2, REGION_BY_PREFIX } from './countryCodes.js';
import { classifyDemand } from './demand.js';
import { normalise } from '../analysis/tokens.js';
import type { Hs4Match, TradeRepository } from './TradeRepository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CSV_PATH = path.resolve(__dirname, '../../../../global_imports_hs4.csv');

interface CountryProduct {
  hs4Id: string;
  hs4: string;
  tradeValue: number;
  rank: number;
  sharePct: number;
}

interface CountryEntry {
  countryId: string;
  country: string;
  iso3: string;
  iso2: string;
  region: string;
  totalImports: number;
  productCount: number;
  products: CountryProduct[];
}

interface ProductEntry {
  hs4Id: string;
  hs4: string;
  terms: Set<string>;
  byCountry: Map<string, number>;
}

interface Index {
  countries: Map<string, CountryEntry>;
  products: Map<string, ProductEntry>;
  termIndex: Map<string, Set<string>>;
}

/** Robust CSV parser that handles quotes and commas inside cells. */
function parseLine(line: string): string[] {
  const out: string[] = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      out.push(field);
      field = '';
    } else {
      field += ch;
    }
  }

  out.push(field);
  return out;
}

/** Words too generic to identify a product category. */
const STOP_TERMS = new Set([
  'and', 'or', 'of', 'the', 'for', 'with', 'other', 'others', 'nes', 'not',
  'from', 'in', 'to', 'parts', 'products', 'articles', 'goods', 'than', 'whether'
]);

/**
 * Trade repository backed by global_imports_hs4.csv.
 */
export class CsvTradeRepository implements TradeRepository {
  private loaded?: Promise<Index>;

  private load(): Promise<Index> {
    this.loaded ??= (async () => {
      const raw = await readFile(CSV_PATH, 'utf8');
      const lines = raw.split('\n');

      const countries = new Map<string, CountryEntry>();
      const products = new Map<string, ProductEntry>();
      const descriptions = new Map<string, string>();

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;

        const cols = parseLine(line);
        if (cols.length < 6) continue;

        const [, countryId, countryName, hs4Id, hs4Raw, valueRaw] = cols;
        const tradeValue = Number(valueRaw);
        if (!Number.isFinite(tradeValue) || tradeValue <= 0) continue;

        const iso3 = countryId.slice(2).toUpperCase();
        const iso2 = ISO3_TO_ISO2[iso3];
        if (!iso2) continue;

        let hs4 = descriptions.get(hs4Raw);
        if (!hs4) {
          hs4 = hs4Raw;
          descriptions.set(hs4Raw, hs4);
        }

        let country = countries.get(iso3);
        if (!country) {
          country = {
            countryId,
            country: countryName,
            iso3,
            iso2,
            region: REGION_BY_PREFIX[countryId.slice(0, 2)] ?? 'Other',
            totalImports: 0,
            productCount: 0,
            products: []
          };
          countries.set(iso3, country);
        }
        country.totalImports += tradeValue;
        country.products.push({ hs4Id, hs4, tradeValue, rank: 0, sharePct: 0 });

        let product = products.get(hs4Id);
        if (!product) {
          product = { hs4Id, hs4, terms: new Set(), byCountry: new Map() };
          for (const word of normalise(hs4).split(' ')) {
            if (word.length > 1 && !STOP_TERMS.has(word)) product.terms.add(word);
          }
          products.set(hs4Id, product);
        }
        product.byCountry.set(iso3, (product.byCountry.get(iso3) ?? 0) + tradeValue);
      }

      for (const country of countries.values()) {
        country.products.sort((a, b) => b.tradeValue - a.tradeValue);
        country.productCount = country.products.length;
        for (let i = 0; i < country.products.length; i++) {
          const p = country.products[i];
          p.rank = i + 1;
          p.sharePct = country.totalImports > 0 ? (p.tradeValue / country.totalImports) * 100 : 0;
        }
      }

      const termIndex = new Map<string, Set<string>>();
      for (const product of products.values()) {
        for (const term of product.terms) {
          let bucket = termIndex.get(term);
          if (!bucket) termIndex.set(term, (bucket = new Set()));
          bucket.add(product.hs4Id);
        }
      }

      console.log(
        `[trade] indexed ${countries.size} countries and ${products.size} HS4 categories from ${DATA_SOURCE.file}`
      );

      return { countries, products, termIndex };
    })();

    return this.loaded;
  }

  private toRecommendation(country: CountryEntry, product: CountryProduct): MarketRecommendation {
    return {
      country: country.country,
      countryIso: country.iso3,
      countryIso2: country.iso2,
      region: country.region,
      hs4Id: product.hs4Id,
      hs4: product.hs4,
      tradeValue: product.tradeValue,
      rank: product.rank,
      sharePct: product.sharePct,
      totalImports: country.totalImports,
      productCount: country.productCount,
      demand: classifyDemand(product.rank, product.sharePct, product.tradeValue)
    };
  }

  async searchProducts(terms: string[], limit = 6): Promise<Hs4Match[]> {
    const { products, termIndex } = await this.load();

    const query = new Set(terms.map((t) => normalise(t)).filter((t) => t && !STOP_TERMS.has(t)));
    if (query.size === 0) return [];

    const hits = new Map<string, { score: number; matched: Set<string> }>();

    for (const term of query) {
      for (const hs4Id of termIndex.get(term) ?? []) {
        let hit = hits.get(hs4Id);
        if (!hit) hits.set(hs4Id, (hit = { score: 0, matched: new Set() }));
        hit.score += 1;
        hit.matched.add(term);
      }
    }

    if (hits.size === 0) return [];

    const scored: Hs4Match[] = [];
    for (const [hs4Id, hit] of hits) {
      const product = products.get(hs4Id)!;
      const coverage = hit.matched.size / product.terms.size;
      scored.push({
        hs4Id,
        hs4: product.hs4,
        score: hit.score * 2 + coverage * 3,
        matched: [...hit.matched]
      });
    }

    scored.sort((a, b) => b.score - a.score || a.hs4.localeCompare(b.hs4));

    const best = scored[0].score;
    return scored.filter((s) => s.score >= best * 0.55).slice(0, limit);
  }

  async marketsForProduct(hs4Id: string, limit = 12): Promise<MarketRecommendation[]> {
    const { countries, products } = await this.load();
    const product = products.get(hs4Id);
    if (!product) return [];

    const out: MarketRecommendation[] = [];

    let worldProductTotal = 0;
    for (const [, val] of product.byCountry) {
      worldProductTotal += val;
    }

    for (const [iso3] of product.byCountry) {
      const country = countries.get(iso3);
      if (!country) continue;
      const line = country.products.find((p) => p.hs4Id === hs4Id);
      if (!line) continue;
      out.push(this.toRecommendation(country, line));
    }

    out.sort((a, b) => b.tradeValue - a.tradeValue);

    // Re-classify demand based on global product rank and global product share
    for (let i = 0; i < out.length; i++) {
      const rec = out[i];
      const globalRank = i + 1;
      const globalProductShare = worldProductTotal > 0 ? (rec.tradeValue / worldProductTotal) * 100 : 0;
      rec.demand = classifyDemand(globalRank, globalProductShare, rec.tradeValue);
    }

    return out.slice(0, limit);
  }

  async topImportsForCountry(iso3: string, limit = 12): Promise<MarketRecommendation[]> {
    const { countries } = await this.load();
    const country = countries.get(iso3.toUpperCase());
    if (!country) return [];
    return country.products.slice(0, limit).map((p) => this.toRecommendation(country, p));
  }

  async country(iso3: string): Promise<CountryTotals | undefined> {
    const { countries } = await this.load();
    const c = countries.get(iso3.toUpperCase());
    if (!c) return undefined;
    const { country, iso2, region, totalImports, productCount } = c;
    return { country, iso3: c.iso3, iso2, region, totalImports, productCount };
  }

  async countries(): Promise<readonly CountryTotals[]> {
    const { countries } = await this.load();
    return [...countries.values()].map(({ country, iso3, iso2, region, totalImports, productCount }) => ({
      country,
      iso3,
      iso2,
      region,
      totalImports,
      productCount
    }));
  }

  dataNotice(): string {
    return DATA_SOURCE.notice;
  }
}
