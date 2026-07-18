// resources/js/Components/ui/skeleton-card.tsx
import { Skeleton } from './skeleton';

interface SkeletonCardProps {
    count?: number;
}

export function SkeletonCard({ count = 1 }: SkeletonCardProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-[#111111] border border-[#242424] rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16 mt-1" />
                        </div>
                    </div>
                    <Skeleton className="h-2 w-full" />
                    <div className="flex justify-between mt-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            ))}
        </>
    );
}