import { describe, it, expect } from 'vitest';
import { filterEvents } from '../../src/features/search/search-utils';
import type { EarningsEvent } from '../../src/types/earnings';

const sampleEvents: EarningsEvent[] = [
  {
    id: 'US_AAPL_2026-10-29_after_close',
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    market: 'US',
    exchange: 'NASDAQ',
    country: 'États-Unis',
    announcementDate: '2026-10-29',
    session: 'after_close',
    dateStatus: 'confirmed',
    sourceName: 'IR',
    fetchedAt: '2026-10-29T10:00:00.000Z',
  },
  {
    id: 'EU_MC_PA_2026-10-27_after_close',
    symbol: 'MC.PA',
    companyName: 'LVMH',
    market: 'EU',
    exchange: 'Euronext Paris',
    country: 'France',
    announcementDate: '2026-10-27',
    session: 'after_close',
    dateStatus: 'confirmed',
    sourceName: 'IR',
    fetchedAt: '2026-10-29T10:00:00.000Z',
  },
  {
    id: 'US_INTC_2026-10-29_after_close',
    symbol: 'INTC',
    companyName: 'Intel Corporation',
    market: 'US',
    exchange: 'NASDAQ',
    country: 'États-Unis',
    announcementDate: '2026-10-29',
    session: 'after_close',
    dateStatus: 'estimated',
    sourceName: 'Feed',
    fetchedAt: '2026-10-29T10:00:00.000Z',
  },
];

describe('filterEvents', () => {
  it('filters by market correctly', () => {
    const usOnly = filterEvents(sampleEvents, { market: 'US' });
    expect(usOnly).toHaveLength(2);
    expect(usOnly.every((e) => e.market === 'US')).toBe(true);

    const euOnly = filterEvents(sampleEvents, { market: 'EU' });
    expect(euOnly).toHaveLength(1);
    expect(euOnly[0].symbol).toBe('MC.PA');

    const all = filterEvents(sampleEvents, { market: 'ALL' });
    expect(all).toHaveLength(3);
  });

  it('filters by search query on symbol, company name and exchange', () => {
    const searchAapl = filterEvents(sampleEvents, { market: 'ALL', searchQuery: 'aapl' });
    expect(searchAapl).toHaveLength(1);
    expect(searchAapl[0].symbol).toBe('AAPL');

    const searchParis = filterEvents(sampleEvents, { market: 'ALL', searchQuery: 'euronext' });
    expect(searchParis).toHaveLength(1);
    expect(searchParis[0].symbol).toBe('MC.PA');
  });

  it('filters by date status', () => {
    const confirmed = filterEvents(sampleEvents, { market: 'ALL', dateStatus: 'confirmed' });
    expect(confirmed).toHaveLength(2);

    const estimated = filterEvents(sampleEvents, { market: 'ALL', dateStatus: 'estimated' });
    expect(estimated).toHaveLength(1);
    expect(estimated[0].symbol).toBe('INTC');
  });

  it('filters by date range', () => {
    const oct27Only = filterEvents(sampleEvents, {
      market: 'ALL',
      startDate: '2026-10-27',
      endDate: '2026-10-27',
    });
    expect(oct27Only).toHaveLength(1);
    expect(oct27Only[0].symbol).toBe('MC.PA');
  });
});
