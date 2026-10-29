import type { Market } from '../../types/earnings';

export interface UserPreferences {
  defaultMarket: 'ALL' | Market;
  displayMode: 'week' | 'day';
  timeZonePreference: string;
  soundEnabled: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultMarket: 'ALL',
  displayMode: 'week',
  timeZonePreference: 'Europe/Paris',
  soundEnabled: false,
};
