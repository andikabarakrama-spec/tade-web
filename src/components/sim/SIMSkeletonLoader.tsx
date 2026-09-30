import React from 'react';

interface SIMSkeletonLoaderProps {
  type?: 'dashboard' | 'table' | 'cards' | 'form';
}

export const SIMSkeletonLoader: React.FC<SIMSkeletonLoaderProps> = ({ type = 'dashboard' }) => {
  if (type === 'table') {
    return (
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 animate-pulse">
        <div className="flex justify-between items-center pb-4 border-b border-stone-100">
          <div className="h-6 w-48 bg-stone-200 rounded-lg"></div>
          <div className="h-9 w-32 bg-stone-200 rounded-xl"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-stone-100 rounded-xl flex items-center justify-between px-4">
              <div className="h-4 w-1/4 bg-stone-200 rounded"></div>
              <div className="h-4 w-1/6 bg-stone-200 rounded"></div>
              <div className="h-4 w-1/5 bg-stone-200 rounded"></div>
              <div className="h-6 w-16 bg-stone-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 bg-stone-200 rounded-xl"></div>
              <div className="w-16 h-5 bg-stone-200 rounded-full"></div>
            </div>
            <div className="h-4 w-1/2 bg-stone-200 rounded"></div>
            <div className="h-8 w-3/4 bg-stone-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 bg-stone-200 rounded-2xl shrink-0"></div>
          <div className="space-y-2 w-full">
            <div className="h-4 w-36 bg-stone-200 rounded-full"></div>
            <div className="h-7 w-64 bg-stone-200 rounded-lg"></div>
          </div>
        </div>
        <div className="h-10 w-44 bg-stone-200 rounded-xl shrink-0"></div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 bg-stone-200 rounded-xl"></div>
              <div className="w-16 h-5 bg-stone-200 rounded-full"></div>
            </div>
            <div className="h-4 w-1/2 bg-stone-200 rounded"></div>
            <div className="h-8 w-3/4 bg-stone-200 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Main Panel Skeleton */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="h-6 w-56 bg-stone-200 rounded-lg"></div>
        <div className="h-48 bg-stone-100 rounded-2xl"></div>
      </div>
    </div>
  );
};
