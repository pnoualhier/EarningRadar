import { describe, it, expect } from 'vitest';
import {
  normalizeEvent,
  detectMarket,
  normalizeSession,
  parseNumberSafely,
} from '../../scripts/lib/normalize-event';

describe('normalize-event', () => {
  it('detects markets accurately based on symbols, exchanges and country', () => {
    expect(detectMarket('AAPL')).toBe('US');
    expect(detectMarket('MC.PA')).toBe('EU');
    expect(detectMarket('SAP.DE')).toBe('EU');
    expect(detectMarket('AZN.L')).toBe('EU');
    expect(detectMarket('NESN.SW')).toBe('EU');
    expect(detectMarket('IBM', 'NYSE')).toBe('US');
    expect(detectMarket('AIR', 'Euronext Paris')).toBe('EU');
  });

  it('normalizes session names properly', () => {
    expect(normalizeSession('bmo')).toBe('before_open');
    expect(normalizeSession('Before market open')).toBe('before_open');
    expect(normalizeSession('amc')).toBe('after_close');
    expect(normalizeSession('After market close')).toBe('after_close');
    expect(normalizeSession('during')).toBe('during_session');
    expect(normalizeSession(undefined, '16:30')).toBe('after_close');
    expect(normalizeSession(undefined, '08:00')).toBe('before_open');
    expect(normalizeSession(undefined, undefined)).toBe('unknown');
  });

  it('safely parses financial numbers without losing precision or converting null to zero', () => {
    expect(parseNumberSafely(1.25)).toBe(1.25);
    expect(parseNumberSafely('1,450.50')).toBe(1450.5);
    expect(parseNumberSafely(null)).toBeUndefined();
    expect(parseNumberSafely('')).toBeUndefined();
    expect(parseNumberSafely(undefined)).toBeUndefined();
    expect(parseNumberSafely(0)).toBe(0);
    expect(parseNumberSafely('NaN')).toBeUndefined();
  });

  it('normalizes a valid raw record into an EarningsEvent', () => {
    const raw = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      reportDate: '2026-10-29',
      session: 'amc',
      time: '16:30',
      estimate: '1.60',
      market: 'US',
      statusText: 'confirmed',
    };
    const event = normalizeEvent(raw, '2026-10-29T12:00:00.000Z');
    expect(event).not.toBeNull();
    expect(event?.symbol).toBe('AAPL');
    expect(event?.session).toBe('after_close');
    expect(event?.dateStatus).toBe('confirmed');
    expect(event?.epsEstimate).toBe(1.6);
    expect(event?.id).toBe('US_AAPL_2026-10-29_after_close');
  });

  it('rejects records with missing symbol or invalid date', () => {
    expect(normalizeEvent({ symbol: '', reportDate: '2026-10-29' })).toBeNull();
    expect(normalizeEvent({ symbol: 'AAPL', reportDate: 'not-a-date' })).toBeNull();
  });
});
