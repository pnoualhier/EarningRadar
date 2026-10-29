import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import type { EarningsSession, DateStatus } from '../types/earnings';

interface FilterPanelProps {
  session: EarningsSession | 'all';
  dateStatus: DateStatus | 'all';
  onSessionChange: (session: EarningsSession | 'all') => void;
  onStatusChange: (status: DateStatus | 'all') => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  session,
  dateStatus,
  onSessionChange,
  onStatusChange,
  onReset,
  hasActiveFilters,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <div className="flex items-center gap-1 text-slate-400 font-medium">
        <Filter className="w-3.5 h-3.5" />
        <span>Filtres :</span>
      </div>

      {/* Session filter */}
      <select
        value={session}
        onChange={(e) => onSessionChange(e.target.value as EarningsSession | 'all')}
        className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-2.5 py-1 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
        aria-label="Filtrer par session de marché"
      >
        <option value="all">Toutes les sessions</option>
        <option value="before_open">Avant ouverture (BMO)</option>
        <option value="after_close">Après clôture (AMC)</option>
        <option value="during_session">Pendant la séance</option>
        <option value="unknown">Horaire inconnu</option>
      </select>

      {/* Status filter */}
      <select
        value={dateStatus}
        onChange={(e) => onStatusChange(e.target.value as DateStatus | 'all')}
        className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-2.5 py-1 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
        aria-label="Filtrer par statut de confirmation"
      >
        <option value="all">Tous les statuts</option>
        <option value="confirmed">Confirmé uniquement</option>
        <option value="estimated">Estimé</option>
        <option value="unverified">À vérifier</option>
      </select>

      {/* Reset button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 border border-amber-500/30 transition"
          aria-label="Réinitialiser tous les filtres"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Réinitialiser</span>
        </button>
      )}
    </div>
  );
};
