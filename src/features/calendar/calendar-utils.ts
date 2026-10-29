import type { EarningsSession } from '../../types/earnings';

export const SESSION_ORDER: EarningsSession[] = [
  'before_open',
  'during_session',
  'after_close',
  'unknown',
];

export function getSessionBadgeInfo(session: EarningsSession): {
  shortName: string;
  fullName: string;
  iconBg: string;
} {
  switch (session) {
    case 'before_open':
      return {
        shortName: 'BMO',
        fullName: 'Avant ouverture',
        iconBg: 'bg-amber-500/10 text-amber-600',
      };
    case 'after_close':
      return {
        shortName: 'AMC',
        fullName: 'Après clôture',
        iconBg: 'bg-indigo-500/10 text-indigo-600',
      };
    case 'during_session':
      return {
        shortName: 'SÉANCE',
        fullName: 'Pendant la séance',
        iconBg: 'bg-emerald-500/10 text-emerald-600',
      };
    case 'unknown':
    default:
      return {
        shortName: 'INDÉTERMINÉ',
        fullName: 'Horaire inconnu',
        iconBg: 'bg-slate-500/10 text-slate-600',
      };
  }
}
