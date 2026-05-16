'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted/60", className)} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-squircle-md border bg-card p-0 overflow-hidden flex flex-col h-full shadow-soft">
      <div className="m-3">
        <Skeleton className="aspect-[4/5] rounded-squircle-sm" />
      </div>
      <div className="p-8 pt-2 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-full" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-16 rounded-squircle-sm" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="pt-6 border-t border-muted/20 flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-14 w-14 rounded-squircle-sm" />
        </div>
      </div>
    </div>
  );
}

export function StoreCardSkeleton() {
  return (
    <div className="rounded-squircle-md md:rounded-squircle-lg border bg-card overflow-hidden flex flex-col h-full shadow-soft">
      <Skeleton className="h-52 w-full" />
      <div className="p-10 pt-0 relative">
        <Skeleton className="h-28 w-28 rounded-squircle-sm border-8 border-card -mt-14 mb-6" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-12 w-full mb-10" />
        <div className="pt-8 border-t border-muted/20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-20 rounded-squircle-sm" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-14 w-32 rounded-squircle-sm" />
        </div>
      </div>
    </div>
  );
}
