// ============================================================
// PayPulse AI — SIMULATED / DEMO Transaction Data
// NOT connected to any real payment system.
// ============================================================

import type { Transaction } from '../types';



function iso(daysAgo: number, hoursAgo = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

export const DEMO_TRANSACTIONS: Transaction[] = [
  { id: 'a1b2c3d4-0001', customerId: 'C001', customerName: 'Priya Sharma',   customerEmail: 'priya.sharma@example.com',  amount: 349900, currency: 'INR', paymentMethod: 'card',       provider: 'Provider Alpha', status: 'success',   failureProbability: 0.04, riskScore: 0.06, riskLabel: 'low',    createdAt: iso(0, 1),  updatedAt: iso(0, 1)  },
  { id: 'a1b2c3d4-0002', customerId: 'C002', customerName: 'Rahul Verma',    customerEmail: 'rahul.verma@example.com',   amount: 199900, currency: 'INR', paymentMethod: 'upi',        provider: 'Provider Beta',  status: 'failed',    failureProbability: 0.82, riskScore: 0.14, riskLabel: 'low',    errorCode: 'INSUFFICIENT_FUNDS', errorMessage: 'Insufficient balance', createdAt: iso(0, 2),  updatedAt: iso(0, 2)  },
  { id: 'a1b2c3d4-0003', customerId: 'C003', customerName: 'Ananya Iyer',    customerEmail: 'ananya.iyer@example.com',   amount: 899900, currency: 'INR', paymentMethod: 'netbanking', provider: 'Provider Alpha', status: 'success',   failureProbability: 0.09, riskScore: 0.11, riskLabel: 'low',    createdAt: iso(0, 3),  updatedAt: iso(0, 3)  },
  { id: 'a1b2c3d4-0004', customerId: 'C004', customerName: 'Kiran Patel',    customerEmail: 'kiran.patel@example.com',   amount:  74900, currency: 'INR', paymentMethod: 'wallet',     provider: 'Provider Gamma', status: 'pending',   failureProbability: 0.31, riskScore: 0.22, riskLabel: 'low',    createdAt: iso(0, 4),  updatedAt: iso(0, 4)  },
  { id: 'a1b2c3d4-0005', customerId: 'C005', customerName: 'Deepika Nair',   customerEmail: 'deepika.nair@example.com',  amount: 1499900,currency: 'INR', paymentMethod: 'card',       provider: 'Provider Alpha', status: 'flagged',   failureProbability: 0.21, riskScore: 0.88, riskLabel: 'high',   createdAt: iso(1, 0),  updatedAt: iso(1, 0)  },
  { id: 'a1b2c3d4-0006', customerId: 'C006', customerName: 'Arjun Mehta',    customerEmail: 'arjun.mehta@example.com',   amount: 549900, currency: 'INR', paymentMethod: 'upi',        provider: 'Provider Beta',  status: 'recovered', failureProbability: 0.67, riskScore: 0.08, riskLabel: 'low',    createdAt: iso(1, 2),  updatedAt: iso(1, 1)  },
  { id: 'a1b2c3d4-0007', customerId: 'C007', customerName: 'Sneha Reddy',    customerEmail: 'sneha.reddy@example.com',   amount: 299900, currency: 'INR', paymentMethod: 'card',       provider: 'Provider Alpha', status: 'success',   failureProbability: 0.05, riskScore: 0.07, riskLabel: 'low',    createdAt: iso(1, 5),  updatedAt: iso(1, 5)  },
  { id: 'a1b2c3d4-0008', customerId: 'C008', customerName: 'Vikram Singh',   customerEmail: 'vikram.singh@example.com',  amount: 149900, currency: 'INR', paymentMethod: 'netbanking', provider: 'Provider Gamma', status: 'failed',    failureProbability: 0.74, riskScore: 0.19, riskLabel: 'low',    errorCode: 'GATEWAY_TIMEOUT', errorMessage: 'Provider gateway timeout', createdAt: iso(1, 8),  updatedAt: iso(1, 8)  },
  { id: 'a1b2c3d4-0009', customerId: 'C009', customerName: 'Pooja Gupta',    customerEmail: 'pooja.gupta@example.com',   amount: 749900, currency: 'INR', paymentMethod: 'upi',        provider: 'Provider Alpha', status: 'success',   failureProbability: 0.06, riskScore: 0.05, riskLabel: 'low',    createdAt: iso(2, 0),  updatedAt: iso(2, 0)  },
  { id: 'a1b2c3d4-0010', customerId: 'C010', customerName: 'Rohit Kumar',    customerEmail: 'rohit.kumar@example.com',   amount: 399900, currency: 'INR', paymentMethod: 'card',       provider: 'Provider Beta',  status: 'success',   failureProbability: 0.12, riskScore: 0.09, riskLabel: 'low',    createdAt: iso(2, 2),  updatedAt: iso(2, 2)  },
  { id: 'a1b2c3d4-0011', customerId: 'C011', customerName: 'Meera Joshi',    customerEmail: 'meera.joshi@example.com',   amount: 249900, currency: 'INR', paymentMethod: 'wallet',     provider: 'Provider Alpha', status: 'success',   failureProbability: 0.08, riskScore: 0.12, riskLabel: 'low',    createdAt: iso(2, 6),  updatedAt: iso(2, 6)  },
  { id: 'a1b2c3d4-0012', customerId: 'C012', customerName: 'Suresh Pillai',  customerEmail: 'suresh.pillai@example.com', amount: 599900, currency: 'INR', paymentMethod: 'netbanking', provider: 'Provider Gamma', status: 'flagged',   failureProbability: 0.44, riskScore: 0.81, riskLabel: 'high',   createdAt: iso(3, 0),  updatedAt: iso(3, 0)  },
  { id: 'a1b2c3d4-0013', customerId: 'C001', customerName: 'Priya Sharma',   customerEmail: 'priya.sharma@example.com',  amount: 124900, currency: 'INR', paymentMethod: 'upi',        provider: 'Provider Alpha', status: 'success',   failureProbability: 0.03, riskScore: 0.04, riskLabel: 'low',    createdAt: iso(3, 4),  updatedAt: iso(3, 4)  },
  { id: 'a1b2c3d4-0014', customerId: 'C002', customerName: 'Rahul Verma',    customerEmail: 'rahul.verma@example.com',   amount: 849900, currency: 'INR', paymentMethod: 'card',       provider: 'Provider Beta',  status: 'recovered', failureProbability: 0.59, riskScore: 0.16, riskLabel: 'low',    createdAt: iso(4, 0),  updatedAt: iso(3, 23) },
  { id: 'a1b2c3d4-0015', customerId: 'C003', customerName: 'Ananya Iyer',    customerEmail: 'ananya.iyer@example.com',   amount: 1999900,currency: 'INR', paymentMethod: 'netbanking', provider: 'Provider Alpha', status: 'success',   failureProbability: 0.07, riskScore: 0.08, riskLabel: 'low',    createdAt: iso(4, 3),  updatedAt: iso(4, 3)  },
  { id: 'a1b2c3d4-0016', customerId: 'C004', customerName: 'Kiran Patel',    customerEmail: 'kiran.patel@example.com',   amount:  49900, currency: 'INR', paymentMethod: 'wallet',     provider: 'Provider Gamma', status: 'success',   failureProbability: 0.18, riskScore: 0.21, riskLabel: 'low',    createdAt: iso(5, 0),  updatedAt: iso(5, 0)  },
  { id: 'a1b2c3d4-0017', customerId: 'C005', customerName: 'Deepika Nair',   customerEmail: 'deepika.nair@example.com',  amount: 679900, currency: 'INR', paymentMethod: 'card',       provider: 'Provider Alpha', status: 'failed',    failureProbability: 0.78, riskScore: 0.31, riskLabel: 'medium', errorCode: 'CARD_DECLINED', createdAt: iso(5, 5),  updatedAt: iso(5, 5)  },
  { id: 'a1b2c3d4-0018', customerId: 'C006', customerName: 'Arjun Mehta',    customerEmail: 'arjun.mehta@example.com',   amount: 299900, currency: 'INR', paymentMethod: 'upi',        provider: 'Provider Beta',  status: 'success',   failureProbability: 0.11, riskScore: 0.07, riskLabel: 'low',    createdAt: iso(6, 0),  updatedAt: iso(6, 0)  },
  { id: 'a1b2c3d4-0019', customerId: 'C007', customerName: 'Sneha Reddy',    customerEmail: 'sneha.reddy@example.com',   amount: 449900, currency: 'INR', paymentMethod: 'card',       provider: 'Provider Alpha', status: 'success',   failureProbability: 0.06, riskScore: 0.05, riskLabel: 'low',    createdAt: iso(6, 8),  updatedAt: iso(6, 8)  },
  { id: 'a1b2c3d4-0020', customerId: 'C008', customerName: 'Vikram Singh',   customerEmail: 'vikram.singh@example.com',  amount: 999900, currency: 'INR', paymentMethod: 'netbanking', provider: 'Provider Gamma', status: 'pending',   failureProbability: 0.28, riskScore: 0.52, riskLabel: 'medium', createdAt: iso(7, 0),  updatedAt: iso(7, 0)  },
];

// Paginate helper
export function paginateTransactions(
  txns: Transaction[],
  page: number,
  pageSize: number
): { items: Transaction[]; total: number; totalPages: number } {
  const total = txns.length;
  const totalPages = Math.ceil(total / pageSize);
  const items = txns.slice((page - 1) * pageSize, page * pageSize);
  return { items, total, totalPages };
}

// Filter helper
export function filterTransactions(
  txns: Transaction[],
  search: string,
  status: string,
  method: string,
  provider: string
): Transaction[] {
  const q = search.toLowerCase();
  return txns.filter(t => {
    const matchSearch =
      !q ||
      t.customerName.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.customerEmail.toLowerCase().includes(q);
    const matchStatus   = status === 'all'   || t.status === status;
    const matchMethod   = method === 'all'   || t.paymentMethod === method;
    const matchProvider = provider === 'all' || t.provider === provider;
    return matchSearch && matchStatus && matchMethod && matchProvider;
  });
}
