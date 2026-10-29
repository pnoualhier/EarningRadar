import React from 'react';
import type { Market } from '../types/earnings';

interface MarketSelectorProps {
  selectedMarket: 'ALL' | Market;
  onSelectMarket: (market: 'ALL' | Market) => void;
}

export const MarketSelector: React.FC<MarketSelectorProps> = ({
  selectedMarket,
  onSelectMarket,
}) => {
  const options: Array<{ id: 'ALL' | Market; label: string; flag?: string }> = [
    { id: 'ALL', label: 'Tous les marchés' },
    { id: 'US', label: 'États-Unis', flag: '🇺🇸' },
    { id: 'EU', label: 'Europe', flag: '🇪🇺' },
  ];

  return (
    <div
      className="inline-flex items-center rounded-lg bg-slate-800/80 p-1 border border-slate-700/60 shadow-inner"
      role="radiogroup"
      aria-label="Sélecteur de marché boursier"
    >
      {options.map((opt) => {
        const isSelected = selectedMarket === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelectMarket(opt.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              isSelected
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {opt.flag && <span className="text-sm" aria-hidden="true">{opt.flag}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
