import React, { useState, useMemo } from 'react';
import type { Transaction } from '../../types';
import { TransactionStatusBadge, PaymentMethodBadge } from '../common/StatusBadge';
import { formatCurrency, formatDateTime, formatTxnId } from '../../utils/formatters';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import EmptyState from '../common/EmptyState';

interface TransactionTableProps {
  transactions: Transaction[];
  pageSize?: number;
  onSelect?: (txn: Transaction) => void;
  compact?: boolean;
}

export default function TransactionTable({
  transactions, pageSize = 10, onSelect, compact = false,
}: TransactionTableProps) {
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever the transaction list changes (e.g. filter applied)
  const prevLength = React.useRef(transactions.length);
  if (prevLength.current !== transactions.length) {
    prevLength.current = transactions.length;
    if (page !== 1) setPage(1);
  }

  const totalPages = Math.ceil(transactions.length / pageSize);
  const paged = useMemo(
    () => transactions.slice((page - 1) * pageSize, page * pageSize),
    [transactions, page, pageSize]
  );

  if (transactions.length === 0) return <EmptyState />;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="table-th">Transaction ID</th>
              <th className="table-th">Customer</th>
              {!compact && <th className="table-th">Method</th>}
              <th className="table-th">Provider</th>
              <th className="table-th text-right">Amount</th>
              <th className="table-th">Status</th>
              {!compact && <th className="table-th">Date & Time</th>}
              <th className="table-th" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paged.map(txn => (
              <tr
                key={txn.id}
                className="table-row"
                onClick={() => onSelect?.(txn)}
              >
                <td className="table-td font-mono text-xs text-slate-600">{formatTxnId(txn.id)}</td>
                <td className="table-td">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{txn.customerName}</p>
                    {!compact && <p className="text-xs text-slate-400">{txn.customerEmail}</p>}
                  </div>
                </td>
                {!compact && (
                  <td className="table-td"><PaymentMethodBadge method={txn.paymentMethod} /></td>
                )}
                <td className="table-td text-xs text-slate-500">{txn.provider}</td>
                <td className="table-td text-right font-semibold text-slate-900 tabular-nums">
                  {formatCurrency(txn.amount)}
                </td>
                <td className="table-td"><TransactionStatusBadge status={txn.status} /></td>
                {!compact && (
                  <td className="table-td text-xs text-slate-500 whitespace-nowrap">{formatDateTime(txn.createdAt)}</td>
                )}
                <td className="table-td text-right">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, transactions.length)} of {transactions.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pg = i + 1;
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                    pg === page ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {pg}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
