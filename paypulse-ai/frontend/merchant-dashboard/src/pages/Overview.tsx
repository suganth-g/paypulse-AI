import { useState } from 'react';
import {
  ArrowLeftRight, TrendingUp, TrendingDown,
  CreditCard, Activity, AlertTriangle,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

import SummaryCard from '../components/dashboard/SummaryCard';
import AIInsightCard, { AIInsightHeader } from '../components/dashboard/AIInsightCard';
import ProviderCard from '../components/dashboard/ProviderCard';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionDetail from '../components/transactions/TransactionDetail';
import PageHeader from '../components/common/PageHeader';
import { DemoBanner, AISimulatedNote } from '../components/common/DemoBanner';

import { DEMO_TRANSACTIONS } from '../data/transactions';
import { DEMO_PROVIDERS } from '../data/providers';
import { DEMO_INSIGHTS } from '../data/insights';
import {
  DEMO_SUMMARY, getSeriesForRange, DEMO_METHOD_BREAKDOWN, DEMO_STATUS_DISTRIBUTION,
} from '../data/analytics';
import type { Transaction, DateRange } from '../types';
import { formatLargeAmount, formatPercent } from '../utils/formatters';

type ChartTab = 'volume' | 'methods' | 'status';

export default function Overview() {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [chartTab, setChartTab] = useState<ChartTab>('volume');
  const [selected, setSelected] = useState<Transaction | null>(null);

  const series = getSeriesForRange(dateRange);
  const s = DEMO_SUMMARY;

  return (
    <div className="space-y-6">
      <DemoBanner />

      <PageHeader
        title="Payment Intelligence Overview"
        description="Real-time view of your payment operations, AI insights, and provider health."
        badge={<span className="demo-badge">DEMO DATA</span>}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <SummaryCard
          title="Total Transactions"
          value={s.totalTransactions.toLocaleString()}
          change={s.changeVsPrev.totalTransactions}
          icon={<ArrowLeftRight className="w-4 h-4" />}
          iconBg="bg-blue-50"
          accentColor="text-blue-600"
        />
        <SummaryCard
          title="Successful"
          value={s.successfulPayments.toLocaleString()}
          icon={<TrendingUp className="w-4 h-4" />}
          iconBg="bg-emerald-50"
          accentColor="text-emerald-600"
        />
        <SummaryCard
          title="Failed"
          value={s.failedPayments.toLocaleString()}
          change={s.changeVsPrev.failedPayments}
          icon={<TrendingDown className="w-4 h-4" />}
          iconBg="bg-red-50"
          accentColor="text-red-600"
        />
        <SummaryCard
          title="Success Rate"
          value={formatPercent(s.successRate)}
          change={s.changeVsPrev.successRate}
          icon={<Activity className="w-4 h-4" />}
          iconBg="bg-violet-50"
          accentColor="text-violet-600"
        />
        <SummaryCard
          title="Total Volume"
          value={formatLargeAmount(s.totalVolume * 100)}
          change={s.changeVsPrev.totalVolume}
          icon={<CreditCard className="w-4 h-4" />}
          iconBg="bg-amber-50"
          accentColor="text-amber-600"
        />
        <SummaryCard
          title="Failure Risk (AI)"
          value={formatPercent(s.predictedFailureRisk)}
          footnote="Simulated AI prediction"
          icon={<AlertTriangle className="w-4 h-4" />}
          iconBg="bg-orange-50"
          accentColor="text-orange-600"
        />
      </div>

      {/* Charts + Analytics */}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {(['volume', 'methods', 'status'] as ChartTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setChartTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  chartTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'volume' ? 'Volume Trend' : tab === 'methods' ? 'Payment Methods' : 'Status Split'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {(['7d', '30d', '90d'] as DateRange[]).map(r => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  dateRange === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
              </button>
            ))}
          </div>
        </div>
        <div className="p-5 h-72">
          {chartTab === 'volume' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} interval={dateRange === '90d' ? 14 : dateRange === '30d' ? 6 : 0} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="success" stroke="#10B981" strokeWidth={2} dot={false} name="Success" />
                <Line type="monotone" dataKey="failed"  stroke="#EF4444" strokeWidth={2} dot={false} name="Failed"  />
              </LineChart>
            </ResponsiveContainer>
          )}
          {chartTab === 'methods' && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DEMO_METHOD_BREAKDOWN} dataKey="count" nameKey="method" cx="50%" cy="50%" outerRadius={100} paddingAngle={2}>
                  {DEMO_METHOD_BREAKDOWN.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v: unknown) => [(v as number).toLocaleString(), 'Transactions']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} formatter={(value, entry) => {
                  const payload = entry.payload as { percentage?: number } | undefined;
                  return `${value} (${payload?.percentage ?? 0}%)`;
                }} />
              </PieChart>
            </ResponsiveContainer>
          )}
          {chartTab === 'status' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMO_STATUS_DISTRIBUTION} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Transactions">
                  {DEMO_STATUS_DISTRIBUTION.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Provider Health + AI Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Provider Health */}
        <div className="xl:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Provider Health</h3>
            <span className="text-xs text-slate-400">Updated 30s ago</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DEMO_PROVIDERS.map(p => (
              <ProviderCard key={p.id} provider={p} highlight={p.code === 'ALPHA'} />
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="xl:col-span-2 space-y-3">
          <AIInsightHeader />
          <AISimulatedNote />
          <div className="space-y-2">
            {DEMO_INSIGHTS.slice(0, 3).map(i => (
              <AIInsightCard key={i.id} insight={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Recent Transactions</h3>
          <span className="demo-badge">DEMO DATA</span>
        </div>
        <TransactionTable
          transactions={DEMO_TRANSACTIONS}
          pageSize={5}
          onSelect={setSelected}
          compact
        />
      </div>

      {selected && <TransactionDetail transaction={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

