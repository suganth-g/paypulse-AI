// ============================================================
// PayPulse AI — SIMULATED AI Insight Data
// These are illustrative examples — NOT real AI predictions.
// ============================================================

import type { AIInsight } from '../types';

export const DEMO_INSIGHTS: AIInsight[] = [
  {
    id: 'ins-001',
    type: 'warning',
    title: 'Provider Beta Latency Spike Predicted',
    description: 'Model detects a 68% probability of latency degradation on Provider Beta in the next 2–4 hours based on historical patterns and current load signals.',
    metric: '198ms avg → ~340ms predicted',
    change: 72,
    recommendation: 'Consider pre-emptively routing high-value transactions to Provider Alpha.',
    affectedProvider: 'Provider Beta',
    confidence: 0.68,
    createdAt: new Date(Date.now() - 15 * 60_000).toISOString(),
  },
  {
    id: 'ins-002',
    type: 'critical',
    title: 'Elevated Failure Risk — Evening Window',
    description: 'Historical data shows a 23% spike in payment failures between 10 PM – 12 AM IST. Current trajectory suggests this window will be active tonight.',
    metric: 'Failure rate: 8.2% → 23% predicted',
    change: 23,
    recommendation: 'Activate aggressive routing to Provider Alpha. Enable recovery engine for all transactions above ₹5,000.',
    confidence: 0.81,
    createdAt: new Date(Date.now() - 42 * 60_000).toISOString(),
  },
  {
    id: 'ins-003',
    type: 'info',
    title: 'UPI Success Rate Improvement Opportunity',
    description: 'UPI transactions routed via Provider Alpha show 99.1% success rate vs 87.3% via Provider Gamma. Routing all UPI to Alpha could recover ~₹3.2L in failed payments monthly.',
    metric: '+11.8% success rate potential',
    change: 11.8,
    recommendation: 'Update routing rules to prioritise Provider Alpha for all UPI payment method transactions.',
    confidence: 0.91,
    createdAt: new Date(Date.now() - 2 * 3_600_000).toISOString(),
  },
  {
    id: 'ins-004',
    type: 'warning',
    title: 'Unusual Transaction Velocity — Customer C005',
    description: 'Customer Deepika Nair has initiated 5 transactions in the last 10 minutes with an aggregate value of ₹32,500. This exceeds their 90-day average velocity by 400%.',
    metric: 'Risk score: 0.88 (High)',
    recommendation: 'Review flagged transactions. Consider step-up authentication for further transactions from this customer.',
    confidence: 0.88,
    createdAt: new Date(Date.now() - 25 * 60_000).toISOString(),
  },
  {
    id: 'ins-005',
    type: 'success',
    title: 'Recovery Engine Performance — This Week',
    description: 'The recovery engine successfully recovered 83% of retried transactions this week, up from 71% last week. Provider Alpha is the top recovery destination.',
    metric: '83% recovery rate',
    change: 12,
    recommendation: 'No immediate action required. Continue monitoring recovery path performance.',
    confidence: 0.99,
    createdAt: new Date(Date.now() - 6 * 3_600_000).toISOString(),
  },
];

