import { describe, it, expect } from 'vitest';
import { classifyDateStatus } from '../../scripts/lib/classify-date-status';

describe('classifyDateStatus', () => {
  it('classifies as confirmed when verified by IR or official filing', () => {
    expect(classifyDateStatus({ isConfirmedByCompany: true })).toBe('confirmed');
    expect(classifyDateStatus({ sourceConfidence: 'official_ir' })).toBe('confirmed');
    expect(classifyDateStatus({ sourceConfidence: 'exchange_filing' })).toBe('confirmed');
    expect(classifyDateStatus({ statusText: 'confirmed by press release' })).toBe('confirmed');
    expect(classifyDateStatus({ hasExplicitPressRelease: true })).toBe('confirmed');
  });

  it('classifies as estimated for broker consensus or projections', () => {
    expect(classifyDateStatus({ sourceConfidence: 'broker_consensus' })).toBe('estimated');
    expect(classifyDateStatus({ sourceConfidence: 'algorithmic_projection' })).toBe('estimated');
    expect(classifyDateStatus({ statusText: 'estimated date' })).toBe('estimated');
  });

  it('classifies as unverified for tentative or missing data', () => {
    expect(classifyDateStatus({ statusText: 'unverified' })).toBe('unverified');
    expect(classifyDateStatus({ statusText: 'tentative / tbd' })).toBe('unverified');
  });

  it('never defaults to confirmed for ambiguous or blank data', () => {
    expect(classifyDateStatus({})).not.toBe('confirmed');
  });
});
