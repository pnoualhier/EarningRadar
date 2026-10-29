import React from 'react';
import type { EarningsEvent } from '../types/earnings';
import { formatDayHeader } from '../lib/date-utils';
import { groupEventsBySession } from '../features/calendar/calendar-selectors';
import { SessionSection } from './SessionSection';
import { SESSION_ORDER } from '../features/calendar/calendar-utils';

interface DayColumnProps {
  dateStr: string;
  isToday: boolean;
  events: EarningsEvent[];
  onSelectEvent: (event: EarningsEvent) => void;
}

export const DayColumn: React.FC<DayColumnProps> = ({
  dateStr,
  isToday,
  events,
  onSelectEvent,
}) => {
  const { weekday, dayNumber, month } = formatDayHeader(dateStr);
  const grouped = groupEventsBySession(events);

  return (
    <div className={`day-column ${isToday ? 'day-column-today bg-amber-50/20' : ''}`}>
      {/* Sticky header */}
      <div className={`day-column-header p-3 flex items-center justify-between ${isToday ? 'bg-amber-100/50' : ''}`}>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-sm text-slate-800">{weekday}</span>
          <span className="text-xs text-slate-500 font-medium">
            {dayNumber} {month}
          </span>
          {isToday && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 shadow-xs">
              Aujourd’hui
            </span>
          )}
        </div>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            events.length > 0
              ? 'bg-slate-200 text-slate-800'
              : 'bg-slate-100 text-slate-400 font-normal'
          }`}
          title={`${events.length} publication(s)`}
        >
          {events.length}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col divide-y divide-slate-100">
        {events.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <p className="text-xs italic">Aucune publication ce jour</p>
          </div>
        ) : (
          SESSION_ORDER.map((session) => (
            <SessionSection
              key={session}
              session={session}
              events={grouped[session]}
              onSelectEvent={onSelectEvent}
            />
          ))
        )}
      </div>
    </div>
  );
};
