import PocketCard from './PocketCard';

interface PocketListProps {
    pockets: any[];
    onEdit: (pocket: any) => void;
    onArchive: (id: number) => void;
    onDelete: (id: number) => void;
    onAllocate: (id: number) => void;
}

export default function PocketList({ pockets, onEdit, onArchive, onDelete, onAllocate }: PocketListProps) {
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
                    onArchive={onArchive}
                    onDelete={onDelete}
                    onAllocate={onAllocate}
                />
            ))}
        </div>
    );
}