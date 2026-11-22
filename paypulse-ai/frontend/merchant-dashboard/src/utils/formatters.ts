// ============================================================
// PayPulse AI — Formatting Utilities
// ============================================================

/**
 * Format amount from paise to INR display string.
 * e.g. 150000 → "₹1,500.00"
 */
export function formatCurrency(paise: number, currency = 'INR'): string {
  const value = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a large INR value for dashboard cards (K/L/Cr).
 * e.g. 15000000 → "₹1.5 Cr"
 */
export function formatLargeAmount(paise: number): string {
  const inr = paise / 100;
  if (inr >= 10_000_000) return `₹${(inr / 10_000_000).toFixed(2)} Cr`;
  if (inr >= 100_000)    return `₹${(inr / 100_000).toFixed(2)} L`;
  if (inr >= 1_000)      return `₹${(inr / 1_000).toFixed(1)}K`;
  return `₹${inr.toFixed(2)}`;
}

/**
 * Format a plain INR number (not paise) for chart display.
 */
export function formatChartAmount(inr: number): string {
  if (inr >= 10_000_000) return `₹${(inr / 10_000_000).toFixed(1)}Cr`;
  if (inr >= 100_000)    return `₹${(inr / 100_000).toFixed(1)}L`;
  if (inr >= 1_000)      return `₹${(inr / 1_000).toFixed(0)}K`;
  return `₹${inr}`;
}

/**
 * Format a percentage value.
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a risk score (0–1) to a percentage string.
 */
export function formatRiskScore(score: number): string {
  return `${(score * 100).toFixed(0)}%`;
}

/**
 * Format an ISO-8601 date string to a human-readable date/time.
 */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

/**
 * Format an ISO-8601 date string to a short date.
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/**
 * Format relative time (e.g. "2 hours ago").
 */
export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/**
 * Format a latency number to a string.
 */
export function formatLatency(ms: number): string {
  return `${ms}ms`;
}

/**
 * Truncate a string with ellipsis.
 */
export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

/**
 * Format transaction ID for display (first 8 chars).
 */
export function formatTxnId(id: string): string {
  return `PP-${id.slice(0, 8).toUpperCase()}`;
}

/**
 * Calculate change percentage.
 */
export function calcChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Generate a colour for a payment method label.
 */
export function methodColor(method: string): string {
  const map: Record<string, string> = {
    card:       '#3B82F6',
    upi:        '#10B981',
    netbanking: '#F59E0B',
    wallet:     '#8B5CF6',
  };
  return map[method] ?? '#6B7280';
}

