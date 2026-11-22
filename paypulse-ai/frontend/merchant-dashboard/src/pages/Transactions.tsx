import { useState, useMemo, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionDetail from '../components/transactions/TransactionDetail';
import PageHeader from '../components/common/PageHeader';
import { DemoBanner } from '../components/common/DemoBanner';
import { DEMO_TRANSACTIONS, filterTransactions } from '../data/transactions';
import { DEMO_PROVIDERS } from '../data/providers';
import type { Transaction, TransactionStatus, PaymentMethod } from '../types';

export default function Transactions() {
  const location = useLocation();

  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState<TransactionStatus | 'all'>('all');
  const [method, setMethod]     = useState<PaymentMethod | 'all'>('all');
  const [provider, setProvider] = useState('all');
  const [selected, setSelected] = useState<Transaction | null>(null);

  // Pick up search query passed via header global search (URL state)
  useEffect(() => {
    const state = location.state as { search?: string } | null;
    if (state?.search) {
      setSearch(state.search);
      // Clear state so a back-nav doesn't re-apply the query
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const filtered = useMemo(
    () => filterTransactions(DEMO_TRANSACTIONS, search, status, method, provider),
    [search, status, method, provider]
  );

  return (
    <div className="space-y-6">
      <DemoBanner />
      <PageHeader
        title="Transactions"
        description="View and search all payment transactions processed through PayPulse AI."
        badge={<span className="demo-badge">DEMO DATA</span>}
        actions={
          <button className="btn-secondary text-xs gap-1.5" title="Export (placeholder)">
            <Download className="w-3.5 h-3.5" />
            Export CSV
            <span className="text-slate-400 text-xs">(placeholder)</span>
          </button>
        }
      />

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by customer name, email, or ID…"
              className="input pl-9"
            />
          </div>

          {/* Status filter */}
          <div className="relative min-w-36">
            <select value={status} onChange={e => setStatus(e.target.value as TransactionStatus | 'all')} className="select pr-8">
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
              <option value="recovered">Recovered</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>

          {/* Method filter */}
          <div className="relative min-w-36">
            <select value={method} onChange={e => setMethod(e.target.value as PaymentMethod | 'all')} className="select pr-8">
              <option value="all">All Methods</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net Banking</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>

          {/* Provider filter */}
          <div className="relative min-w-40">
            <select value={provider} onChange={e => setProvider(e.target.value)} className="select pr-8">
              <option value="all">All Providers</option>
              {DEMO_PROVIDERS.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Reset */}
          {(search || status !== 'all' || method !== 'all' || provider !== 'all') && (
            <button
              onClick={() => { setSearch(''); setStatus('all'); setMethod('all'); setProvider('all'); }}
              className="btn-ghost text-xs"
            >
              Clear filters
            </button>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-3">
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
          <span className="font-semibold text-slate-700">{DEMO_TRANSACTIONS.length}</span> transactions
        </p>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <TransactionTable
          transactions={filtered}
          pageSize={10}
          onSelect={setSelected}
        />
      </div>

      {selected && <TransactionDetail transaction={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

