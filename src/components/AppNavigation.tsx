import React from 'react';
import type { Market, EarningsSession, DateStatus } from '../types/earnings';
import { MarketSelector } from './MarketSelector';
import { WeekNavigator } from './WeekNavigator';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';

interface AppNavigationProps {
  currentMonday: string;
  referenceTodayMonday: string;
  onMondayChange: (monday: string) => void;
  selectedMarket: 'ALL' | Market;
  onSelectMarket: (market: 'ALL' | Market) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sessionFilter: EarningsSession | 'all';
  onSessionFilterChange: (session: EarningsSession | 'all') => void;
  statusFilter: DateStatus | 'all';
  onStatusFilterChange: (status: DateStatus | 'all') => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  totalFilteredCount: number;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({
  currentMonday,
  referenceTodayMonday,
  onMondayChange,
  selectedMarket,
  onSelectMarket,
  searchQuery,
  onSearchChange,
  sessionFilter,
  onSessionFilterChange,
  statusFilter,
  onStatusFilterChange,
  onResetFilters,
  hasActiveFilters,
  totalFilteredCount,
}) => {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-slate-100 px-4 md:px-8 py-3 space-y-3">
      {/* Top navigation row: Week navigation and Market switch */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <WeekNavigator
          currentMonday={currentMonday}
          referenceTodayMonday={referenceTodayMonday}
          onMondayChange={onMondayChange}
        />

        <div className="flex flex-wrap items-center gap-3">
          <MarketSelector
            selectedMarket={selectedMarket}
            onSelectMarket={onSelectMarket}
          />
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
            {totalFilteredCount} {totalFilteredCount > 1 ? 'entreprises' : 'entreprise'}
          </span>
        </div>
      </div>

      {/* Second row: Search & Filters */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        <SearchBar value={searchQuery} onChange={onSearchChange} />

        <FilterPanel
          session={sessionFilter}
          dateStatus={statusFilter}
          onSessionChange={onSessionFilterChange}
          onStatusChange={onStatusFilterChange}
          onReset={onResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
    </nav>
  );
};
