import React from 'react';
import { WifiOff } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export const OfflineBanner: React.FC = () => {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div
      className="bg-amber-600 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-md sticky top-0 z-50"
      role="alert"
    >
      <WifiOff className="w-4 h-4" />
      <span>
        Mode hors ligne actif — Vous consultez la dernière version sauvegardée du calendrier
        financier.
      </span>
    </div>
  );
};
