// ============================================================
// PayPulse AI — SIMULATED Analytics Data
// All values are synthetic and for demonstration only.
// ============================================================

import type {
  TimeSeriesPoint, ProviderAnalytics, PaymentMethodBreakdown, DashboardSummary,
} from '../types';

// ── Summary ──────────────────────────────────────────────────
export const DEMO_SUMMARY: DashboardSummary = {
  totalTransactions: 12836,
  successfulPayments: 11478,
  failedPayments: 1023,
  successRate: 89.4,
  totalVolume: 48_320_000,   // INR (not paise) for display
  predictedFailureRisk: 12.3,
  pendingRecoveries: 4,
  openFraudAlerts: 2,
  changeVsPrev: {
    totalTransactions: 8.2,
    successRate: 1.4,
    totalVolume: 11.7,
    failedPayments: -5.3,
  },
};

// ── 90-day time series ───────────────────────────────────────
function genSeries(days: number): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    const label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    // Add realistic variance
    const base = 120 + Math.round(Math.sin(i * 0.3) * 20 + Math.random() * 30);
    const success = Math.round(base * (0.86 + Math.random() * 0.08));
    const failed  = base - success;
    points.push({
      date: label,
      volume: base,
      success,
      failed,
      amount: Math.round((base * 3800) + (Math.random() * 50_000)),
    });
  }
  return points;
}

export const SERIES_7D  = genSeries(7);
export const SERIES_30D = genSeries(30);
export const SERIES_90D = genSeries(90);

export function getSeriesForRange(range: '7d' | '30d' | '90d'): TimeSeriesPoint[] {
  if (range === '7d')  return SERIES_7D;
  if (range === '30d') return SERIES_30D;
  return SERIES_90D;
}

// ── Provider Analytics ───────────────────────────────────────
export const DEMO_PROVIDER_ANALYTICS: ProviderAnalytics[] = [
  { name: 'Provider Alpha', successRate: 97.4, transactions: 8420, avgLatency: 142, revenue: 29_387_000 },
  { name: 'Provider Beta',  successRate: 91.2, transactions: 3187, avgLatency: 198, revenue: 14_732_000 },
  { name: 'Provider Gamma', successRate: 78.9, transactions: 1204, avgLatency: 341, revenue:  5_148_000 },
];

// ── Payment Method Breakdown ─────────────────────────────────
export const DEMO_METHOD_BREAKDOWN: PaymentMethodBreakdown[] = [
  { method: 'UPI',        count: 5134, percentage: 40, color: '#10B981' },
  { method: 'Card',       count: 3851, percentage: 30, color: '#3B82F6' },
  { method: 'Net Banking',count: 2567, percentage: 20, color: '#F59E0B' },
  { method: 'Wallet',     count: 1284, percentage: 10, color: '#8B5CF6' },
];

// ── Status Distribution ──────────────────────────────────────
export const DEMO_STATUS_DISTRIBUTION = [
  { name: 'Success',   value: 11478, color: '#10B981' },
  { name: 'Failed',    value: 1023,  color: '#EF4444' },
  { name: 'Recovered', value: 253,   color: '#3B82F6' },
  { name: 'Flagged',   value: 82,    color: '#F59E0B' },
];

