import { z } from 'zod';
import type { EarningsCalendar, EarningsEvent, CalendarMetadata } from '../types/earnings';

// Regex for YYYY-MM-DD
const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
// Regex for HH:mm
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

function isValidCalendarDate(dateStr: string): boolean {
  if (!DATE_REGEX.test(dateStr)) return false;
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  const date = new Date(Date.UTC(year, month, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month && date.getUTCDate() === day
  );
}

export const MarketSchema = z.enum(['US', 'EU']);

export const DateStatusSchema = z.enum(['confirmed', 'estimated', 'unverified']);

export const EarningsSessionSchema = z.enum([
  'before_open',
  'after_close',
  'during_session',
  'unknown',
]);

export const SourceTypeSchema = z.enum([
  'press_release',
  'ir_calendar',
  'regulatory_filing',
  'broker_consensus',
  'algorithmic_projection',
  'unverified',
]);

export const EarningsEventSchema = z
  .object({
    id: z.string().min(1, 'ID must not be empty').max(128, 'ID too long'),
    symbol: z
      .string()
      .min(1, 'Symbol must not be empty')
      .max(20, 'Symbol too long')
      .regex(/^[A-Za-z0-9.\-_:]+$/, 'Invalid ticker symbol format'),
    companyName: z
      .string()
      .min(1, 'Company name must not be empty')
      .max(250, 'Company name too long'),
    market: MarketSchema,
    exchange: z.string().max(50).optional(),
    country: z.string().max(50).optional(),
    announcementDate: z.string().refine(isValidCalendarDate, {
      message: 'announcementDate must be a valid calendar date in YYYY-MM-DD format',
    }),
    announcementTime: z
      .string()
      .regex(TIME_REGEX, 'announcementTime must be in HH:mm format')
      .optional(),
    timeZone: z
      .string()
      .max(64)
      .optional()
      .refine(
        (tz) => {
          if (!tz) return true;
          try {
            Intl.DateTimeFormat(undefined, { timeZone: tz });
            return true;
          } catch {
            return false;
          }
        },
        { message: 'Invalid IANA timeZone' }
      ),
    session: EarningsSessionSchema,
    dateStatus: DateStatusSchema,
    fiscalPeriod: z.string().max(30).optional(),
    epsEstimate: z.number().finite().optional(),
    epsActual: z.number().finite().optional(),
    revenueEstimate: z.number().finite().min(0, 'Revenue cannot be negative').optional(),
    revenueActual: z.number().finite().min(0, 'Revenue cannot be negative').optional(),
    currency: z
      .string()
      .length(3)
      .regex(/^[A-Z]{3}$/, 'Currency must be 3 uppercase letters')
      .optional(),
    sourceName: z.string().min(1, 'sourceName is required').max(100),
    sourceUrl: z.string().url('sourceUrl must be a valid URL').optional(),
    sourceType: SourceTypeSchema.optional(),
    sourceUpdatedAt: z.string().datetime().optional(),
    verifiedAt: z.string().datetime().optional(),
    officialAnnouncementDate: z
      .string()
      .refine(isValidCalendarDate, {
        message: 'officialAnnouncementDate must be a valid YYYY-MM-DD date',
      })
      .optional(),
    fetchedAt: z.string().datetime({ message: 'fetchedAt must be an ISO-8601 string' }),
  })
  .superRefine((ev, ctx) => {
    // Audit rule: A date CANNOT be confirmed without an authentic official source
    if (ev.dateStatus === 'confirmed') {
      if (!ev.sourceUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Confirmed date for "${ev.symbol}" requires an official sourceUrl proof.`,
          path: ['sourceUrl'],
        });
      }
      if (
        ev.sourceType &&
        ['broker_consensus', 'algorithmic_projection', 'unverified'].includes(ev.sourceType)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Event "${ev.symbol}" has dateStatus="confirmed" but sourceType is "${ev.sourceType}". Projections cannot be marked confirmed.`,
          path: ['dateStatus'],
        });
      }
    }
  });

export const CalendarMetadataSchema = z.object({
  schemaVersion: z.number().int().min(1),
  generatedAt: z.string().datetime({ message: 'generatedAt must be an ISO-8601 string' }),
  lastSuccessfulFetchAt: z.string().datetime().nullable(),
  provider: z.string().min(1).max(100),
  status: z.enum(['success', 'partial', 'stale', 'unavailable']),
  eventCount: z.number().int().nonnegative(),
  markets: z.array(MarketSchema).min(1, 'At least one market must be listed'),
  warnings: z.array(z.string().max(500)),
});

export const EarningsCalendarSchema = z
  .object({
    metadata: CalendarMetadataSchema,
    events: z.array(EarningsEventSchema),
  })
  .superRefine((val, ctx) => {
    // 1. Check eventCount coherence
    if (val.metadata.eventCount !== val.events.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `metadata.eventCount (${val.metadata.eventCount}) does not match events.length (${val.events.length})`,
        path: ['metadata', 'eventCount'],
      });
    }

    // 2. Check duplicate IDs
    const seenIds = new Set<string>();
    for (let i = 0; i < val.events.length; i++) {
      const ev = val.events[i];
      if (seenIds.has(ev.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate event id detected: "${ev.id}"`,
          path: ['events', i, 'id'],
        });
      }
      seenIds.add(ev.id);
    }
  });

export function validateEarningsCalendar(data: unknown): EarningsCalendar {
  return EarningsCalendarSchema.parse(data);
}

export function safeValidateEarningsCalendar(data: unknown): {
  success: boolean;
  data?: EarningsCalendar;
  errors?: string[];
} {
  const result = EarningsCalendarSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((iss) => `${iss.path.join('.')}: ${iss.message}`),
    };
  }
  return {
    success: true,
    data: result.data as EarningsCalendar,
  };
}

export function validateEarningsEvent(data: unknown): EarningsEvent {
  return EarningsEventSchema.parse(data);
}
