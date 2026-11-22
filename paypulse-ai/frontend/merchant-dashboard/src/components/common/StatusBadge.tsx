import type { TransactionStatus, RiskLabel, AlertStatus, RecoveryStatus, ProviderStatus, InsightType } from '../../types';

// ── Transaction Status ────────────────────────────────────────
const TXN_STATUS: Record<TransactionStatus, { label: string; classes: string }> = {
  success:   { label: 'Success',   classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  failed:    { label: 'Failed',    classes: 'bg-red-50 text-red-700 ring-red-600/20'             },
  pending:   { label: 'Pending',   classes: 'bg-amber-50 text-amber-700 ring-amber-600/20'       },
  recovered: { label: 'Recovered', classes: 'bg-blue-50 text-blue-700 ring-blue-600/20'          },
  flagged:   { label: 'Flagged',   classes: 'bg-orange-50 text-orange-700 ring-orange-600/20'    },
};

export function TransactionStatusBadge({ status }: { status: TransactionStatus }) {
  const cfg = TXN_STATUS[status] ?? TXN_STATUS.pending;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ring-1 ring-inset ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

// ── Risk Label ────────────────────────────────────────────────
const RISK_LABEL: Record<RiskLabel, { label: string; classes: string }> = {
  low:    { label: 'Low',    classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  medium: { label: 'Medium', classes: 'bg-amber-50 text-amber-700 ring-amber-600/20'      },
  high:   { label: 'High',   classes: 'bg-red-50 text-red-700 ring-red-600/20'            },
};

export function RiskBadge({ label }: { label: RiskLabel }) {
  const cfg = RISK_LABEL[label] ?? RISK_LABEL.low;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ring-1 ring-inset ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

// ── Alert Status ──────────────────────────────────────────────
const ALERT_STATUS: Record<AlertStatus, { label: string; classes: string }> = {
  open:      { label: 'Open',      classes: 'bg-red-50 text-red-700 ring-red-600/20'           },
  reviewed:  { label: 'Reviewed',  classes: 'bg-blue-50 text-blue-700 ring-blue-600/20'        },
  dismissed: { label: 'Dismissed', classes: 'bg-slate-100 text-slate-500 ring-slate-500/20'    },
};

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  const cfg = ALERT_STATUS[status] ?? ALERT_STATUS.open;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ring-1 ring-inset ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

// ── Recovery Status ───────────────────────────────────────────
const RECOVERY_STATUS: Record<RecoveryStatus, { label: string; classes: string }> = {
  pending:            { label: 'Pending',    classes: 'bg-amber-50 text-amber-700 ring-amber-600/20'   },
  recovered:          { label: 'Recovered',  classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  permanently_failed: { label: 'Failed',     classes: 'bg-red-50 text-red-700 ring-red-600/20'         },
};

export function RecoveryStatusBadge({ status }: { status: RecoveryStatus }) {
  const cfg = RECOVERY_STATUS[status] ?? RECOVERY_STATUS.pending;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ring-1 ring-inset ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

// ── Provider Status ───────────────────────────────────────────
const PROVIDER_STATUS: Record<ProviderStatus, { label: string; dotClass: string; textClass: string }> = {
  healthy:  { label: 'Healthy',  dotClass: 'bg-emerald-500', textClass: 'text-emerald-700' },
  degraded: { label: 'Degraded', dotClass: 'bg-amber-500',   textClass: 'text-amber-700'   },
  down:     { label: 'Down',     dotClass: 'bg-red-500',     textClass: 'text-red-700'      },
};

export function ProviderStatusBadge({ status }: { status: ProviderStatus }) {
  const cfg = PROVIDER_STATUS[status] ?? PROVIDER_STATUS.healthy;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${cfg.textClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass} animate-pulse-slow`} />
      {cfg.label}
    </span>
  );
}

// ── Insight Type ──────────────────────────────────────────────
const INSIGHT_TYPE: Record<InsightType, { classes: string }> = {
  warning:  { classes: 'bg-amber-50 text-amber-700 ring-amber-600/20'   },
  info:     { classes: 'bg-blue-50 text-blue-700 ring-blue-600/20'      },
  success:  { classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  critical: { classes: 'bg-red-50 text-red-700 ring-red-600/20'         },
};

export function InsightTypeBadge({ type }: { type: InsightType }) {
  const cfg = INSIGHT_TYPE[type] ?? INSIGHT_TYPE.info;
  const labels: Record<InsightType, string> = { warning: 'Warning', info: 'Info', success: 'Positive', critical: 'Critical' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ring-1 ring-inset ${cfg.classes}`}>
      {labels[type]}
    </span>
  );
}

// ── Payment Method ────────────────────────────────────────────
export function PaymentMethodBadge({ method }: { method: string }) {
  const labels: Record<string, { label: string; classes: string }> = {
    card:       { label: 'Card',        classes: 'bg-blue-50 text-blue-700'      },
    upi:        { label: 'UPI',         classes: 'bg-emerald-50 text-emerald-700'},
    netbanking: { label: 'Net Banking', classes: 'bg-amber-50 text-amber-700'    },
    wallet:     { label: 'Wallet',      classes: 'bg-violet-50 text-violet-700'  },
  };
  const cfg = labels[method] ?? { label: method, classes: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}
