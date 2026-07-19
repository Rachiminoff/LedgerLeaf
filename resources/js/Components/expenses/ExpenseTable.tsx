import { Eye, Pencil, Archive, Trash2, MoreHorizontal } from 'lucide-react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

interface ExpenseTableProps {
    expenses: any[];
    onView: (expense: any) => void;
    onEdit: (expense: any) => void;
    onArchive: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function ExpenseTable({ expenses, onView, onEdit, onArchive, onDelete }: ExpenseTableProps) {
    const [sortField, setSortField] = useState<string>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (date: string) => {
        if (!date) return 'No date';
        try {
            return new Date(date).toLocaleDateString('en-PH', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch {
            return 'Invalid date';
        }
    };

    const getPocketDisplay = (pocket: any) => {
        if (!pocket) return 'No pocket';
        if (pocket.icon) {
            return (
                <span className="flex items-center gap-1.5">
                    <Icon icon={pocket.icon} className="w-4 h-4" />
                    <span>{pocket.name}</span>
                </span>
            );
        }
        return pocket.name || 'No pocket';
    };

    const handleArchive = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (onArchive) {
            onArchive(id);
        }
    };

    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(id);
        }
    };

    if (expenses.length === 0) {
        return (
            <div className="bg-[#111111] border border-[#242424] rounded-xl p-12 text-center">
                <div className="text-[#9A9A9A] text-sm">No expenses found</div>
            </div>
        );
    }

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#242424]">
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">
                                Pocket
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#242424]">
                        {expenses.map((expense) => (
                            <tr 
                                key={expense.id} 
                                className="hover:bg-[#171717] transition-colors cursor-pointer"
                                onClick={() => onView(expense)}
                            >
                                <td className="px-4 py-3">
                                    <span className="text-sm text-white">{expense.description || 'No description'}</span>
                                    {expense.merchant && (
                                        <span className="text-xs text-[#9A9A9A] block">{expense.merchant}</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-sm text-[#9A9A9A]">
                                        {getPocketDisplay(expense.pocket)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <span className="text-sm font-medium text-[#FF5A5A]">
                                        {formatCurrency(expense.amount || 0)}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-sm text-[#9A9A9A]">
                                        {formatDate(expense.expense_date)}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onView(expense); }}
                                            className="p-1 rounded hover:bg-[#242424] transition-colors"
                                            title="View"
                                        >
                                            <Eye className="w-4 h-4 text-[#9A9A9A] hover:text-white" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onEdit(expense); }}
                                            className="p-1 rounded hover:bg-[#242424] transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4 text-[#9A9A9A] hover:text-white" />
                                        </button>
                                        <button
                                            onClick={(e) => handleArchive(expense.id, e)}
                                            className="p-1 rounded hover:bg-[#242424] transition-colors"
                                            title="Archive"
                                        >
                                            <Archive className="w-4 h-4 text-[#9A9A9A] hover:text-white" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(expense.id, e)}
                                            className="p-1 rounded hover:bg-[#242424] transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4 text-[#9A9A9A] hover:text-[#FF5A5A]" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}