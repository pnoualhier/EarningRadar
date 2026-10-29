/**
 * Date utilities for Earnings Radar.
 * Dates of announcement are treated as calendar day strings (YYYY-MM-DD)
 * to prevent browser timezone offsets from shifting dates across midnight.
 */

export function isValidDateString(dateStr: string): boolean {
  if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(dateStr)) {
    return false;
  }
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

/**
 * Returns today's date formatted as YYYY-MM-DD in the provided or system timezone.
 */
export function getTodayDateString(timeZone: string = 'Europe/Paris'): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

/**
 * Returns the Monday of the week containing the given YYYY-MM-DD date.
 */
export function getMondayOfWeek(dateStr: string): string {
  if (!isValidDateString(dateStr)) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  // getUTCDay: 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const dayOfWeek = date.getUTCDay();
  // Monday is 1. If Sunday (0), offset is -6. Otherwise offset is -(dayOfWeek - 1)
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  date.setUTCDate(date.getUTCDate() + diffToMonday);
  return date.toISOString().slice(0, 10);
}

/**
 * Returns the 5 workdays (Monday through Friday) of the week starting at mondayStr.
 */
export function getWorkdaysOfWeek(mondayStr: string): string[] {
  if (!isValidDateString(mondayStr)) {
    throw new Error(`Invalid monday string: ${mondayStr}`);
  }
  const [y, m, d] = mondayStr.split('-').map(Number);
  const days: string[] = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date(Date.UTC(y, m - 1, d + i));
    days.push(date.toISOString().slice(0, 10));
  }
  return days;
}

/**
 * Shifts a YYYY-MM-DD date by +/- N days.
 */
export function addDays(dateStr: string, days: number): string {
  if (!isValidDateString(dateStr)) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10);
}

/**
 * Shifts a week's Monday by +/- N weeks.
 */
export function shiftWeek(mondayStr: string, weeks: number): string {
  return addDays(mondayStr, weeks * 7);
}

/**
 * Formats a YYYY-MM-DD date into localized French string.
 * Example: "Lundi 26 octobre 2026"
 */
export function formatFullFrenchDate(dateStr: string): string {
  if (!isValidDateString(dateStr)) return dateStr;
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/**
 * Formats a YYYY-MM-DD into short workday header: "Lun. 26 oct."
 */
export function formatDayHeader(dateStr: string): {
  weekday: string;
  dayNumber: string;
  month: string;
} {
  if (!isValidDateString(dateStr)) {
    return { weekday: '', dayNumber: '', month: '' };
  }
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  
  const weekday = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    timeZone: 'UTC',
  }).format(date);

  const dayNumber = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);

  const month = new Intl.DateTimeFormat('fr-FR', {
    month: 'short',
    timeZone: 'UTC',
  }).format(date);

  return {
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
    dayNumber,
    month,
  };
}

/**
 * Formats a week range: "Du 26 au 30 octobre 2026"
 */
export function formatWeekRange(mondayStr: string): string {
  const fridayStr = addDays(mondayStr, 4);
  const [mY, mM, mD] = mondayStr.split('-').map(Number);
  const [fY, fM, fD] = fridayStr.split('-').map(Number);

  const mDate = new Date(Date.UTC(mY, mM - 1, mD));
  const fDate = new Date(Date.UTC(fY, fM - 1, fD));

  const fMonthYear = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(fDate);

  if (mM === fM && mY === fY) {
    return `Du ${mD} au ${fD} ${fMonthYear}`;
  }

  const mMonthYear = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(mDate);

  return `Du ${mD} ${mMonthYear} au ${fD} ${fMonthYear}`;
}

/**
 * Formats announcement time (HH:mm) if present with timezone abbreviation.
 */
export function formatAnnouncementTime(
  time?: string,
  timeZone?: string
): string | null {
  if (!time) return null;
  if (!timeZone) return `${time}`;
  return `${time} (${timeZone.split('/').pop()?.replace('_', ' ') || timeZone})`;
}
