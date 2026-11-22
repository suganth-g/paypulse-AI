// ============================================================
// PayPulse AI — Core TypeScript Types
// ============================================================

export type TransactionStatus = 'success' | 'failed' | 'pending' | 'recovered' | 'flagged';
export type RiskLabel = 'low' | 'medium' | 'high';
export type ProviderStatus = 'healthy' | 'degraded' | 'down';
export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet';
export type InsightType = 'warning' | 'info' | 'success' | 'critical';
export type AlertStatus = 'open' | 'reviewed' | 'dismissed';
export type RecoveryStatus = 'pending' | 'recovered' | 'permanently_failed';

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;        // stored in paise (smallest INR unit)
  currency: string;      // 'INR'
  paymentMethod: PaymentMethod;
  provider: string;
  status: TransactionStatus;
  failureProbability: number;   // 0–1
  riskScore: number;             // 0–1
  riskLabel: RiskLabel;
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;    // ISO-8601
  updatedAt: string;
}

export interface Provider {
  id: string;
  name: string;
  code: string;
  successRate: number;      // 0–100
  avgLatencyMs: number;
  healthScore: number;      // 0–100
  status: ProviderStatus;
  transactionCount: number;
  processingFee: number;    // percentage e.g. 1.8
  lastChecked: string;      // ISO-8601
  description: string;
}

export interface FraudAlert {
  id: string;
  transactionId: string;
  customerName: string;
  amount: number;        // paise
  riskScore: number;    // 0–1
  riskLabel: RiskLabel;
  reason: string;
  signals: string[];
  status: AlertStatus;
  triggeredAt: string;
  reviewedAt?: string;
}

export interface RecoveryAttempt {
  attemptNumber: number;
  provider: string;
  outcome: 'success' | 'failed';
  durationMs: number;
  failureReason?: string;
  attemptedAt: string;
}

export interface RecoveryRecord {
  id: string;
  transactionId: string;
  customerName: string;
  amount: number;        // paise
  originalProvider: string;
  failureReason: string;
  status: RecoveryStatus;
  attempts: RecoveryAttempt[];
  createdAt: string;
  resolvedAt?: string;
}

export interface TimeSeriesPoint {
  date: string;          // display label e.g. 'Nov 1'
  volume: number;        // transaction count
  success: number;
  failed: number;
  amount: number;        // INR value (not paise) for readability
}

export interface ProviderAnalytics {
  name: string;
  successRate: number;
  transactions: number;
  avgLatency: number;
  revenue: number;      // INR
}

export interface PaymentMethodBreakdown {
  method: string;
  count: number;
  percentage: number;
  color: string;
}

export interface DashboardSummary {
  totalTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  successRate: number;          // percentage
  totalVolume: number;          // INR (not paise) for display
  predictedFailureRisk: number; // percentage
  pendingRecoveries: number;
  openFraudAlerts: number;
  changeVsPrev: {
    totalTransactions: number;
    successRate: number;
    totalVolume: number;
    failedPayments: number;
  };
}

export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  metric?: string;
  change?: number;           // percentage change (positive = increase)
  recommendation?: string;
  affectedProvider?: string;
  confidence: number;        // 0–1
  createdAt: string;
}

export type DateRange = '7d' | '30d' | '90d';

export interface FilterState {
  search: string;
  status: TransactionStatus | 'all';
  method: PaymentMethod | 'all';
  provider: string | 'all';
  dateRange: DateRange;
  page: number;
  pageSize: number;
}

