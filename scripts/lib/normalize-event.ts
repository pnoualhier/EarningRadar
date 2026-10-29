import type { EarningsEvent, Market, EarningsSession, DateStatus } from '../../src/types/earnings';
import { classifyDateStatus } from './classify-date-status';

export interface RawEarningsRecord {
  symbol: string;
  name?: string;
  reportDate: string;
  fiscalDateEnding?: string;
  estimate?: string | number | null;
  currency?: string;
  time?: string;
  session?: string;
  exchange?: string;
  country?: string;
  market?: string;
  sourceName?: string;
  sourceUrl?: string;
  isConfirmed?: boolean;
  statusText?: string;
}

export function detectMarket(symbol: string, exchange?: string, country?: string): Market {
  if (exchange) {
    const ex = exchange.toUpperCase();
    if (ex.includes('PARIS') || ex.includes('XETRA') || ex.includes('LSE') || ex.includes('SIX') || ex.includes('EURONEXT') || ex.includes('EPA')) {
      return 'EU';
    }
    if (ex.includes('NYSE') || ex.includes('NASDAQ') || ex.includes('AMEX')) {
      return 'US';
    }
  }

  if (country) {
    const c = country.toUpperCase();
    if (['FR', 'FRANCE', 'DE', 'GERMANY', 'GB', 'UK', 'CH', 'SWITZERLAND', 'NL', 'NETHERLANDS'].includes(c)) {
      return 'EU';
    }
    if (['US', 'USA', 'UNITED STATES'].includes(c)) {
      return 'US';
    }
  }

  // Symbol suffix detection (.PA = Paris, .DE = Frankfurt/Xetra, .L = London, .SW = Swiss)
  if (/\.(PA|DE|L|SW|AS|MC|MI|BR|CO)$/i.test(symbol)) {
    return 'EU';
  }

  return 'US';
}

export function normalizeSession(sessionStr?: string, timeStr?: string): EarningsSession {
  const norm = (sessionStr || '').toLowerCase().trim();
  if (norm.includes('bmo') || norm.includes('before') || norm.includes('pre') || norm.includes('avant')) {
    return 'before_open';
  }
  if (norm.includes('amc') || norm.includes('after') || norm.includes('post') || norm.includes('cloture') || norm.includes('après')) {
    return 'after_close';
  }
  if (norm.includes('during') || norm.includes('intraday') || norm.includes('séance') || norm.includes('seance')) {
    return 'during_session';
  }

  // Fallback by time if provided in HH:mm
  if (timeStr && /^\d{2}:\d{2}$/.test(timeStr)) {
    const [h, m] = timeStr.split(':').map(Number);
    const minuteOfDay = h * 60 + m;
    // 09:30 EST is 570 mins, 16:00 EST is 960 mins
    if (minuteOfDay < 570) return 'before_open';
    if (minuteOfDay >= 960) return 'after_close';
    return 'during_session';
  }

  return 'unknown';
}

export function parseNumberSafely(val: unknown): number | undefined {
  if (val === null || val === undefined || val === '') return undefined;
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/,/g, ''));
  return Number.isFinite(num) ? num : undefined;
}

export function normalizeEvent(
  raw: RawEarningsRecord,
  fetchedAt: string = new Date().toISOString()
): EarningsEvent | null {
  if (!raw.symbol || !raw.reportDate) {
    return null;
  }

  const cleanSymbol = raw.symbol.trim().toUpperCase();
  const cleanDate = raw.reportDate.trim().slice(0, 10);
  
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
    return null;
  }

  const market = (raw.market === 'EU' || raw.market === 'US') 
    ? raw.market 
    : detectMarket(cleanSymbol, raw.exchange, raw.country);

  const session = normalizeSession(raw.session, raw.time);
  const dateStatus = classifyDateStatus({
    isConfirmedByCompany: raw.isConfirmed,
    statusText: raw.statusText,
  });

  // Construct stable, deterministic ID
  const id = `${market}_${cleanSymbol}_${cleanDate}_${session}`.replace(/[^A-Za-z0-9_-]/g, '_');

  const epsEstimate = parseNumberSafely(raw.estimate);

  return {
    id,
    symbol: cleanSymbol,
    companyName: raw.name?.trim() || cleanSymbol,
    market,
    exchange: raw.exchange?.trim(),
    country: raw.country?.trim(),
    announcementDate: cleanDate,
    announcementTime: raw.time && /^\d{2}:\d{2}$/.test(raw.time) ? raw.time : undefined,
    timeZone: market === 'US' ? 'America/New_York' : 'Europe/Paris',
    session,
    dateStatus,
    fiscalPeriod: raw.fiscalDateEnding?.trim(),
    epsEstimate,
    currency: raw.currency ? raw.currency.toUpperCase() : (market === 'US' ? 'USD' : 'EUR'),
    sourceName: raw.sourceName || 'Alpha Vantage / Financial Feed',
    sourceUrl: raw.sourceUrl,
    fetchedAt,
  };
}
