import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div 
      className={`animate-pulse bg-gray-700/50 rounded ${className}`}
      role="status"
      aria-label="Loading..."
    />
  );
};

export const TextSkeleton: React.FC<{ width?: string; lines?: number }> = ({ 
  width = "w-full", 
  lines = 1 
}) => {
  return (
    <div className={`space-y-2 ${width}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4" />
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface-dark border border-[#332a1e] rounded-lg p-4 space-y-3">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
};

export const ButtonSkeleton: React.FC = () => {
  return (
    <Skeleton className="h-10 w-full" />
  );
};

export const ToolSkeleton: React.FC = () => {
  return (
    <div className="p-4 bg-surface-dark border border-[#332a1e] rounded-lg">
      <div className="flex items-start gap-3">
        <Skeleton className="w-6 h-6 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
};
