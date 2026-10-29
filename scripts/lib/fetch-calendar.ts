import { AlphaVantageProvider } from '../../src/services/providers/alpha-vantage-provider';
import type { EarningsEvent, Market } from '../../src/types/earnings';
import { normalizeEvent } from './normalize-event';
import { mergeEvents } from './merge-events';

export interface FetchOptions {
  startDate: string;
  endDate: string;
  markets: Market[];
  apiKey?: string;
}

export async function fetchAndNormalizeCalendar(options: FetchOptions): Promise<{
  events: EarningsEvent[];
  warnings: string[];
}> {
  const provider = new AlphaVantageProvider(options.apiKey);
  const rawRecords = await provider.fetchCalendar({
    startDate: options.startDate,
    endDate: options.endDate,
    markets: options.markets,
  });

  const nowIso = new Date().toISOString();
  const normalized: EarningsEvent[] = [];
  const warnings: string[] = [];

  for (const raw of rawRecords) {
    const event = normalizeEvent(raw, nowIso);
    if (event) {
      normalized.push(event);
    } else {
      warnings.push(`Skipped malformed record: ${JSON.stringify(raw)}`);
    }
  }

  const { mergedEvents, conflicts } = mergeEvents(normalized);
  warnings.push(...conflicts);

  return {
    events: mergedEvents,
    warnings,
  };
}
