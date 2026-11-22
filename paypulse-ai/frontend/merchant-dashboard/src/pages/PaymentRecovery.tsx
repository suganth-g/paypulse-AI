import { useState } from 'react';
import { RefreshCw, ChevronDown, ChevronUp, CheckCircle, XCircle, Clock, Info } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { DemoBanner } from '../components/common/DemoBanner';
import { RecoveryStatusBadge } from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import { DEMO_RECOVERY_RECORDS } from '../data/recoveryRecords';
import type { RecoveryRecord, RecoveryStatus } from '../types';
import { formatCurrency, formatDateTime, formatLatency, formatTxnId } from '../utils/formatters';

function AttemptDot({ outcome }: { outcome: 'success' | 'failed' }) {
  return outcome === 'success'
    ? <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
    : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
}

function RecoveryRow({ record }: { record: RecoveryRecord }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <div
        className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-900">{record.customerName}</p>
            <span className="font-mono text-xs text-slate-400">{formatTxnId(record.transactionId)}</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{record.failureReason}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-semibold tabular-nums">{formatCurrency(record.amount)}</p>
          <p className="text-xs text-slate-400 mt-0.5">{record.originalProvider}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-slate-400">{record.attempts.length} attempt{record.attempts.length !== 1 ? 's' : ''}</span>
          <RecoveryStatusBadge status={record.status} />
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-4 animate-fade-in">
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-700">Recovery Attempt Timeline</p>
            <div className="space-y-2">
              {record.attempts.map(attempt => (
                <div key={attempt.attemptNumber} className="flex items-start gap-3">
                  <AttemptDot outcome={attempt.outcome} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-700">Attempt #{attempt.attemptNumber}</span>
                      <span className="text-xs text-slate-500">via {attempt.provider}</span>
                      <span className={`text-xs font-semibold ${attempt.outcome === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {attempt.outcome === 'success' ? 'Recovered' : 'Failed'}
                      </span>
                      <span className="text-xs text-slate-400">{formatLatency(attempt.durationMs)}</span>
                    </div>
                    {attempt.failureReason && (
                      <p className="text-xs text-slate-400 mt-0.5">{attempt.failureReason}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(attempt.attemptedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
            {record.resolvedAt && (
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  Resolved at: <span className="font-medium">{formatDateTime(record.resolvedAt)}</span>
                </p>
              </div>
            )}
            <p className="text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded">
              ⚠️ Simulated recovery — no real payment retries are performed in this demo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentRecovery() {
  const [filter, setFilter] = useState<RecoveryStatus | 'all'>('all');

  const filtered = DEMO_RECOVERY_RECORDS.filter(
    r => filter === 'all' || r.status === filter
  );

  const stats = {
    total:     DEMO_RECOVERY_RECORDS.length,
    recovered: DEMO_RECOVERY_RECORDS.filter(r => r.status === 'recovered').length,
    pending:   DEMO_RECOVERY_RECORDS.filter(r => r.status === 'pending').length,
    failed:    DEMO_RECOVERY_RECORDS.filter(r => r.status === 'permanently_failed').length,
  };
  const recoveryRate = stats.total > 0 ? ((stats.recovered / stats.total) * 100).toFixed(0) : '0';

  return (
    <div className="space-y-6">
      <DemoBanner />
      <PageHeader
        title="Payment Recovery"
        description="Automatically retried failed transactions with provider failover. Expand rows to see attempt history."
        badge={<span className="demo-badge">DEMO DATA</span>}
      />

      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Simulated recovery engine — </span>
          Retry actions shown are illustrative. The recovery engine will be implemented in Phase 7.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Recovery Jobs', value: stats.total,     color: 'text-slate-900' },
          { label: 'Successfully Recovered', value: stats.recovered, color: 'text-emerald-600' },
          { label: 'Pending',               value: stats.pending,  color: 'text-amber-600' },
          { label: 'Recovery Rate',          value: `${recoveryRate}%`, color: 'text-blue-600' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="card p-4 flex gap-3 flex-wrap">
        <select value={filter} onChange={e => setFilter(e.target.value as RecoveryStatus | 'all')} className="select w-44">
          <option value="all">All Status</option>
          <option value="recovered">Recovered</option>
          <option value="pending">Pending</option>
          <option value="permanently_failed">Permanently Failed</option>
        </select>
      </div>

      {/* Recovery list */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <p className="text-sm font-semibold text-slate-700">Recovery Jobs ({filtered.length})</p>
          </div>
        </div>
        {filtered.length === 0
          ? <EmptyState title="No recovery records match your filter" />
          : filtered.map(r => <RecoveryRow key={r.id} record={r} />)
        }
      </div>

      <div className="card p-5 bg-slate-50 border-dashed">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="w-5 h-5 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">Recovery Engine Configuration (Placeholder)</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {[['Max Retry Attempts', '3'], ['Backoff Strategy', 'Exponential'], ['Initial Delay', '1 second']].map(([k, v]) => (
            <div key={k} className="bg-white rounded-lg p-3 border border-slate-200">
              <p className="text-xs text-slate-500">{k}</p>
              <p className="font-semibold text-slate-900 mt-0.5">{v}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3">Configuration editing will be available in Phase 7.</p>
      </div>
    </div>
  );
}

