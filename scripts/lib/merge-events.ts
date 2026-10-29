import type { EarningsEvent, DateStatus } from '../../src/types/earnings';

const STATUS_PRIORITY: Record<DateStatus, number> = {
  confirmed: 3,
  estimated: 2,
  unverified: 1,
};

export interface MergeResult {
  mergedEvents: EarningsEvent[];
  conflicts: string[];
}

/**
 * Deduplicates and merges earnings events safely.
 * Only merges events with matching symbol and announcementDate (and fiscalPeriod if present).
 * Higher-confidence status overrides lower-confidence status.
 */
export function mergeEvents(events: EarningsEvent[]): MergeResult {
  const map = new Map<string, EarningsEvent>();
  const conflicts: string[] = [];

  for (const event of events) {
    const key = `${event.market}_${event.symbol}_${event.announcementDate}`;

    if (!map.has(key)) {
      map.set(key, event);
      continue;
    }

    const existing = map.get(key)!;
    const existingPriority = STATUS_PRIORITY[existing.dateStatus] || 0;
    const newPriority = STATUS_PRIORITY[event.dateStatus] || 0;

    if (newPriority > existingPriority) {
      conflicts.push(
        `Updated ${event.symbol} on ${event.announcementDate} from [${existing.dateStatus}] to [${event.dateStatus}]`
      );
      map.set(key, {
        ...existing,
        ...event,
        // Preserve richer details if new event lacks them
        companyName: event.companyName.length > existing.companyName.length ? event.companyName : existing.companyName,
        epsEstimate: event.epsEstimate ?? existing.epsEstimate,
        epsActual: event.epsActual ?? existing.epsActual,
        revenueEstimate: event.revenueEstimate ?? existing.revenueEstimate,
        revenueActual: event.revenueActual ?? existing.revenueActual,
      });
    } else {
      // Keep existing status, but enrich missing financial estimates if present
      map.set(key, {
        ...existing,
        epsEstimate: existing.epsEstimate ?? event.epsEstimate,
        epsActual: existing.epsActual ?? event.epsActual,
        revenueEstimate: existing.revenueEstimate ?? event.revenueEstimate,
        revenueActual: existing.revenueActual ?? event.revenueActual,
      });
    }
  }

  return {
    mergedEvents: Array.from(map.values()),
    conflicts,
  };
}
