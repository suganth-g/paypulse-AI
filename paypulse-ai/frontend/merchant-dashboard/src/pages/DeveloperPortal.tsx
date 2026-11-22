import { useState } from 'react';
import { Copy, Check, Webhook, Key, ChevronDown, ChevronUp, Terminal, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { DemoBanner } from '../components/common/DemoBanner';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function CodeBlock({ code, language = 'json' }: { code: string; language?: string }) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 rounded-t-lg border-b border-slate-700">
        <span className="text-xs text-slate-400 font-mono">{language}</span>
        <CopyButton text={code} />
      </div>
      <pre className="p-4 bg-slate-900 rounded-b-lg overflow-x-auto text-xs text-slate-300 font-mono leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

function ApiEndpoint({ method, path, description, request, response, expanded, onToggle }: {
  method: string; path: string; description: string;
  request: string; response: string;
  expanded: boolean; onToggle: () => void;
}) {
  const methodColors: Record<string, string> = {
    GET: 'bg-emerald-100 text-emerald-700', POST: 'bg-blue-100 text-blue-700',
    PATCH: 'bg-amber-100 text-amber-700',   DELETE: 'bg-red-100 text-red-700',
  };
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left"
        onClick={onToggle}
      >
        <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold font-mono flex-shrink-0 ${methodColors[method]}`}>{method}</span>
        <span className="font-mono text-sm text-slate-700 flex-1 truncate">{path}</span>
        <span className="text-xs text-slate-400 hidden sm:block">{description}</span>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 animate-fade-in border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-600">{description}</p>
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Request</p>
            <CodeBlock code={request} language="json" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Response</p>
            <CodeBlock code={response} language="json" />
          </div>
        </div>
      )}
    </div>
  );
}

const ENDPOINTS = [
  {
    method: 'POST', path: '/api/v1/transactions',
    description: 'Submit a new payment transaction for processing.',
    request: `{
  "merchantId": "merch-001",
  "amount": 349900,
  "currency": "INR",
  "paymentMethod": "card",
  "customerId": "cust-abc123",
  "metadata": {
    "orderId": "ord-9823",
    "description": "Premium subscription"
  }
}`,
    response: `{
  "success": true,
  "data": {
    "id": "a1b2c3d4-0001",
    "status": "SUCCESS",
    "provider": "Provider Alpha",
    "amount": 349900,
    "currency": "INR",
    "failureProbability": 0.04,
    "riskScore": 0.06,
    "riskLabel": "LOW",
    "routingStrategy": "AI_GUIDED",
    "createdAt": "2026-11-22T09:30:00Z"
  },
  "meta": { "requestId": "req-uuid", "timestamp": "2026-11-22T09:30:00Z" },
  "error": null
}`,
  },
  {
    method: 'GET', path: '/api/v1/transactions/{id}',
    description: 'Retrieve a specific transaction by its UUID.',
    request: '// No request body — provide transaction UUID in path\n// GET /api/v1/transactions/a1b2c3d4-0001',
    response: `{
  "success": true,
  "data": {
    "id": "a1b2c3d4-0001",
    "status": "SUCCESS",
    "customerName": "Priya Sharma",
    "amount": 349900,
    "provider": "Provider Alpha",
    "failureProbability": 0.04,
    "createdAt": "2026-11-22T09:30:00Z"
  },
  "meta": { "requestId": "req-uuid", "timestamp": "2026-11-22T09:30:01Z" },
  "error": null
}`,
  },
  {
    method: 'GET', path: '/api/v1/providers',
    description: 'List all payment providers and their current health status.',
    request: '// No request body\n// Optional query params: ?status=healthy',
    response: `{
  "success": true,
  "data": [
    { "id": "prov-alpha", "name": "Provider Alpha", "status": "HEALTHY", "successRate": 97.4, "avgLatencyMs": 142, "healthScore": 98 },
    { "id": "prov-beta",  "name": "Provider Beta",  "status": "DEGRADED","successRate": 91.2, "avgLatencyMs": 198, "healthScore": 83 }
  ],
  "meta": { "requestId": "req-uuid", "timestamp": "2026-11-22T09:30:02Z" },
  "error": null
}`,
  },
  {
    method: 'GET', path: '/api/v1/fraud/alerts',
    description: 'List fraud alerts with optional status filtering.',
    request: '// GET /api/v1/fraud/alerts?status=open&page=1&pageSize=10',
    response: `{
  "success": true,
  "data": {
    "items": [
      { "id": "fa-001", "transactionId": "a1b2c3d4-0005", "riskScore": 0.88, "riskLabel": "HIGH", "status": "OPEN" }
    ],
    "total": 2, "page": 1, "pageSize": 10
  },
  "meta": { "requestId": "req-uuid", "timestamp": "2026-11-22T09:30:03Z" },
  "error": null
}`,
  },
];

const BASE_URL_CODE = `# Base URL (development)
BASE_URL=http://localhost:8080

# Example: Submit a transaction
curl -X POST "$BASE_URL/api/v1/transactions" \\
  -H "Content-Type: application/json" \\
  -H "X-Api-Key: YOUR_API_KEY" \\
  -d '{
    "merchantId": "merch-001",
    "amount": 349900,
    "currency": "INR",
    "paymentMethod": "card"
  }'`;

export default function DeveloperPortal() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      <DemoBanner />
      <PageHeader
        title="Developer Portal"
        description="API reference, example requests, and integration guidance for PayPulse AI."
      />

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Documentation only — </span>
          The Java backend API is not yet implemented (Phase 2). These are placeholder specifications.
          No real API keys are created here.
        </p>
      </div>

      {/* Quick start */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">Quick Start</h3>
        </div>
        <CodeBlock code={BASE_URL_CODE} language="bash" />
      </div>

      {/* API key placeholder */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Key className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">API Authentication (Placeholder)</h3>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="font-mono text-sm text-slate-500 flex-1">pp_demo_••••••••••••••••••••••••••••••••</span>
          <button className="btn-secondary text-xs" title="API key management coming in Phase 2">
            <Key className="w-3.5 h-3.5" /> Manage Keys (Phase 2)
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">Pass your API key in the <code className="bg-slate-100 px-1 rounded">X-Api-Key</code> header with every request.</p>
      </div>

      {/* Endpoints */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">API Endpoints</h3>
        <div className="space-y-3">
          {ENDPOINTS.map((ep, i) => (
            <ApiEndpoint
              key={i}
              {...ep}
              expanded={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </div>

      {/* Webhooks placeholder */}
      <div className="card p-5 border-dashed bg-slate-50">
        <div className="flex items-center gap-2 mb-2">
          <Webhook className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">Webhooks</h3>
          <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-medium">Phase 8</span>
        </div>
        <p className="text-sm text-slate-500">
          Webhook delivery for real-time event notifications will be implemented in Phase 8 (Kafka integration).
          Events include: <code className="bg-white px-1 rounded text-xs">transaction.created</code>,{' '}
          <code className="bg-white px-1 rounded text-xs">transaction.succeeded</code>,{' '}
          <code className="bg-white px-1 rounded text-xs">fraud.alert.created</code>.
        </p>
      </div>
    </div>
  );
}

