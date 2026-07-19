import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-[#242424]",
                className
            )}
            {...props}
        />
    );
}

export { SkeletonCard } from './skeleton-card';

export function SkeletonChart({ className }: { className?: string }) {
    return (
        <div className={cn("bg-[#111111] border border-[#242424] rounded-xl p-6", className)}>
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="space-y-3">
                <Skeleton className="h-40 w-full" />
                <div className="flex justify-center gap-4">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
        </div>
    );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-4">
            <div className="space-y-3">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        {Array.from({ length: columns }).map((_, j) => (
                            <Skeleton key={j} className="h-4 flex-1" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}