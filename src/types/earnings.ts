export type Market = "US" | "EU";

export type DateStatus =
  | "confirmed"
  | "estimated"
  | "unverified";

export type EarningsSession =
  | "before_open"
  | "after_close"
  | "during_session"
  | "unknown";

export interface EarningsEvent {
  id: string;

  symbol: string;
  companyName: string;

  market: Market;
  exchange?: string;
  country?: string;

  announcementDate: string;
  announcementTime?: string;
  timeZone?: string;

  session: EarningsSession;
  dateStatus: DateStatus;

  fiscalPeriod?: string;

  epsEstimate?: number;
  epsActual?: number;

  revenueEstimate?: number;
  revenueActual?: number;

  currency?: string;

  sourceName: string;
  sourceUrl?: string;
  sourceUpdatedAt?: string;

  fetchedAt: string;
}

export interface CalendarMetadata {
  schemaVersion: number;

  generatedAt: string;
  lastSuccessfulFetchAt: string | null;

  provider: string;

  status:
    | "success"
    | "partial"
    | "stale"
    | "unavailable";

  eventCount: number;

  markets: Market[];

  warnings: string[];
}

export interface EarningsCalendar {
  metadata: CalendarMetadata;
  events: EarningsEvent[];
}

export interface CalendarFilterOptions {
  market: "ALL" | Market;
  startDate?: string;
  endDate?: string;
  session?: EarningsSession | "all";
  dateStatus?: DateStatus | "all";
  searchQuery?: string;
}
