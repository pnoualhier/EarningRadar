export const APP_NAME = 'Earnings Radar';
export const APP_VERSION = '1.0.0';

export const CALENDAR_DATA_URL = '/data/calendar.json';
export const CALENDAR_STORAGE_KEY = 'earnings_radar_calendar_v1';
export const PREFERENCES_STORAGE_KEY = 'earnings_radar_preferences_v1';

export const REFERENCE_TIMEZONES = {
  US: 'America/New_York',
  EU_FR: 'Europe/Paris',
  EU_DE: 'Europe/Berlin',
  EU_UK: 'Europe/London',
  EU_CH: 'Europe/Zurich',
} as const;

export const MARKET_LABELS: Record<string, string> = {
  ALL: 'Tous les marchés',
  US: 'États-Unis (NYSE, Nasdaq)',
  EU: 'Europe (CAC 40, DAX, FTSE...)',
};

export const SESSION_LABELS: Record<string, { label: string; short: string; description: string }> = {
  before_open: {
    label: 'Avant ouverture',
    short: 'BMO',
    description: 'Publication avant le début des cotations',
  },
  during_session: {
    label: 'Pendant la séance',
    short: 'Pendant',
    description: 'Publication en cours de séance boursière',
  },
  after_close: {
    label: 'Après clôture',
    short: 'AMC',
    description: 'Publication après la fin de la séance',
  },
  unknown: {
    label: 'Horaire inconnu',
    short: 'Inconnu',
    description: 'Horaire précis ou session non précisée',
  },
};

export const STATUS_LABELS: Record<string, { label: string; description: string }> = {
  confirmed: {
    label: 'Confirmé',
    description: 'Date et horaire confirmés officiellement par l’entreprise',
  },
  estimated: {
    label: 'Estimé',
    description: 'Date estimée par les analystes ou algorithmes',
  },
  unverified: {
    label: 'À vérifier',
    description: 'Date non vérifiée ou provenant d’une source secondaire',
  },
};
