import { useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import PageHeader from '../components/common/PageHeader';
import { DemoBanner } from '../components/common/DemoBanner';
import {
  DEMO_PROVIDER_ANALYTICS, DEMO_METHOD_BREAKDOWN,
  getSeriesForRange,
} from '../data/analytics';
import { formatChartAmount, formatPercent } from '../utils/formatters';
import type { DateRange } from '../types';

export default function Analytics() {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const series = getSeriesForRange(dateRange);

  return (
    <div className="space-y-6">
      <DemoBanner />
      <PageHeader
        title="Analytics"
        description="Payment volume trends, success rates, provider performance, and method breakdown."
        badge={<span className="demo-badge">DEMO DATA</span>}
        actions={
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {(['7d', '30d', '90d'] as DateRange[]).map(r => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  dateRange === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        }
      />

      {/* Volume trend */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Payment Volume Trend</h3>
        <p className="text-xs text-slate-400 mb-4">Daily transaction count — Success vs Failed</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="failedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false}
                interval={dateRange === '90d' ? 14 : dateRange === '30d' ? 6 : 0} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="success" stroke="#10B981" strokeWidth={2} fill="url(#successGrad)" name="Success" />
              <Area type="monotone" dataKey="failed"  stroke="#EF4444" strokeWidth={2} fill="url(#failedGrad)"  name="Failed"  />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Provider + Method breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Provider performance */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Provider Performance</h3>
          <p className="text-xs text-slate-400 mb-4">Success rate and transaction volume by provider</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMO_PROVIDER_ANALYTICS} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar yAxisId="left"  dataKey="successRate"  name="Success Rate %" radius={[4,4,0,0]} fill="#10B981" />
                <Bar yAxisId="right" dataKey="transactions" name="Transactions" radius={[4,4,0,0]} fill="#3B82F6" fillOpacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Method breakdown */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Payment Method Breakdown</h3>
          <p className="text-xs text-slate-400 mb-4">Distribution of transactions by payment method</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEMO_METHOD_BREAKDOWN}
                  dataKey="count" nameKey="method"
                  cx="50%" cy="50%"
                  outerRadius={90} innerRadius={50}
                  paddingAngle={3}
                >
                  {DEMO_METHOD_BREAKDOWN.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v: unknown) => [(v as number).toLocaleString(), 'Transactions']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} formatter={(value, entry) => {
                  const payload = entry.payload as { percentage?: number } | undefined;
                  return `${value} (${payload?.percentage ?? 0}%)`;
                }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue by provider */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Revenue by Provider</h3>
        <p className="text-xs text-slate-400 mb-4">Total payment volume processed per provider (INR)</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DEMO_PROVIDER_ANALYTICS} layout="vertical" margin={{ top: 4, right: 32, left: 24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} tickFormatter={v => formatChartAmount(v)} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={96} />
              <Tooltip formatter={(v: unknown) => [formatChartAmount(v as number), 'Revenue']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="revenue" name="Revenue (INR)" radius={[0, 4, 4, 0]}>
                {DEMO_PROVIDER_ANALYTICS.map((_, i) => (
                  <Cell key={i} fill={['#10B981','#F59E0B','#EF4444'][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Provider table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
          <p className="text-sm font-semibold text-slate-700">Provider Summary Table</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="table-th">Provider</th>
              <th className="table-th text-right">Transactions</th>
              <th className="table-th text-right">Success Rate</th>
              <th className="table-th text-right">Avg Latency</th>
              <th className="table-th text-right">Volume (INR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {DEMO_PROVIDER_ANALYTICS.map(p => (
              <tr key={p.name} className="hover:bg-slate-50 transition-colors">
                <td className="table-td font-medium">{p.name}</td>
                <td className="table-td text-right tabular-nums">{p.transactions.toLocaleString()}</td>
                <td className="table-td text-right tabular-nums">{formatPercent(p.successRate)}</td>
                <td className="table-td text-right tabular-nums font-mono text-xs">{p.avgLatency}ms</td>
                <td className="table-td text-right tabular-nums font-semibold">{formatChartAmount(p.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

