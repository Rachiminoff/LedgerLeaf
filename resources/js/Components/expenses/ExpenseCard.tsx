import { useState } from 'react';
import { Eye, Pencil, Archive, Trash2, MoreVertical, ChevronRight } from 'lucide-react';

interface ExpenseCardProps {
    expense: any;
    onView: (expense: any) => void;
    onEdit: (expense: any) => void;
    onArchive: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function ExpenseCard({ expense, onView, onEdit, onArchive, onDelete }: ExpenseCardProps) {
    const [showMenu, setShowMenu] = useState(false);

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
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-4 transition-all hover:border-[#5CB85C] relative">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-[#171717] flex items-center justify-center text-xl flex-shrink-0">
                        {expense.category?.icon || '📄'}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">{expense.description}</p>
                        <div className="flex items-center gap-2 text-xs text-[#9A9A9A]">
                            <span className="truncate">{expense.category?.name}</span>
                            <span>•</span>
                            <span className="whitespace-nowrap">{formatDate(expense.expense_date)}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-sm font-medium text-[#FF5A5A]">
                        {formatCurrency(expense.amount)}
                    </p>
                    <p className="text-xs text-[#9A9A9A]">
                        {expense.pocket?.icon} {expense.pocket?.name}
                    </p>
                </div>
            </div>

            {/* Actions - Dropdown Menu */}
            <div className="flex items-center justify-end mt-3 pt-3 border-t border-[#242424]">
                <button
                    onClick={() => onView(expense)}
                    className="flex items-center gap-1 text-xs text-[#9A9A9A] hover:text-white transition-colors mr-auto"
                >
                    <Eye className="w-3.5 h-3.5" />
                    View
                </button>
                
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1.5 rounded hover:bg-[#242424] transition-colors"
                        aria-label="More options"
                    >
                        <MoreVertical className="w-4 h-4 text-[#9A9A9A]" />
                    </button>
                    
                    {showMenu && (
                        <>
                            <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="absolute right-0 mt-1 w-48 bg-[#171717] border border-[#242424] rounded-lg shadow-xl z-20 py-1">
                                <button
                                    onClick={() => {
                                        onEdit(expense);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-[#9A9A9A] hover:text-white hover:bg-[#242424] transition-colors flex items-center gap-2"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        onArchive(expense.id);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-[#9A9A9A] hover:text-white hover:bg-[#242424] transition-colors flex items-center gap-2"
                                >
                                    <Archive className="w-3.5 h-3.5" />
                                    Archive
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete(expense.id);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-[#FF5A5A] hover:bg-[#242424] transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}