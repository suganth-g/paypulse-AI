// ============================================================
// PayPulse AI — SIMULATED Provider Data
// These are fictional payment gateway simulations.
// ============================================================

import type { Provider } from '../types';

export const DEMO_PROVIDERS: Provider[] = [
  {
    id: 'prov-alpha',
    name: 'Provider Alpha',
    code: 'ALPHA',
    successRate: 97.4,
    avgLatencyMs: 142,
    healthScore: 98,
    status: 'healthy',
    transactionCount: 8420,
    processingFee: 1.80,
    lastChecked: new Date(Date.now() - 30_000).toISOString(),
    description: 'Primary high-reliability provider for card and UPI transactions. Preferred for high-value orders.',
  },
  {
    id: 'prov-beta',
    name: 'Provider Beta',
    code: 'BETA',
    successRate: 91.2,
    avgLatencyMs: 198,
    healthScore: 83,
    status: 'degraded',
    transactionCount: 3187,
    processingFee: 1.50,
    lastChecked: new Date(Date.now() - 30_000).toISOString(),
    description: 'Cost-effective secondary provider. Currently experiencing elevated latency. Use for lower-value transactions.',
  },
  {
    id: 'prov-gamma',
    name: 'Provider Gamma',
    code: 'GAMMA',
    successRate: 78.9,
    avgLatencyMs: 341,
    healthScore: 55,
    status: 'degraded',
    transactionCount: 1204,
    processingFee: 1.20,
    lastChecked: new Date(Date.now() - 30_000).toISOString(),
    description: 'Tertiary fallback provider. High latency and lower success rates. Used as last-resort recovery path.',
  },
];

export const ROUTING_RECOMMENDATION = {
  recommended: 'Provider Alpha',
  confidence: 0.94,
  reasons: [
    'Highest success rate (97.4%) over the last 30 days',
    'Lowest average latency (142ms) among active providers',
    'No incidents in the past 48 hours',
    'AI model assigns 94% confidence to this recommendation',
  ],
  alternates: [
    { provider: 'Provider Beta',  score: 0.71, note: 'Acceptable fallback — elevated latency noted' },
    { provider: 'Provider Gamma', score: 0.42, note: 'Last resort only — high failure rate currently' },
  ],
};

