import { safeValidateEarningsCalendar } from '../validation/earnings-schemas';
import type { EarningsCalendar } from '../types/earnings';
import { CALENDAR_DATA_URL, CALENDAR_STORAGE_KEY } from '../lib/constants';
import { storage } from '../lib/storage';

export interface CalendarFetchResult {
  calendar: EarningsCalendar;
  fromCache: boolean;
  isStale: boolean;
  error?: string;
}

export class CalendarClient {
  private readonly dataUrl: string;

  constructor(dataUrl: string = CALENDAR_DATA_URL) {
    this.dataUrl = dataUrl;
  }

  /**
   * Fetches latest calendar data with network-first strategy, falling back to cached version.
   */
  async getCalendar(): Promise<CalendarFetchResult> {
    const cachedCalendar = this.getCachedCalendar();

    // If browser is offline, return cached immediately
    if (typeof navigator !== 'undefined' && !navigator.onLine && cachedCalendar) {
      return {
        calendar: cachedCalendar,
        fromCache: true,
        isStale: this.checkStaleness(cachedCalendar.metadata.generatedAt),
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      // Append cache buster to bypass stale HTTP caching when fetching fresh calendar
      const response = await fetch(`${this.dataUrl}?_t=${Date.now()}`, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const rawJson = await response.json();
      const validation = safeValidateEarningsCalendar(rawJson);

      if (!validation.success) {
        console.error('[CalendarClient] Remote calendar failed Zod validation:', validation.errors);
        throw new Error('Données du calendrier corrompues ou invalides.');
      }

      const freshCalendar = validation.data!;
      // Persist to local cache
      this.saveToCache(freshCalendar);

      return {
        calendar: freshCalendar,
        fromCache: false,
        isStale: this.checkStaleness(freshCalendar.metadata.generatedAt),
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn('[CalendarClient] Network fetch failed, attempting cached fallback:', errMsg);

      if (cachedCalendar) {
        return {
          calendar: cachedCalendar,
          fromCache: true,
          isStale: true,
          error: errMsg,
        };
      }

      throw new Error(
        `Impossible de charger le calendrier financier (${errMsg}) et aucune version en cache disponible.`,
        { cause: err }
      );
    }
  }

  getCachedCalendar(): EarningsCalendar | null {
    const raw = storage.getItem(CALENDAR_STORAGE_KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      const validation = safeValidateEarningsCalendar(parsed);
      if (validation.success) {
        return validation.data!;
      }
      console.warn('[CalendarClient] Stored cache failed validation, discarding.');
      storage.removeItem(CALENDAR_STORAGE_KEY);
    } catch {
      storage.removeItem(CALENDAR_STORAGE_KEY);
    }
    return null;
  }

  saveToCache(calendar: EarningsCalendar): void {
    try {
      storage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(calendar));
    } catch (err) {
      console.warn('[CalendarClient] Could not save calendar to cache:', err);
    }
  }

  private checkStaleness(generatedAtIso: string): boolean {
    try {
      const genTime = new Date(generatedAtIso).getTime();
      const ageHours = (Date.now() - genTime) / (1000 * 60 * 60);
      return ageHours > 48; // Considered stale if older than 48 hours
    } catch {
      return true;
    }
  }
}

export const calendarClient = new CalendarClient();
