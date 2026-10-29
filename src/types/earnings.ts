export type Market = 'US' | 'EU';

export type DateStatus = 'confirmed' | 'estimated' | 'unverified';

export type EarningsSession = 'before_open' | 'after_close' | 'during_session' | 'unknown';

export type SourceType =
  | 'press_release'
  | 'ir_calendar'
  | 'regulatory_filing'
  | 'broker_consensus'
  | 'algorithmic_projection'
  | 'unverified';

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
  sourceType?: SourceType;
  sourceUpdatedAt?: string;
  verifiedAt?: string;
  officialAnnouncementDate?: string;

  fetchedAt: string;
}

export interface CalendarMetadata {
  schemaVersion: number;

  generatedAt: string;
  lastSuccessfulFetchAt: string | null;

  provider: string;

  status: 'success' | 'partial' | 'stale' | 'unavailable';

  eventCount: number;

  markets: Market[];

  warnings: string[];
}

export interface EarningsCalendar {
  metadata: CalendarMetadata;
  events: EarningsEvent[];
}

export interface CalendarFilterOptions {
  market: 'ALL' | Market;
  startDate?: string;
  endDate?: string;
  session?: EarningsSession | 'all';
  dateStatus?: DateStatus | 'all';
  searchQuery?: string;
}
