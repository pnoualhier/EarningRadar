import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataFreshness } from '../../src/components/DataFreshness';
import type { CalendarMetadata } from '../../src/types/earnings';

const sampleMetadata: CalendarMetadata = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  lastSuccessfulFetchAt: new Date().toISOString(),
  provider: 'Alpha Vantage Feed',
  status: 'success',
  eventCount: 42,
  markets: ['US', 'EU'],
  warnings: [],
};

describe('DataFreshness component', () => {
  it('displays provider name and event count', () => {
    const handleRefresh = vi.fn();
    render(
      <DataFreshness
        metadata={sampleMetadata}
        isFromCache={false}
        isStale={false}
        onRefresh={handleRefresh}
      />
    );

    expect(screen.getByText('Alpha Vantage Feed')).toBeInTheDocument();
    expect(screen.getByText(/42 événements/)).toBeInTheDocument();
  });

  it('shows PWA local cache badge when from cache', () => {
    render(
      <DataFreshness
        metadata={sampleMetadata}
        isFromCache={true}
        isStale={false}
        onRefresh={() => {}}
      />
    );

    expect(screen.getByText('Cache local PWA')).toBeInTheDocument();
  });

  it('triggers onRefresh when clicking the refresh button', () => {
    const handleRefresh = vi.fn();
    render(
      <DataFreshness
        metadata={sampleMetadata}
        isFromCache={false}
        isStale={false}
        onRefresh={handleRefresh}
      />
    );

    const button = screen.getByRole('button', { name: /Actualiser/i });
    fireEvent.click(button);
    expect(handleRefresh).toHaveBeenCalledTimes(1);
  });
});
