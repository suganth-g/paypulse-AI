import { useState, useMemo } from 'react';
import { Eye, XCircle, AlertTriangle, Info } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { DemoBanner } from '../components/common/DemoBanner';
import { RiskBadge, AlertStatusBadge } from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import { DEMO_FRAUD_ALERTS } from '../data/fraudAlerts';
import type { FraudAlert, AlertStatus, RiskLabel } from '../types';
import { formatCurrency, formatDateTime, formatTxnId } from '../utils/formatters';

export default function FraudMonitoring() {
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');
  const [riskFilter, setRiskFilter]     = useState<RiskLabel | 'all'>('all');
  const [selected, setSelected]         = useState<FraudAlert | null>(null);

  const filtered = useMemo(() =>
    DEMO_FRAUD_ALERTS.filter(a =>
      (statusFilter === 'all' || a.status === statusFilter) &&
      (riskFilter === 'all'   || a.riskLabel === riskFilter)
    ), [statusFilter, riskFilter]);

  const openCount = DEMO_FRAUD_ALERTS.filter(a => a.status === 'open').length;

  return (
    <div className="space-y-6">
      <DemoBanner />
      <PageHeader
        title="Fraud Monitoring"
        description="AI-detected suspicious transactions requiring review. All alerts are simulated."
        badge={<span className="demo-badge">DEMO DATA</span>}
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Alerts',  value: DEMO_FRAUD_ALERTS.length, color: 'text-slate-900'    },
          { label: 'Open',          value: openCount,                 color: 'text-red-600'      },
          { label: 'Reviewed',      value: DEMO_FRAUD_ALERTS.filter(a => a.status === 'reviewed').length, color: 'text-blue-600' },
          { label: 'Dismissed',     value: DEMO_FRAUD_ALERTS.filter(a => a.status === 'dismissed').length, color: 'text-slate-500' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-100">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Simulated fraud detection — </span>
          Alerts shown are based on synthetic data and illustrative risk signals. No real fraud analysis is performed.
          The AI fraud detection model will be integrated in Phase 3.
        </p>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as AlertStatus | 'all')} className="select w-36">
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="reviewed">Reviewed</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value as RiskLabel | 'all')} className="select w-32">
          <option value="all">All Risk</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        {(statusFilter !== 'all' || riskFilter !== 'all') && (
          <button onClick={() => { setStatusFilter('all'); setRiskFilter('all'); }} className="btn-ghost text-xs">
            Clear
          </button>
        )}
      </div>

      {/* Alert table */}
      <div className="card overflow-hidden">
        {filtered.length === 0
          ? <EmptyState title="No alerts match your filters" />
          : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="table-th">Alert ID</th>
                    <th className="table-th">Customer</th>
                    <th className="table-th text-right">Amount</th>
                    <th className="table-th">Risk Score</th>
                    <th className="table-th">Risk Level</th>
                    <th className="table-th">Reason</th>
                    <th className="table-th">Status</th>
                    <th className="table-th">Triggered</th>
                    <th className="table-th" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(alert => (
                    <tr
                      key={alert.id}
                      className="table-row"
                      onClick={() => setSelected(alert)}
                    >
                      <td className="table-td font-mono text-xs">{formatTxnId(alert.transactionId)}</td>
                      <td className="table-td font-medium">{alert.customerName}</td>
                      <td className="table-td text-right tabular-nums font-semibold">{formatCurrency(alert.amount)}</td>
                      <td className="table-td tabular-nums font-mono text-xs">{(alert.riskScore * 100).toFixed(0)}%</td>
                      <td className="table-td"><RiskBadge label={alert.riskLabel} /></td>
                      <td className="table-td max-w-xs truncate text-xs text-slate-500">{alert.reason}</td>
                      <td className="table-td"><AlertStatusBadge status={alert.status} /></td>
                      <td className="table-td text-xs text-slate-500 whitespace-nowrap">{formatDateTime(alert.triggeredAt)}</td>
                      <td className="table-td text-right">
                        <button className="text-xs text-blue-600 hover:underline font-medium">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg card shadow-2xl animate-fade-in overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between p-5 border-b border-slate-100">
              <div>
                <p className="text-xs text-slate-500">Fraud Alert Detail</p>
                <p className="font-mono text-sm font-bold">{formatTxnId(selected.transactionId)}</p>
              </div>
              <div className="flex items-center gap-2">
                <AlertStatusBadge status={selected.status} />
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="text-sm font-semibold">{selected.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Amount</p>
                  <p className="text-sm font-bold">{formatCurrency(selected.amount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Risk</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold">{(selected.riskScore * 100).toFixed(0)}%</p>
                    <RiskBadge label={selected.riskLabel} />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Reason</p>
                <p className="text-sm text-slate-700">{selected.reason}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Risk Signals (Simulated)</p>
                <ul className="space-y-1">
                  {selected.signals.map((sig, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                      {sig}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button className="btn-secondary text-xs flex-1 justify-center" title="Placeholder action">
                  <Eye className="w-3.5 h-3.5" /> Mark Reviewed (Placeholder)
                </button>
                <button className="btn-ghost text-xs flex-1 justify-center text-slate-500" title="Placeholder action">
                  <XCircle className="w-3.5 h-3.5" /> Dismiss (Placeholder)
                </button>
              </div>
              <p className="text-xs text-slate-400 text-center">Alert management actions are placeholders in this demo.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

