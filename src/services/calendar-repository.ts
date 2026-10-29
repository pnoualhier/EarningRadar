import { calendarClient, type CalendarFetchResult } from './calendar-client';
import type { EarningsCalendar } from '../types/earnings';

export class CalendarRepository {
  private inMemoryCache: EarningsCalendar | null = null;

  async getCalendar(): Promise<CalendarFetchResult> {
    const result = await calendarClient.getCalendar();
    this.inMemoryCache = result.calendar;
    return result;
  }

  getCurrentCalendar(): EarningsCalendar | null {
    return this.inMemoryCache || calendarClient.getCachedCalendar();
  }
}

export const calendarRepository = new CalendarRepository();
