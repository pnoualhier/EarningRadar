import type { EarningsEvent, CalendarFilterOptions } from '../../types/earnings';

export function filterEvents(
  events: EarningsEvent[],
  filters: CalendarFilterOptions
): EarningsEvent[] {
  return events.filter((ev) => {
    // 1. Market filter
    if (filters.market && filters.market !== 'ALL') {
      if (ev.market !== filters.market) return false;
    }

    // 2. Session filter
    if (filters.session && filters.session !== 'all') {
      if (ev.session !== filters.session) return false;
    }

    // 3. Status filter
    if (filters.dateStatus && filters.dateStatus !== 'all') {
      if (ev.dateStatus !== filters.dateStatus) return false;
    }

    // 4. Date range filter
    if (filters.startDate && ev.announcementDate < filters.startDate) {
      return false;
    }
    if (filters.endDate && ev.announcementDate > filters.endDate) {
      return false;
    }

    // 5. Text search query (symbol, name, exchange)
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchSymbol = ev.symbol.toLowerCase().includes(q);
      const matchName = ev.companyName.toLowerCase().includes(q);
      const matchExchange = ev.exchange ? ev.exchange.toLowerCase().includes(q) : false;
      const matchCountry = ev.country ? ev.country.toLowerCase().includes(q) : false;

      if (!matchSymbol && !matchName && !matchExchange && !matchCountry) {
        return false;
      }
    }

    return true;
  });
}
