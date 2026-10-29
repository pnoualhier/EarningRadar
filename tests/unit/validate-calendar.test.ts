import { describe, it, expect } from 'vitest';
import validFixture from '../fixtures/valid-calendar.json';
import invalidFixture from '../fixtures/invalid-calendar.json';
import { validateCalendarFile } from '../../scripts/lib/validate-calendar';

describe('validateCalendarFile', () => {
  it('passes on valid calendar fixture', () => {
    const report = validateCalendarFile(validFixture);
    expect(report.isValid).toBe(true);
    expect(report.errors).toHaveLength(0);
  });

  it('fails with explicit error messages on invalid calendar fixture', () => {
    const report = validateCalendarFile(invalidFixture);
    expect(report.isValid).toBe(false);
    expect(report.errors.length).toBeGreaterThan(0);
    // Should catch eventCount mismatch or duplicate IDs or negative revenue
    const hasSchemaError = report.errors.some(
      (e) =>
        e.includes('eventCount') ||
        e.includes('Duplicate') ||
        e.includes('negative') ||
        e.includes('announcementDate')
    );
    expect(hasSchemaError).toBe(true);
  });

  it('detects unexpected empty events array as blocking anomaly', () => {
    const emptyCalendar = {
      metadata: {
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        lastSuccessfulFetchAt: new Date().toISOString(),
        provider: 'Alpha Vantage',
        status: 'success',
        eventCount: 0,
        markets: ['US'],
        warnings: [],
      },
      events: [],
    };
    const report = validateCalendarFile(emptyCalendar, null, { allowEmptyIfExplicit: false });
    expect(report.isValid).toBe(false);
    expect(report.errors[0]).toContain('contains 0 events');
  });
});
