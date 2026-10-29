import React from 'react';
import type { EarningsEvent, EarningsSession } from '../types/earnings';
import { EarningsEventCard } from './EarningsEventCard';
import { getSessionBadgeInfo } from '../features/calendar/calendar-utils';

interface SessionSectionProps {
  session: EarningsSession;
  events: EarningsEvent[];
  onSelectEvent: (event: EarningsEvent) => void;
}

export const SessionSection: React.FC<SessionSectionProps> = ({
  session,
  events,
  onSelectEvent,
}) => {
  const badgeInfo = getSessionBadgeInfo(session);

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="session-container border-b border-slate-100 last:border-b-0">
      <div className="session-header">
        <span className="flex items-center gap-1.5 font-bold">
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${badgeInfo.iconBg}`}>
            {badgeInfo.shortName}
          </span>
          <span className="text-slate-600">{badgeInfo.fullName}</span>
        </span>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-full">
          {events.length}
        </span>
      </div>

      <div className="space-y-1">
        {events.map((ev) => (
          <EarningsEventCard key={ev.id} event={ev} onClick={onSelectEvent} />
        ))}
      </div>
    </div>
  );
};
