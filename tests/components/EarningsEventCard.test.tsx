import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EarningsEventCard } from '../../src/components/EarningsEventCard';
import type { EarningsEvent } from '../../src/types/earnings';

const sampleEvent: EarningsEvent = {
  id: 'US_AAPL_2026-10-29_after_close',
  symbol: 'AAPL',
  companyName: 'Apple Inc.',
  market: 'US',
  announcementDate: '2026-10-29',
  announcementTime: '16:30',
  timeZone: 'America/New_York',
  session: 'after_close',
  dateStatus: 'confirmed',
  epsEstimate: 1.6,
  revenueEstimate: 94500000000,
  currency: 'USD',
  sourceName: 'Apple Investor Relations',
  fetchedAt: '2026-10-29T10:00:00.000Z',
};

describe('EarningsEventCard component', () => {
  it('renders symbol, company name and status badge', () => {
    const handleClick = vi.fn();
    render(<EarningsEventCard event={sampleEvent} onClick={handleClick} />);

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.getByText('Confirmé')).toBeInTheDocument();
    expect(screen.getByText('US')).toBeInTheDocument();
  });

  it('triggers onClick callback when clicked or activated with Enter', () => {
    const handleClick = vi.fn();
    render(<EarningsEventCard event={sampleEvent} onClick={handleClick} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledWith(sampleEvent);

    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
