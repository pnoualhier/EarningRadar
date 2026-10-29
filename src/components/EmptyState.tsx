import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  searchQuery?: string;
  onResetFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, onResetFilters }) => {
  return (
    <div className="p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1">
        Aucune publication trouvée
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mb-6">
        {searchQuery
          ? `Aucun résultat ne correspond à la recherche « ${searchQuery} » pour les critères sélectionnés.`
          : 'Aucune annonce de résultats ne correspond à votre filtre de marché, session ou statut sur cette semaine.'}
      </p>
      <button
        type="button"
        onClick={onResetFilters}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition shadow-sm"
      >
        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
        <span>Réinitialiser les filtres</span>
      </button>
    </div>
  );
};
