import { Fragment, useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    mode: 'create' | 'edit';
    expense: any;
}

export default function ExpenseModal({ isOpen, onClose, onSave, mode, expense }: ExpenseModalProps) {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category_id: '',
        pocket_id: '',
        expense_date: '',
        payment_method: '',
        merchant: '',
        notes: '',
    });
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (expense && mode === 'edit') {
            setFormData({
                description: expense.description || '',
                amount: expense.amount?.toString() || '',
                category_id: expense.category_id?.toString() || '',
                pocket_id: expense.pocket_id?.toString() || '',
                expense_date: expense.expense_date || '',
                payment_method: expense.payment_method || '',
                merchant: expense.merchant || '',
                notes: expense.notes || '',
            });
        } else {
            setFormData({
                description: '',
                amount: '',
                category_id: '',
                pocket_id: '',
                expense_date: new Date().toISOString().split('T')[0],
                payment_method: '',
                merchant: '',
                notes: '',
            });
        }
    }, [expense, mode, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            amount: parseFloat(formData.amount),
        });
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-lg bg-[#111111] rounded-2xl shadow-xl border border-[#242424] max-h-[85vh] flex flex-col overflow-hidden">
                            {/* Fixed Header */}
                            <div className="flex items-center justify-between p-4 border-b border-[#242424] flex-shrink-0">
                                <Dialog.Title className="text-lg font-semibold text-white">
                                    {mode === 'create' ? 'Add Expense' : 'Edit Expense'}
                                </Dialog.Title>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-lg hover:bg-[#242424] transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#9A9A9A]" />
                                </button>
                            </div>

                            {/* Scrollable Form Body with Custom Scrollbar */}
                            <div className="flex-1 overflow-y-auto p-4 modal-scrollbar">
                                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">Description *</label>
                                        <input
                                            type="text"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">Amount *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">Date *</label>
                                        <input
                                            type="date"
                                            value={formData.expense_date}
                                            onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">Category</label>
                                        <select
                                            value={formData.category_id}
                                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none transition-colors"
                                        >
                                            <option value="">Select category</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">Pocket</label>
                                        <select
                                            value={formData.pocket_id}
                                            onChange={(e) => setFormData({ ...formData, pocket_id: e.target.value })}
                                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none transition-colors"
                                        >
                                            <option value="">Select pocket</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">Merchant</label>
                                        <input
                                            type="text"
                                            value={formData.merchant}
                                            onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">Payment Method</label>
                                        <select
                                            value={formData.payment_method}
                                            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none transition-colors"
                                        >
                                            <option value="">Select method</option>
                                            <option value="Cash">Cash</option>
                                            <option value="Credit Card">Credit Card</option>
                                            <option value="Debit Card">Debit Card</option>
                                            <option value="Bank Transfer">Bank Transfer</option>
                                            <option value="Mobile Payment">Mobile Payment</option>
                                            <option value="GCash">GCash</option>
                                            <option value="PayPal">PayPal</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">Notes</label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none transition-colors resize-none"
                                            rows={3}
                                        />
                                    </div>

                                    {/* Fixed Footer */}
                                    <div className="sticky bottom-0 bg-[#111111] -mx-4 px-4 py-3 border-t border-[#242424] flex gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 px-4 py-2 border border-[#242424] text-[#9A9A9A] rounded-lg hover:border-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-[#5CB85C] text-white rounded-lg hover:bg-[#4CAF50] transition-colors"
                                        >
                                            {mode === 'create' ? 'Add Expense' : 'Update Expense'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}