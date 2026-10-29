import fs from 'fs';
import path from 'path';
import { validateCalendarFile } from './validate-calendar';
import type { EarningsCalendar } from '../../src/types/earnings';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const TARGET_FILE = path.join(DATA_DIR, 'calendar.json');
const TMP_FILE = path.join(DATA_DIR, 'calendar.tmp.json');

export function publishCalendarAtomically(newCalendar: EarningsCalendar): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Load previous valid calendar for comparison if exists
  let previous: EarningsCalendar | null = null;
  if (fs.existsSync(TARGET_FILE)) {
    try {
      previous = JSON.parse(fs.readFileSync(TARGET_FILE, 'utf-8'));
    } catch {
      previous = null;
    }
  }

  // 1. Write to temporary file
  const jsonContent = JSON.stringify(newCalendar, null, 2);
  fs.writeFileSync(TMP_FILE, jsonContent, 'utf-8');

  // 2. Validate temporary file
  const validation = validateCalendarFile(newCalendar, previous);
  if (!validation.isValid) {
    // Delete tmp file and abort without touching target file
    try {
      fs.unlinkSync(TMP_FILE);
    } catch {
      // ignore
    }
    throw new Error(
      `Atomic publish aborted due to validation failures:\n${validation.errors.join('\n')}`
    );
  }

  // 3. Atomically replace target file
  fs.renameSync(TMP_FILE, TARGET_FILE);
  console.log(
    `[Publish] Atomically published ${newCalendar.events.length} events to ${TARGET_FILE}`
  );
}

// CLI entrypoint if executed directly
if (process.argv[1]?.endsWith('publish-calendar.ts')) {
  if (fs.existsSync(TMP_FILE)) {
    const data = JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'));
    publishCalendarAtomically(data);
  } else {
    console.log('[Publish] No temporary calendar file found to publish.');
  }
}
