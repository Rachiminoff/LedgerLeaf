import PocketCard from './PocketCard';

interface PocketListProps {
    pockets: any[];
    onEdit: (pocket: any) => void;
    onArchive: (id: number) => void;
    onDelete: (id: number) => void;
    onAllocate: (id: number) => void;
    onRefund?: (id: number, amount: number) => void;
    onSaveEdit?: (id: number, data: { name: string; allocated: number; description?: string }) => void;
}

export default function PocketList({ 
    pockets, 
    onEdit, 
    onArchive, 
    onDelete, 
    onAllocate,
    onRefund,
    onSaveEdit 
}: PocketListProps) {
    if (pockets.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {pockets.map((pocket) => (
                <PocketCard
                    key={pocket.id}
                    pocket={pocket}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAllocate={onAllocate}
                    onRefund={onRefund}
                    onSaveEdit={onSaveEdit}
                />
            ))}
        </div>
    );
}