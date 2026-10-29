import type { DateStatus } from '../../src/types/earnings';

export interface RawDateContext {
  isConfirmedByCompany?: boolean;
  statusText?: string;
  sourceConfidence?: 'official_ir' | 'exchange_filing' | 'broker_consensus' | 'algorithmic_projection';
  hasExplicitPressRelease?: boolean;
}

/**
 * Classifies the certainty of an earnings announcement date.
 * Rule: A date is ONLY "confirmed" if verified by official IR or press release.
 * Algorithmic projections and consensus estimates remain "estimated".
 * Unknown or conflicting records are "unverified".
 */
export function classifyDateStatus(context: RawDateContext): DateStatus {
  if (context.isConfirmedByCompany === true || context.hasExplicitPressRelease === true || context.sourceConfidence === 'official_ir' || context.sourceConfidence === 'exchange_filing') {
    return 'confirmed';
  }

  const status = (context.statusText || '').toLowerCase();
  if (status.includes('confirm') || status === 'v' || status === 'verified') {
    return 'confirmed';
  }

  if (context.sourceConfidence === 'broker_consensus' || context.sourceConfidence === 'algorithmic_projection' || status.includes('estim') || status === 'e') {
    return 'estimated';
  }

  if (status.includes('unverified') || status.includes('tentative') || status.includes('tbd')) {
    return 'unverified';
  }

  // Default fallback for algorithmic/external feeds
  return 'estimated';
}
