import fs from 'fs';
import path from 'path';
import { validateCalendarFile } from './lib/validate-calendar';

const TARGET_FILE = path.resolve(process.cwd(), 'data/calendar.json');

function main() {
  console.log(`[Validation] Inspecting calendar file at: ${TARGET_FILE}`);

  if (!fs.existsSync(TARGET_FILE)) {
    console.error(`[Error] File not found: ${TARGET_FILE}`);
    process.exit(1);
  }

  let rawData: unknown;
  try {
    const content = fs.readFileSync(TARGET_FILE, 'utf-8');
    rawData = JSON.parse(content);
  } catch (err) {
    console.error('[Error] Failed to parse calendar JSON:', err);
    process.exit(1);
  }

  const report = validateCalendarFile(rawData, null, { allowEmptyIfExplicit: true });

  if (report.warnings.length > 0) {
    console.warn('[Warnings]:');
    report.warnings.forEach((w) => console.warn(`  - ${w}`));
  }

  if (!report.isValid) {
    console.error('[Validation Failed]:');
    report.errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  console.log('✅ Calendar validation passed successfully!');
}

main();
