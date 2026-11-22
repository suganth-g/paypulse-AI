import React from 'react';
import type { AIInsight } from '../../types';
import { AlertTriangle, Info, CheckCircle, Zap, ChevronRight, Brain } from 'lucide-react';
import { InsightTypeBadge } from '../common/StatusBadge';
import { formatRelativeTime } from '../../utils/formatters';

const ICON_MAP = {
  warning:  <AlertTriangle className="w-4 h-4 text-amber-600" />,
  info:     <Info className="w-4 h-4 text-blue-600" />,
  success:  <CheckCircle className="w-4 h-4 text-emerald-600" />,
  critical: <Zap className="w-4 h-4 text-red-600" />,
};

const BORDER_MAP = {
  warning:  'border-l-amber-400',
  info:     'border-l-blue-400',
  success:  'border-l-emerald-400',
  critical: 'border-l-red-400',
};

interface AIInsightCardProps {
  insight: AIInsight;
}

export default function AIInsightCard({ insight }: AIInsightCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      className={`card p-4 border-l-4 ${BORDER_MAP[insight.type]} hover:shadow-card-hover transition-shadow cursor-pointer`}
      onClick={() => setExpanded(e => !e)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">{ICON_MAP[insight.type]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900 leading-snug">{insight.title}</p>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <InsightTypeBadge type={insight.type} />
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-0.5">
            {formatRelativeTime(insight.createdAt)} · Confidence {(insight.confidence * 100).toFixed(0)}%
          </p>

          {insight.metric && (
            <p className="text-xs font-mono text-violet-700 mt-1 bg-violet-50 px-2 py-0.5 rounded">
              {insight.metric}
            </p>
          )}

          {expanded && (
            <div className="mt-3 space-y-2 animate-fade-in">
              <p className="text-sm text-slate-600 leading-relaxed">{insight.description}</p>
              {insight.recommendation && (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-semibold text-slate-700 mb-0.5">Recommendation</p>
                  <p className="text-xs text-slate-600">{insight.recommendation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AIInsightHeader() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
        <Brain className="w-3.5 h-3.5 text-violet-600" />
      </div>
      <div>
        <span className="text-sm font-semibold text-slate-900">AI Insights</span>
        <span className="ml-2 text-xs text-violet-600 font-medium bg-violet-50 px-1.5 py-0.5 rounded">Simulated</span>
      </div>
    </div>
  );
}

