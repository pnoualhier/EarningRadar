import type { EarningsProvider, FetchCalendarOptions } from './earnings-provider';
import type { RawEarningsRecord } from '../../../scripts/lib/normalize-event';

export class AlphaVantageProvider implements EarningsProvider {
  readonly name = 'Alpha Vantage';
  private readonly apiKey: string;
  private readonly baseUrl = 'https://www.alphavantage.co/query';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ALPHA_VANTAGE_API_KEY || '';
  }

  /**
   * Sanitizes any string to remove API keys before logging or throwing.
   */
  private sanitize(message: string): string {
    if (!this.apiKey) return message;
    return message.split(this.apiKey).join('[REDACTED_API_KEY]');
  }

  async fetchCalendar(options: FetchCalendarOptions): Promise<RawEarningsRecord[]> {
    if (!this.apiKey) {
      throw new Error(
        'ALPHA_VANTAGE_API_KEY is not defined in environment variables. Data update halted.'
      );
    }

    const url = new URL(this.baseUrl);
    url.searchParams.set('function', 'EARNINGS_CALENDAR');
    url.searchParams.set('horizon', '3month');
    url.searchParams.set('apikey', this.apiKey);

    let lastError: Error | null = null;
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const response = await fetch(url.toString(), {
          signal: controller.signal,
          headers: {
            'User-Agent': 'EarningsRadar/1.0',
            Accept: 'text/csv, application/json',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        const text = await response.text();

        // Alpha Vantage returns rate-limit messages inside text body even on HTTP 200
        if (
          text.includes('Our standard API call frequency is') ||
          text.includes('Thank you for using Alpha Vantage')
        ) {
          throw new Error(
            'Alpha Vantage rate limit / quota exceeded (25 calls/day max on free tier).'
          );
        }

        if (text.includes('Error Message') || text.includes('Invalid API call')) {
          throw new Error('Alpha Vantage returned an error message in body.');
        }

        // Parse CSV response
        return this.parseCsvResponse(text, options);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        lastError = new Error(this.sanitize(errMsg));

        // Exponential backoff if attempts remaining
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise((res) => setTimeout(res, delay));
        }
      }
    }

    throw lastError || new Error('Failed to fetch from Alpha Vantage after retries.');
  }

  private parseCsvResponse(csvText: string, options: FetchCalendarOptions): RawEarningsRecord[] {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const symbolIdx = header.indexOf('symbol');
    const nameIdx = header.indexOf('name');
    const reportDateIdx = header.indexOf('reportdate');
    const fiscalDateEndingIdx = header.indexOf('fiscaldateending');
    const estimateIdx = header.indexOf('estimate');
    const currencyIdx = header.indexOf('currency');

    if (symbolIdx === -1 || reportDateIdx === -1) {
      throw new Error('Unexpected CSV header structure from Alpha Vantage EARNINGS_CALENDAR.');
    }

    const records: RawEarningsRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(',');
      const symbol = cols[symbolIdx]?.trim();
      const reportDate = cols[reportDateIdx]?.trim();

      if (!symbol || !reportDate) continue;

      // Filter by requested date range
      if (options.startDate && reportDate < options.startDate) continue;
      if (options.endDate && reportDate > options.endDate) continue;

      records.push({
        symbol,
        name: nameIdx !== -1 ? cols[nameIdx]?.trim() : symbol,
        reportDate,
        fiscalDateEnding:
          fiscalDateEndingIdx !== -1 ? cols[fiscalDateEndingIdx]?.trim() : undefined,
        estimate: estimateIdx !== -1 ? cols[estimateIdx]?.trim() : undefined,
        currency: currencyIdx !== -1 ? cols[currencyIdx]?.trim() : 'USD',
        sourceName: 'Alpha Vantage (Official Feed)',
        sourceUrl: 'https://www.alphavantage.co/documentation/#earnings-calendar',
        statusText: 'estimated',
      });
    }

    return records;
  }
}
