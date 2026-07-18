import { Eye, Pencil, Archive, Trash2, ChevronRight } from 'lucide-react';

interface ExpenseCardProps {
    expense: any;
    onView: (expense: any) => void;
    onEdit: (expense: any) => void;
    onArchive: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function ExpenseCard({ expense, onView, onEdit, onArchive, onDelete }: ExpenseCardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-PH', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-4 hover:border-[#5CB85C] transition-all">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#171717] flex items-center justify-center text-xl">
                        {expense.category?.icon || '📄'}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">{expense.description}</p>
                        <div className="flex items-center gap-2 text-xs text-[#9A9A9A]">
                            <span>{expense.category?.name}</span>
                            <span>•</span>
                            <span>{formatDate(expense.expense_date)}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-[#FF5A5A]">
                        {formatCurrency(expense.amount)}
                    </p>
                    <p className="text-xs text-[#9A9A9A]">
                        {expense.pocket?.icon} {expense.pocket?.name}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-[#242424]">
                <button
                    onClick={() => onView(expense)}
                    className="p-1.5 rounded hover:bg-[#242424] transition-colors"
                >
                    <Eye className="w-4 h-4 text-[#9A9A9A] hover:text-white" />
                </button>
                <button
                    onClick={() => onEdit(expense)}
                    className="p-1.5 rounded hover:bg-[#242424] transition-colors"
                >
                    <Pencil className="w-4 h-4 text-[#9A9A9A] hover:text-white" />
                </button>
                <button
                    onClick={() => onArchive(expense.id)}
                    className="p-1.5 rounded hover:bg-[#242424] transition-colors"
                >
                    <Archive className="w-4 h-4 text-[#9A9A9A] hover:text-white" />
                </button>
                <button
                    onClick={() => onDelete(expense.id)}
                    className="p-1.5 rounded hover:bg-[#242424] transition-colors"
                >
                    <Trash2 className="w-4 h-4 text-[#9A9A9A] hover:text-[#FF5A5A]" />
                </button>
                <button
                    onClick={() => onView(expense)}
                    className="p-1.5 rounded hover:bg-[#242424] transition-colors ml-auto"
                >
                    <ChevronRight className="w-4 h-4 text-[#9A9A9A] hover:text-white" />
                </button>
            </div>
        </div>
    );
}