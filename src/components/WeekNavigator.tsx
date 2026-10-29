import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { formatWeekRange, shiftWeek, getMondayOfWeek } from '../lib/date-utils';

interface WeekNavigatorProps {
  currentMonday: string;
  referenceTodayMonday: string;
  onMondayChange: (monday: string) => void;
}

export const WeekNavigator: React.FC<WeekNavigatorProps> = ({
  currentMonday,
  referenceTodayMonday,
  onMondayChange,
}) => {
  const isCurrentWeek = currentMonday === referenceTodayMonday;

  const handlePrev = () => {
    onMondayChange(shiftWeek(currentMonday, -1));
  };

  const handleNext = () => {
    onMondayChange(shiftWeek(currentMonday, 1));
  };

  const handleToday = () => {
    onMondayChange(referenceTodayMonday);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-lg bg-slate-800 border border-slate-700/80 p-0.5 shadow-sm">
        <button
          type="button"
          onClick={handlePrev}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition"
          aria-label="Semaine précédente"
          title="Semaine précédente"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 text-xs md:text-sm font-semibold text-amber-400 tracking-wide select-none min-w-[190px] text-center">
          {formatWeekRange(currentMonday)}
        </span>

        <button
          type="button"
          onClick={handleNext}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition"
          aria-label="Semaine suivante"
          title="Semaine suivante"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {!isCurrentWeek && (
        <button
          type="button"
          onClick={handleToday}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-700/80 transition"
        >
          <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>Aujourd’hui</span>
        </button>
      )}
    </div>
  );
};
