import { useState, useCallback } from 'react';
import { loadPreferences, savePreferences } from '../features/preferences/preferences-storage';
import type { UserPreferences } from '../features/preferences/preferences';

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadPreferences());

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updates };
      savePreferences(next);
      return next;
    });
  }, []);

  return { preferences, updatePreferences };
}
