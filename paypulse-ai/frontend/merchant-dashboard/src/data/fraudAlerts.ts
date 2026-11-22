// ============================================================
// PayPulse AI — SIMULATED Fraud Alert Data
// All data is synthetic. No real fraud detection is performed.
// ============================================================

import type { FraudAlert } from '../types';

function iso(daysAgo: number, hoursAgo = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

export const DEMO_FRAUD_ALERTS: FraudAlert[] = [
  {
    id: 'fa-001',
    transactionId: 'a1b2c3d4-0005',
    customerName: 'Deepika Nair',
    amount: 1499900,
    riskScore: 0.88,
    riskLabel: 'high',
    reason: 'Transaction velocity anomaly detected',
    signals: ['5 transactions within 10 minutes', 'Different device fingerprint', 'New IP geolocation (outside usual area)'],
    status: 'open',
    triggeredAt: iso(1, 0),
  },
  {
    id: 'fa-002',
    transactionId: 'a1b2c3d4-0012',
    customerName: 'Suresh Pillai',
    amount: 599900,
    riskScore: 0.81,
    riskLabel: 'high',
    reason: 'Unusual transaction pattern — large amount at off-hours',
    signals: ['Transaction at 3:14 AM', 'Amount 4× customer average', 'New merchant category'],
    status: 'open',
    triggeredAt: iso(3, 0),
  },
  {
    id: 'fa-003',
    transactionId: 'a1b2c3d4-0017',
    customerName: 'Deepika Nair',
    amount: 679900,
    riskScore: 0.72,
    riskLabel: 'high',
    reason: 'Card declined pattern — possible card testing',
    signals: ['3 failed card attempts in 2 hours', 'Incrementally increasing amounts', 'Different card numbers from same device'],
    status: 'reviewed',
    triggeredAt: iso(5, 5),
    reviewedAt: iso(5, 2),
  },
  {
    id: 'fa-004',
    transactionId: 'a1b2c3d4-0020',
    customerName: 'Vikram Singh',
    amount: 999900,
    riskScore: 0.52,
    riskLabel: 'medium',
    reason: 'Moderate risk — elevated amount with new device',
    signals: ['First-time device', 'Amount above 90th percentile for this merchant', 'VPN detected'],
    status: 'dismissed',
    triggeredAt: iso(7, 0),
    reviewedAt: iso(6, 20),
  },
];

