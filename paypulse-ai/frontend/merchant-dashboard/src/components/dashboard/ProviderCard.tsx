import type { Provider } from '../../types';
import { ProviderStatusBadge } from '../common/StatusBadge';
import { formatLatency, formatPercent } from '../../utils/formatters';
import { Activity, Clock, TrendingUp, DollarSign } from 'lucide-react';

interface ProviderCardProps {
  provider: Provider;
  highlight?: boolean;
}

function HealthBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function ProviderCard({ provider, highlight }: ProviderCardProps) {
  const successColor = provider.successRate >= 95 ? 'bg-emerald-500' : provider.successRate >= 85 ? 'bg-amber-400' : 'bg-red-400';
  const healthColor  = provider.healthScore  >= 90 ? 'bg-emerald-500' : provider.healthScore  >= 70 ? 'bg-amber-400' : 'bg-red-400';

  return (
    <div className={`card p-5 hover:shadow-card-hover transition-shadow ${highlight ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-slate-900">{provider.name}</p>
            {highlight && (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">AI Recommended</span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{provider.description}</p>
        </div>
        <ProviderStatusBadge status={provider.status} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-slate-400" />
            <p className="text-xs text-slate-500">Success Rate</p>
          </div>
          <p className="text-sm font-bold text-slate-900">{formatPercent(provider.successRate)}</p>
          <HealthBar value={provider.successRate} color={successColor} />
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Activity className="w-3 h-3 text-slate-400" />
            <p className="text-xs text-slate-500">Health Score</p>
          </div>
          <p className="text-sm font-bold text-slate-900">{formatPercent(provider.healthScore)}</p>
          <HealthBar value={provider.healthScore} color={healthColor} />
        </div>
      </div>

      {/* Metrics row */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="w-3 h-3" />
          <span>{formatLatency(provider.avgLatencyMs)} avg</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <DollarSign className="w-3 h-3" />
          <span>{provider.processingFee}% fee</span>
        </div>
        <div className="text-xs text-slate-500">
          {provider.transactionCount.toLocaleString()} txns
        </div>
      </div>
    </div>
  );
}
