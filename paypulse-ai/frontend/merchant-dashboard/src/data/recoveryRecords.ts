// ============================================================
// PayPulse AI — SIMULATED Recovery Record Data
// No real payment retries are performed.
// ============================================================

import type { RecoveryRecord } from '../types';

function iso(daysAgo: number, hoursAgo = 0, minutesAgo = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  d.setMinutes(d.getMinutes() - minutesAgo);
  return d.toISOString();
}

export const DEMO_RECOVERY_RECORDS: RecoveryRecord[] = [
  {
    id: 'rec-001',
    transactionId: 'a1b2c3d4-0006',
    customerName: 'Arjun Mehta',
    amount: 549900,
    originalProvider: 'Provider Beta',
    failureReason: 'GATEWAY_TIMEOUT — Provider Beta timed out after 30s',
    status: 'recovered',
    attempts: [
      { attemptNumber: 1, provider: 'Provider Alpha', outcome: 'success', durationMs: 187, attemptedAt: iso(1, 1, 55) },
    ],
    createdAt: iso(1, 2),
    resolvedAt: iso(1, 1, 55),
  },
  {
    id: 'rec-002',
    transactionId: 'a1b2c3d4-0014',
    customerName: 'Rahul Verma',
    amount: 849900,
    originalProvider: 'Provider Beta',
    failureReason: 'INSUFFICIENT_FUNDS — Initial attempt failed',
    status: 'recovered',
    attempts: [
      { attemptNumber: 1, provider: 'Provider Gamma', outcome: 'failed', durationMs: 342, failureReason: 'GATEWAY_ERROR', attemptedAt: iso(4, 0, 50) },
      { attemptNumber: 2, provider: 'Provider Alpha', outcome: 'success', durationMs: 164, attemptedAt: iso(3, 23, 45) },
    ],
    createdAt: iso(4, 0),
    resolvedAt: iso(3, 23, 44),
  },
  {
    id: 'rec-003',
    transactionId: 'a1b2c3d4-0002',
    customerName: 'Rahul Verma',
    amount: 199900,
    originalProvider: 'Provider Beta',
    failureReason: 'INSUFFICIENT_FUNDS — Customer account balance insufficient',
    status: 'permanently_failed',
    attempts: [
      { attemptNumber: 1, provider: 'Provider Alpha', outcome: 'failed', durationMs: 201, failureReason: 'INSUFFICIENT_FUNDS', attemptedAt: iso(0, 1, 50) },
      { attemptNumber: 2, provider: 'Provider Gamma', outcome: 'failed', durationMs: 390, failureReason: 'INSUFFICIENT_FUNDS', attemptedAt: iso(0, 1, 40) },
      { attemptNumber: 3, provider: 'Provider Alpha', outcome: 'failed', durationMs: 188, failureReason: 'INSUFFICIENT_FUNDS', attemptedAt: iso(0, 1, 30) },
    ],
    createdAt: iso(0, 2),
  },
  {
    id: 'rec-004',
    transactionId: 'a1b2c3d4-0008',
    customerName: 'Vikram Singh',
    amount: 149900,
    originalProvider: 'Provider Gamma',
    failureReason: 'GATEWAY_TIMEOUT — Provider Gamma timed out',
    status: 'pending',
    attempts: [
      { attemptNumber: 1, provider: 'Provider Beta', outcome: 'failed', durationMs: 29800, failureReason: 'TIMEOUT', attemptedAt: iso(1, 7, 55) },
    ],
    createdAt: iso(1, 8),
  },
];

