import { describe, it, expect } from 'vitest';
import { mergeEvents } from '../../scripts/lib/merge-events';
import type { EarningsEvent } from '../../src/types/earnings';

describe('mergeEvents', () => {
  it('deduplicates identical events on same symbol and date', () => {
    const event1: EarningsEvent = {
      id: 'US_AAPL_2026-10-29_after_close',
      symbol: 'AAPL',
      companyName: 'Apple Inc.',
      market: 'US',
      announcementDate: '2026-10-29',
      session: 'after_close',
      dateStatus: 'estimated',
      epsEstimate: 1.55,
      sourceName: 'Analyst Consensus',
      fetchedAt: '2026-10-29T10:00:00.000Z',
    };

    const event2: EarningsEvent = {
      id: 'US_AAPL_2026-10-29_after_close',
      symbol: 'AAPL',
      companyName: 'Apple Inc.',
      market: 'US',
      announcementDate: '2026-10-29',
      session: 'after_close',
      dateStatus: 'confirmed',
      epsEstimate: 1.6,
      sourceName: 'Official Investor Relations',
      fetchedAt: '2026-10-29T11:00:00.000Z',
    };

    const { mergedEvents, conflicts } = mergeEvents([event1, event2]);
    expect(mergedEvents).toHaveLength(1);
    expect(mergedEvents[0].dateStatus).toBe('confirmed');
    expect(mergedEvents[0].epsEstimate).toBe(1.6);
    expect(conflicts.length).toBeGreaterThan(0);
  });

  it('preserves distinct companies with different symbols', () => {
    const e1: EarningsEvent = {
      id: 'US_MSFT_2026-10-28_after_close',
      symbol: 'MSFT',
      companyName: 'Microsoft Corporation',
      market: 'US',
      announcementDate: '2026-10-28',
      session: 'after_close',
      dateStatus: 'confirmed',
      sourceName: 'IR',
      fetchedAt: '2026-10-29T10:00:00.000Z',
    };
    const e2: EarningsEvent = {
      id: 'US_GOOGL_2026-10-28_after_close',
      symbol: 'GOOGL',
      companyName: 'Alphabet Inc.',
      market: 'US',
      announcementDate: '2026-10-28',
      session: 'after_close',
      dateStatus: 'confirmed',
      sourceName: 'IR',
      fetchedAt: '2026-10-29T10:00:00.000Z',
    };

    const { mergedEvents } = mergeEvents([e1, e2]);
    expect(mergedEvents).toHaveLength(2);
  });
});
