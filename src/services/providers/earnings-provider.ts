import type { Market } from '../../types/earnings';

export interface FetchCalendarOptions {
  startDate: string;
  endDate: string;
  markets: Market[];
}

export interface EarningsProvider {
  readonly name: string;
  fetchCalendar(options: FetchCalendarOptions): Promise<unknown>;
}
