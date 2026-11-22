import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  change?: number;       // positive = up, negative = down
  changeLabel?: string;
  icon: React.ReactNode;
  iconBg?: string;
  accentColor?: string;
  footnote?: string;
}

export default function SummaryCard({
  title, value, change, changeLabel = 'vs last period', icon, iconBg = 'bg-blue-50', accentColor = 'text-blue-600', footnote,
}: SummaryCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="card p-5 hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center ${accentColor}`}>
          {icon}
        </div>
      </div>

      <p className="text-2xl font-bold text-slate-900 leading-tight mb-1">{value}</p>

      {change !== undefined && (
        <div className="flex items-center gap-1 mt-1">
          {isPositive && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
          {isNegative && <TrendingDown className="w-3.5 h-3.5 text-red-600" />}
          {!isPositive && !isNegative && <Minus className="w-3.5 h-3.5 text-slate-400" />}
          <span className={`text-xs font-semibold ${isPositive ? 'text-emerald-600' : isNegative ? 'text-red-600' : 'text-slate-400'}`}>
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
          <span className="text-xs text-slate-400">{changeLabel}</span>
        </div>
      )}

      {footnote && <p className="text-xs text-slate-400 mt-2">{footnote}</p>}
    </div>
  );
}

