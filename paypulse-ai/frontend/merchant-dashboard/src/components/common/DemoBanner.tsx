import { AlertTriangle, Info, FlaskConical } from 'lucide-react';

export function DemoBanner() {
  return (
    <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
      <FlaskConical className="w-4 h-4 flex-shrink-0 text-amber-600" />
      <p className="text-sm">
        <span className="font-semibold">Demo Environment — </span>
        All data shown is synthetic and simulated. No real payment transactions are processed.
      </p>
      <span className="ml-auto flex-shrink-0 demo-badge">DEMO DATA</span>
    </div>
  );
}

export function SimulatedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 border border-violet-200">
      <FlaskConical className="w-3 h-3" />
      Simulated
    </span>
  );
}

export function AISimulatedNote() {
  return (
    <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-violet-50 border border-violet-100">
      <Info className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-violet-700">
        <span className="font-semibold">Simulated AI insights — </span>
        These are illustrative examples and do not represent real AI predictions.
        The AI/ML service will be connected in Phase 3.
      </p>
    </div>
  );
}

export function PlaceholderNote({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs text-slate-500 bg-slate-100 border border-slate-200">
      <AlertTriangle className="w-3 h-3" />
      {label} (Placeholder)
    </span>
  );
}
