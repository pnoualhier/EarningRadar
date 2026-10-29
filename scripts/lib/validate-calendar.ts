import { safeValidateEarningsCalendar } from '../../src/validation/earnings-schemas';
import type { EarningsCalendar } from '../../src/types/earnings';

export interface ValidationReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateCalendarFile(
  data: unknown,
  previousValidCalendar?: EarningsCalendar | null,
  options: { minEventsThreshold?: number; allowEmptyIfExplicit?: boolean } = {}
): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  const schemaResult = safeValidateEarningsCalendar(data);
  if (!schemaResult.success) {
    errors.push(...(schemaResult.errors || ['Schema validation failed.']));
    return { isValid: false, errors, warnings };
  }

  const calendar = schemaResult.data!;

  // Check 1: Unexpected empty calendar
  if (calendar.events.length === 0) {
    if (options.allowEmptyIfExplicit && calendar.metadata.status === 'unavailable') {
      warnings.push('Calendar is currently empty with status=unavailable.');
    } else {
      errors.push('Blocking anomaly: Calendar contains 0 events while provider reported success.');
    }
  }

  // Check 2: Minimum events threshold (configurable, default 1)
  const minThreshold = options.minEventsThreshold ?? 1;
  if (calendar.events.length > 0 && calendar.events.length < minThreshold) {
    warnings.push(
      `Low event count: ${calendar.events.length} events (expected at least ${minThreshold}).`
    );
  }

  // Check 3: Sudden drop check against previous valid calendar
  if (previousValidCalendar && previousValidCalendar.events.length > 20) {
    const previousCount = previousValidCalendar.events.length;
    const currentCount = calendar.events.length;
    if (currentCount < previousCount * 0.25) {
      warnings.push(
        `Severe volume drop warning: event count fell from ${previousCount} to ${currentCount}.`
      );
    }
  }

  // Check 4: Check if generatedAt is in the future by more than 1 day
  const genTime = new Date(calendar.metadata.generatedAt).getTime();
  const now = Date.now();
  if (genTime > now + 86400000) {
    errors.push(
      `Anomaly: generatedAt (${calendar.metadata.generatedAt}) is over 24h into the future.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
