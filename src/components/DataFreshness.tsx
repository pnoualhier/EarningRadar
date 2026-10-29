import React from 'react';
import { RefreshCw, Database, AlertTriangle } from 'lucide-react';
import type { CalendarMetadata } from '../types/earnings';
import { formatRelativeFreshness } from '../lib/formatters';

interface DataFreshnessProps {
  metadata: CalendarMetadata;
  isFromCache: boolean;
  isStale: boolean;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const DataFreshness: React.FC<DataFreshnessProps> = ({
  metadata,
  isFromCache,
  isStale,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Database className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-medium text-slate-200">Source :</span>
          <span>{metadata.provider}</span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <span>Dernière synchro :</span>
          <span className="text-slate-300 font-medium">
            {formatRelativeFreshness(metadata.generatedAt)}
          </span>
        </div>

        {isFromCache && (
          <span className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 text-[11px] font-medium">
            Cache local PWA
          </span>
        )}

        {isStale && (
          <div className="flex items-center gap-1 text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span className="text-[11px] font-medium">Données non actualisées depuis &gt; 48h</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[11px] text-slate-500">{metadata.eventCount} événements</span>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition disabled:opacity-50"
          title="Vérifier les mises à jour"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          <span className="text-[11px]">Actualiser</span>
        </button>
      </div>
    </div>
  );
};
