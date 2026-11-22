import React from 'react';
import type { Transaction } from '../../types';
import { TransactionStatusBadge, RiskBadge, PaymentMethodBadge } from '../common/StatusBadge';
import { formatCurrency, formatDateTime, formatTxnId, formatRiskScore } from '../../utils/formatters';
import { X, Zap, Building2, AlertCircle } from 'lucide-react';

interface TransactionDetailProps {
  transaction: Transaction;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs font-medium text-slate-500 w-36 flex-shrink-0">{label}</span>
      <span className="text-xs text-slate-900 text-right font-medium">{value}</span>
    </div>
  );
}

export default function TransactionDetail({ transaction: t, onClose }: TransactionDetailProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg card shadow-2xl animate-fade-in overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-500 font-medium mb-0.5">Transaction Detail</p>
            <p className="font-mono text-sm font-bold text-slate-900">{formatTxnId(t.id)}</p>
          </div>
          <div className="flex items-center gap-2">
            <TransactionStatusBadge status={t.status} />
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Amount hero */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(t.amount)}</p>
          <p className="text-sm text-slate-500 mt-0.5">{t.customerName} · {t.customerEmail}</p>
        </div>

        {/* Details */}
        <div className="p-5 space-y-0">
          <DetailRow label="Full Transaction ID" value={<span className="font-mono text-xs">{t.id}</span>} />
          <DetailRow label="Payment Method"      value={<PaymentMethodBadge method={t.paymentMethod} />} />
          <DetailRow label="Provider"            value={<span className="flex items-center gap-1"><Building2 className="w-3 h-3 text-slate-400" />{t.provider}</span>} />
          <DetailRow label="Created"             value={formatDateTime(t.createdAt)} />
          <DetailRow label="Last Updated"        value={formatDateTime(t.updatedAt)} />
        </div>

        {/* AI scores */}
        <div className="mx-5 mb-4 p-3 rounded-lg bg-violet-50 border border-violet-100">
          <p className="text-xs font-semibold text-violet-700 mb-2 flex items-center gap-1">
            <Zap className="w-3 h-3" /> AI Risk Analysis (Simulated)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-violet-600 mb-0.5">Failure Probability</p>
              <p className="text-sm font-bold text-violet-900">{formatRiskScore(t.failureProbability)}</p>
            </div>
            <div>
              <p className="text-xs text-violet-600 mb-0.5">Fraud Risk</p>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-violet-900">{formatRiskScore(t.riskScore)}</p>
                <RiskBadge label={t.riskLabel} />
              </div>
            </div>
          </div>
        </div>

        {t.errorCode && (
          <div className="mx-5 mb-4 p-3 rounded-lg bg-red-50 border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Error Details
            </p>
            <p className="text-xs text-red-700 font-mono">{t.errorCode}</p>
            {t.errorMessage && <p className="text-xs text-red-600 mt-0.5">{t.errorMessage}</p>}
          </div>
        )}

        <div className="px-5 pb-5">
          <p className="text-xs text-slate-400 text-center">
            ⚠️ This is simulated demo data. No real transaction occurred.
          </p>
        </div>
      </div>
    </div>
  );
}
