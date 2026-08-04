import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CountryMeta, TradeRecord } from '@shared/types';
import type { TradeRepository } from './TradeRepository.js';
import { normalise } from '../analysis/tokens.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, '../../../../data/trade-demo.json');

interface DatasetFile {
  _disclaimer: string;
  meta: { disclaimer: string; record_count: number; country_count: number };
  countries: CountryMeta[];
  records: TradeRecord[];
}

/**
 * Reads the prototype dataset from /data/trade-demo.json.
 *
 * Prototype demo dataset. Replace with production trade data.
 *
 * The file is loaded once and cached, and an inverted index from search term to
 * records is built up front so lookups do not rescan ~1000 rows per request.
 */
export class JsonTradeRepository implements TradeRepository {
  private loaded?: Promise<{
    data: DatasetFile;
    index: Map<string, TradeRecord[]>;
    countriesByName: Map<string, CountryMeta>;
  }>;

  private load() {
    this.loaded ??= (async () => {
      const raw = await readFile(DATA_PATH, 'utf8');
      const data = JSON.parse(raw) as DatasetFile;

      // Inverted index: every searchable term -> the records mentioning it.
      const index = new Map<string, TradeRecord[]>();
      const add = (term: string, record: TradeRecord) => {
        const key = normalise(term);
        if (!key) return;
        const bucket = index.get(key);
        if (bucket) bucket.push(record);
        else index.set(key, [record]);
      };

      for (const record of data.records) {
        for (const keyword of record.keywords) add(keyword, record);
        for (const word of normalise(record.product).split(' ')) add(word, record);
        add(record.category, record);
        for (const word of normalise(record.category).split(' ')) add(word, record);
      }

      const countriesByName = new Map(data.countries.map((c) => [c.name.toLowerCase(), c]));

      return { data, index, countriesByName };
    })();

    return this.loaded;
  }

  async all(): Promise<readonly TradeRecord[]> {
    const { data } = await this.load();
    return data.records;
  }

  async search(terms: string[]): Promise<readonly TradeRecord[]> {
    const { index } = await this.load();
    const seen = new Set<string>();
    const out: TradeRecord[] = [];

    for (const term of terms) {
      const key = normalise(term);
      if (!key) continue;
      for (const record of index.get(key) ?? []) {
        if (seen.has(record.id)) continue;
        seen.add(record.id);
        out.push(record);
      }
    }

    return out;
  }

  async country(name: string): Promise<CountryMeta | undefined> {
    const { countriesByName } = await this.load();
    return countriesByName.get(name.toLowerCase());
  }

  async countries(): Promise<readonly CountryMeta[]> {
    const { data } = await this.load();
    return data.countries;
  }

  disclaimer(): string {
    return 'Prototype demo dataset. Replace with production trade data.';
  }
}
