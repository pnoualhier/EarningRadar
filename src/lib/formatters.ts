/**
 * Formatting helpers for financial metrics and localization.
 */

export function formatCurrencyAmount(amount: number | undefined, currency: string = 'USD'): string {
  if (amount === undefined || !Number.isFinite(amount)) return '—';

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatRevenue(amount: number | undefined, currency: string = 'USD'): string {
  if (amount === undefined || !Number.isFinite(amount)) return '—';

  const symbolMap: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CHF: 'CHF',
  };
  const sym = symbolMap[currency] || currency;

  if (Math.abs(amount) >= 1_000_000_000) {
    const bVal = (amount / 1_000_000_000).toLocaleString('fr-FR', {
      maximumFractionDigits: 2,
    });
    return `${bVal} Mrd ${sym}`;
  }

  if (Math.abs(amount) >= 1_000_000) {
    const mVal = (amount / 1_000_000).toLocaleString('fr-FR', {
      maximumFractionDigits: 2,
    });
    return `${mVal} M ${sym}`;
  }

  return formatCurrencyAmount(amount, currency);
}

export function formatEps(amount: number | undefined, currency: string = 'USD'): string {
  if (amount === undefined || !Number.isFinite(amount)) return '—';

  const symbolMap: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CHF: 'CHF',
  };
  const sym = symbolMap[currency] || currency;

  const numStr = amount.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${numStr} ${sym}`;
}

export function formatRelativeFreshness(isoDateString: string): string {
  try {
    const past = new Date(isoDateString).getTime();
    const now = Date.now();
    const diffMinutes = Math.floor((now - past) / 60000);

    if (diffMinutes < 1) return 'À l’instant';
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;

    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(isoDateString));
  } catch {
    return isoDateString;
  }
}
