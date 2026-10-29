import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { CalendarPage } from '../../src/features/calendar/CalendarPage';
import { calendarRepository } from '../../src/services/calendar-repository';
import validCalendar from '../fixtures/valid-calendar.json';

describe('CalendarPage component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(calendarRepository, 'getCalendar').mockResolvedValue({
      calendar: validCalendar as any,
      fromCache: false,
      isStale: false,
    });
    vi.spyOn(calendarRepository, 'getCurrentCalendar').mockReturnValue(validCalendar as any);
  });

  it('renders application title and navigation bars', async () => {
    await act(async () => {
      render(<CalendarPage />);
    });

    expect(screen.getByText(/Earnings/i)).toBeInTheDocument();
    expect(screen.getByText(/Radar/i)).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Tous les marchés/i })).toBeInTheDocument();
  });

  it('allows filtering by market', async () => {
    await act(async () => {
      render(<CalendarPage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Alpha Vantage/i)).toBeInTheDocument();
    });

    const usButton = screen.getByRole('radio', { name: /États-Unis/i });
    await act(async () => {
      fireEvent.click(usButton);
    });
    expect(usButton).toHaveAttribute('aria-checked', 'true');
  });

  it('allows searching companies by query', async () => {
    await act(async () => {
      render(<CalendarPage />);
    });

    const searchInput = screen.getByRole('searchbox');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Apple' } });
    });
    expect(searchInput).toHaveValue('Apple');
  });
});
