import { useState, useEffect, useCallback } from 'react';
import { calendarRepository } from '../services/calendar-repository';
import type { EarningsCalendar } from '../types/earnings';

export interface CalendarDataState {
  calendar: EarningsCalendar | null;
  isLoading: boolean;
  error: string | null;
  isFromCache: boolean;
  isStale: boolean;
  refresh: () => Promise<void>;
}

export function useCalendarData(): CalendarDataState {
  const [calendar, setCalendar] = useState<EarningsCalendar | null>(() =>
    calendarRepository.getCurrentCalendar()
  );
  const [isLoading, setIsLoading] = useState<boolean>(!calendar);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);
  const [isStale, setIsStale] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await calendarRepository.getCalendar();
      setCalendar(result.calendar);
      setIsFromCache(result.fromCache);
      setIsStale(result.isStale);
      if (result.error) {
        setError(result.error);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    calendar,
    isLoading,
    error,
    isFromCache,
    isStale,
    refresh: loadData,
  };
}
