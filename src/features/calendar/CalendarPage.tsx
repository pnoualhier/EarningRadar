import React, { useState, useMemo } from 'react';
import type { Market, EarningsSession, DateStatus, EarningsEvent } from '../../types/earnings';
import { useCalendarData } from '../../hooks/useCalendarData';
import { usePreferences } from '../../hooks/usePreferences';
import {
  getMondayOfWeek,
  getWorkdaysOfWeek,
  getTodayDateString,
  formatDayHeader,
} from '../../lib/date-utils';
import { filterEvents } from '../search/search-utils';
import { getEventsForDay } from './calendar-selectors';

import { AppHeader } from '../../components/AppHeader';
import { AppNavigation } from '../../components/AppNavigation';
import { DataFreshness } from '../../components/DataFreshness';
import { OfflineBanner } from '../../components/OfflineBanner';
import { DayColumn } from '../../components/DayColumn';
import { CompanyDetail } from '../../components/CompanyDetail';
import { LoadingState } from '../../components/LoadingState';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { SessionSection } from '../../components/SessionSection';
import { SESSION_ORDER } from './calendar-utils';
import { groupEventsBySession } from './calendar-selectors';

export const CalendarPage: React.FC = () => {
  const { calendar, isLoading, error, isFromCache, isStale, refresh } = useCalendarData();
  const { preferences, updatePreferences } = usePreferences();

  const todayStr = useMemo(() => getTodayDateString('Europe/Paris'), []);
  const referenceTodayMonday = useMemo(() => getMondayOfWeek(todayStr), [todayStr]);

  // Current selected week Monday
  const [currentMonday, setCurrentMonday] = useState<string>(() => referenceTodayMonday);

  // Filters
  const [selectedMarket, setSelectedMarket] = useState<'ALL' | Market>(
    () => preferences.defaultMarket || 'ALL'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sessionFilter, setSessionFilter] = useState<EarningsSession | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DateStatus | 'all'>('all');

  // Mobile selected day (defaults to today if inside week, else Monday)
  const workdays = useMemo(() => getWorkdaysOfWeek(currentMonday), [currentMonday]);
  const [mobileSelectedDay, setMobileSelectedDay] = useState<string>(() => {
    return workdays.includes(todayStr) ? todayStr : workdays[0];
  });

  // Selected company detail modal
  const [selectedEvent, setSelectedEvent] = useState<EarningsEvent | null>(null);

  const handleSelectMarket = (m: 'ALL' | Market) => {
    setSelectedMarket(m);
    updatePreferences({ defaultMarket: m });
  };

  const handleResetFilters = () => {
    setSelectedMarket('ALL');
    setSearchQuery('');
    setSessionFilter('all');
    setStatusFilter('all');
  };

  const hasActiveFilters =
    selectedMarket !== 'ALL' ||
    searchQuery.trim() !== '' ||
    sessionFilter !== 'all' ||
    statusFilter !== 'all';

  // Apply search & filters across all events
  const filteredEvents = useMemo(() => {
    if (!calendar) return [];
    return filterEvents(calendar.events, {
      market: selectedMarket,
      searchQuery,
      session: sessionFilter,
      dateStatus: statusFilter,
    });
  }, [calendar, selectedMarket, searchQuery, sessionFilter, statusFilter]);

  // Events belonging strictly to current displayed week
  const weekEvents = useMemo(() => {
    const weekSet = new Set(workdays);
    return filteredEvents.filter((ev) => weekSet.has(ev.announcementDate));
  }, [filteredEvents, workdays]);

  // Mobile day events
  const mobileEvents = useMemo(() => {
    return getEventsForDay(filteredEvents, mobileSelectedDay);
  }, [filteredEvents, mobileSelectedDay]);

  const mobileGrouped = useMemo(() => {
    return groupEventsBySession(mobileEvents);
  }, [mobileEvents]);

  return (
    <div className="app-container">
      <OfflineBanner />
      <AppHeader />

      <AppNavigation
        currentMonday={currentMonday}
        referenceTodayMonday={referenceTodayMonday}
        onMondayChange={(monday) => {
          setCurrentMonday(monday);
          const nextWorkdays = getWorkdaysOfWeek(monday);
          setMobileSelectedDay(nextWorkdays[0]);
        }}
        selectedMarket={selectedMarket}
        onSelectMarket={handleSelectMarket}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sessionFilter={sessionFilter}
        onSessionFilterChange={setSessionFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        totalFilteredCount={weekEvents.length}
      />

      {calendar && (
        <DataFreshness
          metadata={calendar.metadata}
          isFromCache={isFromCache}
          isStale={isStale}
          onRefresh={refresh}
          isLoading={isLoading}
        />
      )}

      {/* Main Board */}
      <main className="calendar-board-container flex flex-col">
        {isLoading && !calendar ? (
          <LoadingState />
        ) : error && !calendar ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : weekEvents.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            onResetFilters={handleResetFilters}
          />
        ) : (
          <>
            {/* Desktop 5-day columns view (hidden on screens < 1024px) */}
            <div className="hidden lg:grid calendar-grid flex-1">
              {workdays.map((day) => {
                const dayEvents = getEventsForDay(weekEvents, day);
                return (
                  <DayColumn
                    key={day}
                    dateStr={day}
                    isToday={day === todayStr}
                    events={dayEvents}
                    onSelectEvent={setSelectedEvent}
                  />
                );
              })}
            </div>

            {/* Mobile optimized view (shown on screens < 1024px) */}
            <div className="lg:hidden flex-1 flex flex-col bg-slate-50">
              {/* Horizontal day tab selector */}
              <div
                className="flex items-center gap-1.5 p-2 bg-slate-200/80 border-b border-slate-300 overflow-x-auto select-none"
                role="tablist"
                aria-label="Jours de la semaine"
              >
                {workdays.map((day) => {
                  const { weekday, dayNumber } = formatDayHeader(day);
                  const isSelected = mobileSelectedDay === day;
                  const isDayToday = day === todayStr;
                  const count = getEventsForDay(weekEvents, day).length;

                  return (
                    <button
                      key={day}
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setMobileSelectedDay(day)}
                      className={`flex-1 min-w-[62px] py-2 px-1 rounded-lg text-center transition ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-md font-bold'
                          : 'bg-white text-slate-700 hover:bg-slate-100 font-medium'
                      } ${isDayToday && !isSelected ? 'ring-2 ring-amber-500' : ''}`}
                    >
                      <div className="text-[10px] uppercase tracking-wider">{weekday}</div>
                      <div className="text-sm font-extrabold">{dayNumber}</div>
                      <div
                        className={`text-[9px] px-1 rounded-full inline-block mt-0.5 ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'bg-slate-200 text-slate-700 font-medium'
                        }`}
                      >
                        {count}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Day content on mobile */}
              <div className="flex-1 p-3">
                {mobileEvents.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs italic">
                    Aucune publication financière prévue pour cette journée.
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden divide-y divide-slate-100">
                    {SESSION_ORDER.map((session) => (
                      <SessionSection
                        key={session}
                        session={session}
                        events={mobileGrouped[session]}
                        onSelectEvent={setSelectedEvent}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Detail drawer / modal */}
      <CompanyDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};
