import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function CurrentWeatherSkeleton() {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="bg-primary/20 p-6 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-14 w-24" />
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="p-6 pt-4 grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
      </div>
    </div>
  );
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-xl border bg-card shadow-sm p-6 space-y-4">
      <Skeleton className="h-5 w-36" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border bg-card shadow-sm p-6 space-y-4">
      <Skeleton className="h-5 w-36" />
      <div className="flex justify-around">
        {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-16 w-10" />)}
      </div>
      <Skeleton className="h-[220px] w-full" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <CurrentWeatherSkeleton />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CardSkeleton rows={2} />
          <CardSkeleton rows={2} />
        </div>
        <CardSkeleton rows={4} />
        <ChartSkeleton />
        <CardSkeleton rows={2} />
      </div>
      <div className="space-y-6">
        <CardSkeleton rows={3} />
        <CardSkeleton rows={2} />
        <CardSkeleton rows={4} />
        <CardSkeleton rows={3} />
      </div>
    </div>
  );
}
