import React from 'react';
import type { EarningsEvent } from '../types/earnings';
import { StatusBadge } from './StatusBadge';
import { formatRevenue, formatEps } from '../lib/formatters';
import { formatAnnouncementTime } from '../lib/date-utils';
import { Clock } from 'lucide-react';

interface EarningsEventCardProps {
  event: EarningsEvent;
  onClick: (event: EarningsEvent) => void;
}

export const EarningsEventCard: React.FC<EarningsEventCardProps> = ({ event, onClick }) => {
  const formattedTime = formatAnnouncementTime(event.announcementTime, event.timeZone);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(event);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(event)}
      onKeyDown={handleKeyDown}
      className="event-card group hover:border-amber-400/80 transition-all text-left w-full select-none"
      aria-label={`Détails financiers pour ${event.companyName} (${event.symbol})`}
    >
      <div className="flex items-start justify-between gap-1.5 mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-xs tracking-tight text-slate-900 group-hover:text-amber-700 transition">
            {event.symbol}
          </span>
          <span
            className={`text-[9px] px-1 py-0.2 rounded font-semibold ${
              event.market === 'US'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {event.market}
          </span>
        </div>

        <StatusBadge status={event.dateStatus} size="sm" />
      </div>

      <div className="text-[11px] font-medium text-slate-700 line-clamp-1 mb-2">
        {event.companyName}
      </div>

      <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[10px] text-slate-500">
        <div className="flex items-center gap-1 font-mono">
          {formattedTime ? (
            <span className="flex items-center gap-0.5 text-slate-700 font-semibold">
              <Clock className="w-2.5 h-2.5 text-slate-400" />
              {formattedTime}
            </span>
          ) : (
            <span className="text-slate-400">Heure non fixée</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {event.epsEstimate !== undefined && (
            <span title="Bénéfice net par action estimé">
              BPA:{' '}
              <strong className="text-slate-800">
                {formatEps(event.epsEstimate, event.currency)}
              </strong>
            </span>
          )}
          {event.revenueEstimate !== undefined && (
            <span title="Chiffre d’affaires estimé">
              CA:{' '}
              <strong className="text-slate-800">
                {formatRevenue(event.revenueEstimate, event.currency)}
              </strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
