import { describe, it, expect } from 'vitest';
import {
  getMondayOfWeek,
  getWorkdaysOfWeek,
  isValidDateString,
  addDays,
  shiftWeek,
  formatWeekRange,
  formatAnnouncementTime,
} from '../../src/lib/date-utils';

describe('date-utils', () => {
  it('validates calendar date format correctly without timezone drift', () => {
    expect(isValidDateString('2026-10-29')).toBe(true);
    expect(isValidDateString('2026-02-28')).toBe(true);
    expect(isValidDateString('2026-02-29')).toBe(false); // 2026 is not leap year
    expect(isValidDateString('2026-04-31')).toBe(false); // April has 30 days
    expect(isValidDateString('invalid')).toBe(false);
  });

  it('calculates the Monday of the week consistently', () => {
    // Thursday Oct 29, 2026 -> Monday Oct 26, 2026
    expect(getMondayOfWeek('2026-10-29')).toBe('2026-10-26');
    // Monday Oct 26, 2026 -> Monday Oct 26, 2026
    expect(getMondayOfWeek('2026-10-26')).toBe('2026-10-26');
    // Sunday Nov 1, 2026 -> Monday Oct 26, 2026
    expect(getMondayOfWeek('2026-11-01')).toBe('2026-10-26');
  });

  it('generates the 5 workdays (Monday through Friday)', () => {
    const days = getWorkdaysOfWeek('2026-10-26');
    expect(days).toEqual(['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30']);
  });

  it('shifts days and weeks accurately across month boundaries', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(shiftWeek('2026-10-26', 1)).toBe('2026-11-02');
    expect(shiftWeek('2026-10-26', -1)).toBe('2026-10-19');
  });

  it('formats week ranges in French nicely', () => {
    const range = formatWeekRange('2026-10-26');
    expect(range).toContain('Du 26 au 30 octobre 2026');
  });

  it('formats announcement time with timezone safely', () => {
    expect(formatAnnouncementTime('16:30', 'America/New_York')).toBe('16:30 (New York)');
    expect(formatAnnouncementTime('07:30', 'Europe/Paris')).toBe('07:30 (Paris)');
    expect(formatAnnouncementTime(undefined)).toBeNull();
  });
});
