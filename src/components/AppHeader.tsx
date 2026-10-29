import React from 'react';
import { formatFullFrenchDate, getTodayDateString } from '../lib/date-utils';
import { PWAInstallButton } from './PWAInstallButton';

export const AppHeader: React.FC = () => {
  const todayStr = getTodayDateString('Europe/Paris');
  const fullDate = formatFullFrenchDate(todayStr);

  return (
    <header className="bg-slate-950 border-b border-slate-800 text-slate-100 px-4 md:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center relative shadow-inner">
            <svg className="w-6 h-6" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="24" stroke="#475569" strokeWidth="2" />
              <circle cx="32" cy="32" r="14" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="32" cy="32" r="4" fill="#F59E0B" />
              <path d="M32 32 L48 18" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="44" cy="22" r="2.5" fill="#38BDF8" />
            </svg>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-black tracking-tight text-white uppercase">
                Earnings <span className="text-amber-400">Radar</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Publications de résultats d’entreprises cotées • Wall Street & Places Européennes
            </p>
          </div>
        </div>

        {/* Right side info & PWA install */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-400 block">Date de référence marché</span>
            <span className="text-xs font-semibold text-slate-200 capitalize">
              {fullDate}
            </span>
          </div>

          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
