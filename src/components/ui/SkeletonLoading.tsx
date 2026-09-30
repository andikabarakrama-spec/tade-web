import React from 'react';

interface SkeletonLoadingProps {
  type?: 'card' | 'table' | 'banner' | 'dashboard';
  count?: number;
}

export const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
  type = 'card',
  count = 3
}) => {
  const items = Array.from({ length: count });

  if (type === 'dashboard') {
    return (
      <div className="w-full space-y-6 animate-pulse p-4 sm:p-6" aria-label="Memuat data...">
        {/* Metric Header Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-800/60 rounded-2xl border border-slate-700/50 p-4 flex flex-col justify-between">
              <div className="h-4 w-1/2 bg-slate-700/60 rounded" />
              <div className="h-7 w-3/4 bg-slate-600/50 rounded" />
            </div>
          ))}
        </div>

        {/* Main Panel Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-slate-800/60 rounded-2xl border border-slate-700/50 p-6 space-y-4">
            <div className="h-5 w-1/3 bg-slate-700/60 rounded" />
            <div className="h-48 w-full bg-slate-700/30 rounded-xl" />
          </div>
          <div className="h-72 bg-slate-800/60 rounded-2xl border border-slate-700/50 p-6 space-y-3">
            <div className="h-5 w-1/2 bg-slate-700/60 rounded" />
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-12 w-full bg-slate-700/40 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="w-full space-y-3 animate-pulse p-4" aria-label="Memuat tabel...">
        <div className="h-10 w-full bg-slate-800 rounded-xl border border-slate-700/50" />
        {items.map((_, i) => (
          <div key={i} className="h-12 w-full bg-slate-800/50 rounded-xl border border-slate-700/30" />
        ))}
      </div>
    );
  }

  if (type === 'banner') {
    return (
      <div className="w-full h-44 bg-slate-800/70 rounded-3xl border border-slate-700/50 animate-pulse p-6 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-6 w-1/3 bg-slate-700/80 rounded" />
          <div className="h-4 w-2/3 bg-slate-700/50 rounded" />
        </div>
        <div className="h-10 w-32 bg-slate-700/70 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse p-4" aria-label="Memuat kartu...">
      {items.map((_, i) => (
        <div key={i} className="h-48 bg-slate-800/60 rounded-2xl border border-slate-700/40 p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-5 w-3/4 bg-slate-700/70 rounded" />
            <div className="h-3 w-full bg-slate-700/40 rounded" />
            <div className="h-3 w-5/6 bg-slate-700/40 rounded" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="h-6 w-20 bg-slate-700/60 rounded-full" />
            <div className="h-8 w-24 bg-slate-700/70 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};
