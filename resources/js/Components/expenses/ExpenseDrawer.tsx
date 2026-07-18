import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Eye, Pencil, Archive, Trash2 } from 'lucide-react';

interface ExpenseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    expense: any;
    onEdit: (expense: any) => void;
}

export default function ExpenseDrawer({ isOpen, onClose, expense, onEdit }: ExpenseDrawerProps) {
    if (!expense) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-PH', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-300"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-300"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-[#111111] shadow-xl border-l border-[#242424]">
                                        <div className="flex items-center justify-between p-4 border-b border-[#242424]">
                                            <h2 className="text-lg font-semibold text-white">Expense Details</h2>
                                            <button
                                                onClick={onClose}
                                                className="p-1 rounded-lg hover:bg-[#242424] transition-colors"
                                            >
                                                <X className="w-5 h-5 text-[#9A9A9A]" />
                                            </button>
                                        </div>

                                        <div className="flex-1 p-6 space-y-6">
                                            {/* Category & Amount */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-4xl">{expense.category?.icon || '📄'}</span>
                                                    <div>
                                                        <p className="text-sm text-[#9A9A9A]">Category</p>
                                                        <p className="text-white font-medium">{expense.category?.name || 'Uncategorized'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-[#9A9A9A]">Amount</p>
                                                    <p className="text-xl font-bold text-[#FF5A5A]">
                                                        {formatCurrency(expense.amount)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <p className="text-sm text-[#9A9A9A]">Description</p>
                                                <p className="text-white">{expense.description}</p>
                                            </div>

                                            {/* Merchant */}
                                            {expense.merchant && (
                                                <div>
                                                    <p className="text-sm text-[#9A9A9A]">Merchant</p>
                                                    <p className="text-white">{expense.merchant}</p>
                                                </div>
                                            )}

                                            {/* Pocket */}
                                            {expense.pocket && (
                                                <div>
                                                    <p className="text-sm text-[#9A9A9A]">Pocket</p>
                                                    <p className="text-white">{expense.pocket.icon} {expense.pocket.name}</p>
                                                </div>
                                            )}

                                            {/* Date */}
                                            <div>
                                                <p className="text-sm text-[#9A9A9A]">Date</p>
                                                <p className="text-white">{formatDate(expense.expense_date)}</p>
                                            </div>

                                            {/* Payment Method */}
                                            {expense.payment_method && (
                                                <div>
                                                    <p className="text-sm text-[#9A9A9A]">Payment Method</p>
                                                    <p className="text-white">{expense.payment_method}</p>
                                                </div>
                                            )}

                                            {/* Notes */}
                                            {expense.notes && (
                                                <div>
                                                    <p className="text-sm text-[#9A9A9A]">Notes</p>
                                                    <p className="text-white whitespace-pre-wrap">{expense.notes}</p>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex gap-3 pt-4 border-t border-[#242424]">
                                                <button
                                                    onClick={() => onEdit(expense)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-[#5CB85C] text-white rounded-lg hover:bg-[#4CAF50] transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {}}
                                                    className="flex items-center gap-2 px-4 py-2 border border-[#242424] text-[#9A9A9A] rounded-lg hover:border-white transition-colors"
                                                >
                                                    <Archive className="w-4 h-4" />
                                                    Archive
                                                </button>
                                                <button
                                                    onClick={() => {}}
                                                    className="flex items-center gap-2 px-4 py-2 border border-[#FF5A5A]/30 text-[#FF5A5A] rounded-lg hover:bg-[#FF5A5A]/10 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}