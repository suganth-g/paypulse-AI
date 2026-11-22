

interface LoadingStateProps {
  rows?: number;
  type?: 'table' | 'cards' | 'chart';
}

function SkeletonLine({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;
}

export default function LoadingState({ rows = 5, type = 'table' }: LoadingStateProps) {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="card p-5 space-y-3">
            <SkeletonLine className="h-3 w-24" />
            <SkeletonLine className="h-7 w-32" />
            <SkeletonLine className="h-3 w-20" />
          </div>
        ))}
      </div>
    );
  }
  if (type === 'chart') {
    return (
      <div className="card p-6">
        <SkeletonLine className="h-4 w-40 mb-6" />
        <div className="h-56 flex items-end gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 animate-pulse rounded-t bg-slate-200"
              style={{ height: `${30 + Math.random() * 60}%` }}
            />
          ))}
        </div>
      </div>
    );
  }
  // table
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-100 px-4 py-3">
        <SkeletonLine className="h-4 w-32" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-3 flex items-center gap-4">
            <SkeletonLine className="h-3 w-24 flex-shrink-0" />
            <SkeletonLine className="h-3 w-32" />
            <SkeletonLine className="h-3 w-20 ml-auto" />
            <SkeletonLine className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
