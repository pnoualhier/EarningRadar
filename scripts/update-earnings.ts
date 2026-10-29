import fs from 'fs';
import path from 'path';
import { fetchAndNormalizeCalendar } from './lib/fetch-calendar';
import { publishCalendarAtomically } from './lib/publish-calendar';
import type { EarningsCalendar } from '../src/types/earnings';

const CALENDAR_PATH = path.resolve(process.cwd(), 'data/calendar.json');

async function main() {
  console.log('--- [Earnings Radar Data Update Pipeline] ---');

  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    console.warn(
      '⚠️ ALPHA_VANTAGE_API_KEY is not defined in environment.\n' +
      'Preserving existing valid data in data/calendar.json without modification.\n' +
      'Please configure ALPHA_VANTAGE_API_KEY in repository secrets for production updates.'
    );
    if (!fs.existsSync(CALENDAR_PATH)) {
      console.warn('No existing data/calendar.json found. Creating initial placeholder template.');
    }
    return;
  }

  // Calculate current date range (next 3 weeks)
  const today = new Date();
  const startDate = today.toISOString().slice(0, 10);
  const future = new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000);
  const endDate = future.toISOString().slice(0, 10);

  console.log(`Fetching earnings from ${startDate} to ${endDate}...`);

  try {
    const { events, warnings } = await fetchAndNormalizeCalendar({
      startDate,
      endDate,
      markets: ['US', 'EU'],
      apiKey,
    });

    const newCalendar: EarningsCalendar = {
      metadata: {
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        lastSuccessfulFetchAt: new Date().toISOString(),
        provider: 'Alpha Vantage (Official API Feed)',
        status: events.length > 0 ? 'success' : 'partial',
        eventCount: events.length,
        markets: ['US', 'EU'],
        warnings,
      },
      events,
    };

    publishCalendarAtomically(newCalendar);
    console.log(`✅ Update pipeline completed successfully with ${events.length} events.`);
  } catch (err: unknown) {
    const errMessage = err instanceof Error ? err.message : String(err);
    // Sanitize any key
    const sanitized = apiKey ? errMessage.split(apiKey).join('[REDACTED_API_KEY]') : errMessage;
    console.error(`❌ Update pipeline failed: ${sanitized}`);
    console.error('Preserving last valid calendar version.');
    process.exit(1);
  }
}

main();
