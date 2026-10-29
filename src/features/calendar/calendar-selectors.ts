import type { EarningsEvent, EarningsSession } from '../../types/earnings';

export function getEventsForDay(events: EarningsEvent[], dayString: string): EarningsEvent[] {
  return events.filter((ev) => ev.announcementDate === dayString);
}

export function groupEventsBySession(
  events: EarningsEvent[]
): Record<EarningsSession, EarningsEvent[]> {
  const groups: Record<EarningsSession, EarningsEvent[]> = {
    before_open: [],
    during_session: [],
    after_close: [],
    unknown: [],
  };

  for (const ev of events) {
    if (groups[ev.session]) {
      groups[ev.session].push(ev);
    } else {
      groups.unknown.push(ev);
    }
  }

  // Sort each group: first by market (US / EU), then alphabetically by symbol
  for (const session of Object.keys(groups) as EarningsSession[]) {
    groups[session].sort((a, b) => a.symbol.localeCompare(b.symbol));
  }

  return groups;
}

export function getWeekSummary(
  events: EarningsEvent[],
  weekDays: string[]
): { total: number; confirmed: number; estimated: number; usCount: number; euCount: number } {
  const weekSet = new Set(weekDays);
  const weekEvents = events.filter((ev) => weekSet.has(ev.announcementDate));

  return {
    total: weekEvents.length,
    confirmed: weekEvents.filter((e) => e.dateStatus === 'confirmed').length,
    estimated: weekEvents.filter((e) => e.dateStatus === 'estimated').length,
    usCount: weekEvents.filter((e) => e.market === 'US').length,
    euCount: weekEvents.filter((e) => e.market === 'EU').length,
  };
}
