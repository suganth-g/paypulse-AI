import { useState } from 'react';
import { Zap, CheckCircle, ChevronRight, Info } from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';
import ProviderCard from '../components/dashboard/ProviderCard';
import PageHeader from '../components/common/PageHeader';
import { DemoBanner, SimulatedBadge } from '../components/common/DemoBanner';
import { DEMO_PROVIDERS, ROUTING_RECOMMENDATION } from '../data/providers';

const RADAR_DATA = [
  { metric: 'Success Rate', Alpha: 97, Beta: 91, Gamma: 79 },
  { metric: 'Latency',      Alpha: 93, Beta: 78, Gamma: 52 },
  { metric: 'Health',       Alpha: 98, Beta: 83, Gamma: 55 },
  { metric: 'Cost Eff.',    Alpha: 72, Beta: 85, Gamma: 95 },
  { metric: 'Reliability',  Alpha: 96, Beta: 80, Gamma: 60 },
];

// Simulated routing recommendations per transaction type
const ROUTING_BY_TYPE: Record<string, {
  recommended: string;
  confidence: number;
  reasons: string[];
  alternates: { provider: string; score: number; note: string }[];
}> = {
  'high-value': ROUTING_RECOMMENDATION,
  'upi': {
    recommended: 'Provider Alpha',
    confidence: 0.91,
    reasons: [
      'Best UPI success rate (96.8%) over the last 7 days',
      'Sub-150ms average response for UPI rail',
      'Preferred for instant payment settlements',
    ],
    alternates: [
      { provider: 'Provider Beta',  score: 0.68, note: 'Acceptable for UPI — slightly higher failure rate' },
      { provider: 'Provider Gamma', score: 0.35, note: 'Not recommended — UPI timeout rate elevated' },
    ],
  },
  'card': {
    recommended: 'Provider Beta',
    confidence: 0.78,
    reasons: [
      'Lower processing fee (1.5%) for card transactions',
      'Comparable success rate to Alpha for domestic cards',
      'Preferred for cost-sensitive card volume',
    ],
    alternates: [
      { provider: 'Provider Alpha', score: 0.85, note: 'Higher reliability — use for premium cards' },
      { provider: 'Provider Gamma', score: 0.30, note: 'Not recommended — elevated card decline rate' },
    ],
  },
  'recovery': {
    recommended: 'Provider Alpha',
    confidence: 0.88,
    reasons: [
      'Highest success rate on retry attempts (94.2%)',
      'No shared failure modes with common failure reasons',
      'Recovery latency within acceptable SLA (< 500ms)',
    ],
    alternates: [
      { provider: 'Provider Beta',  score: 0.60, note: 'Second-attempt fallback — moderate recovery rate' },
      { provider: 'Provider Gamma', score: 0.28, note: 'Last resort only — low recovery success' },
    ],
  },
};

export default function SmartRouting() {
  const [selectedTxnType, setSelectedTxnType] = useState('high-value');

  const rec = ROUTING_BY_TYPE[selectedTxnType] ?? ROUTING_RECOMMENDATION;

  const barData = DEMO_PROVIDERS.map(p => ({
    name: p.code,
    successRate: p.successRate,
    latency: p.avgLatencyMs,
    health: p.healthScore,
  }));

  return (
    <div className="space-y-6">
      <DemoBanner />
      <PageHeader
        title="Smart Routing Engine"
        description="AI-powered provider selection for optimal payment success rates."
        badge={<SimulatedBadge />}
      />

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-800">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
        <p className="text-sm">
          <span className="font-semibold">Simulated routing — </span>
          Routing decisions shown here are based on simulated provider data and illustrative AI recommendations.
          No real payment providers are connected.
        </p>
      </div>

      {/* AI Routing Recommendation */}
      <div className="card p-5 border-l-4 border-l-blue-500">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-bold text-slate-900">AI Routing Recommendation</p>
              <SimulatedBadge />
            </div>

            {/* Transaction type selector */}
            <div className="flex gap-2 mb-3 flex-wrap">
              {['high-value', 'upi', 'card', 'recovery'].map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTxnType(t)}
                  className={`text-xs px-3 py-1 rounded-full border font-medium transition-all ${
                    selectedTxnType === t
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {t === 'high-value' ? 'High Value' : t === 'upi' ? 'UPI' : t === 'card' ? 'Card' : 'Recovery'}
                </button>
              ))}
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-bold text-emerald-800">
                  Recommended: {rec.recommended}
                </p>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {(rec.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>
              <ul className="space-y-1">
                {rec.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-700">
                    <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Alternates */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-slate-600">Fallback Providers</p>
              {rec.alternates.map(alt => (
                <div key={alt.provider} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <span className="text-xs font-medium text-slate-700">{alt.provider}</span>
                    <span className="text-xs text-slate-400 ml-2">{alt.note}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Score: {(alt.score * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Provider comparison cards */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Provider Comparison</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {DEMO_PROVIDERS.map(p => (
            <ProviderCard key={p.id} provider={p} highlight={p.code === 'ALPHA'} />
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Success Rate vs Latency</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="successRate" name="Success Rate %" radius={[4, 4, 0, 0]}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={['#10B981', '#F59E0B', '#EF4444'][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Multi-Dimension Comparison</h3>
          <p className="text-xs text-slate-400 mb-4">Scores normalised 0–100 across all dimensions</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Radar name="Alpha" dataKey="Alpha" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
                <Radar name="Beta"  dataKey="Beta"  stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.15} />
                <Radar name="Gamma" dataKey="Gamma" stroke="#EF4444" fill="#EF4444" fillOpacity={0.15} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {[['Alpha', '#10B981'], ['Beta', '#F59E0B'], ['Gamma', '#EF4444']].map(([n, c]) => (
              <span key={n} className="flex items-center gap-1 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

