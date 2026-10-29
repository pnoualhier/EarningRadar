import { storage } from '../../lib/storage';
import { PREFERENCES_STORAGE_KEY } from '../../lib/constants';
import { DEFAULT_PREFERENCES, type UserPreferences } from './preferences';

export function loadPreferences(): UserPreferences {
  const raw = storage.getItem(PREFERENCES_STORAGE_KEY);
  if (!raw) return DEFAULT_PREFERENCES;
  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    storage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.warn('[Preferences] Failed to persist user preferences:', e);
  }
}
