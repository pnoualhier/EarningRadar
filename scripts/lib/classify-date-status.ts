import type { DateStatus, SourceType } from '../../src/types/earnings';

export interface RawDateContext {
  isConfirmedByCompany?: boolean;
  statusText?: string;
  sourceConfidence?:
    | 'official_ir'
    | 'exchange_filing'
    | 'press_release'
    | 'broker_consensus'
    | 'algorithmic_projection'
    | 'unverified';
  hasExplicitPressRelease?: boolean;
  sourceUrl?: string;
}

/**
 * Classifies the certainty of an earnings announcement date.
 * Rule: A date is ONLY "confirmed" if verified by official IR, press release, or regulatory filing
 * with an accessible proof URL or direct company confirmation.
 * Algorithmic projections and consensus estimates remain "estimated".
 * Unknown, tentative, or unproven records remain "unverified".
 */
export function classifyDateStatus(context: RawDateContext): DateStatus {
  // Check for confirmed official status
  const isOfficialSource =
    context.isConfirmedByCompany === true ||
    context.hasExplicitPressRelease === true ||
    context.sourceConfidence === 'official_ir' ||
    context.sourceConfidence === 'exchange_filing' ||
    context.sourceConfidence === 'press_release';

  if (isOfficialSource) {
    return 'confirmed';
  }

  const status = (context.statusText || '').toLowerCase().trim();

  // If status text says confirmed but we have a valid proof source
  if ((status === 'confirmed' || status.includes('officiel')) && context.sourceUrl) {
    return 'confirmed';
  }

  if (
    context.sourceConfidence === 'broker_consensus' ||
    context.sourceConfidence === 'algorithmic_projection' ||
    status.includes('estim') ||
    status === 'e'
  ) {
    return 'estimated';
  }

  if (
    status.includes('unverified') ||
    status.includes('tentative') ||
    status.includes('tbd') ||
    status === 'unknown'
  ) {
    return 'unverified';
  }

  // Without proof or consensus, it must be unverified
  return context.sourceConfidence === 'unverified' ? 'unverified' : 'estimated';
}

export function inferSourceType(context: RawDateContext): SourceType {
  if (context.hasExplicitPressRelease || context.sourceConfidence === 'press_release') {
    return 'press_release';
  }
  if (context.sourceConfidence === 'official_ir' || context.isConfirmedByCompany) {
    return 'ir_calendar';
  }
  if (context.sourceConfidence === 'exchange_filing') {
    return 'regulatory_filing';
  }
  if (context.sourceConfidence === 'broker_consensus') {
    return 'broker_consensus';
  }
  if (context.sourceConfidence === 'algorithmic_projection') {
    return 'algorithmic_projection';
  }
  return 'unverified';
}
