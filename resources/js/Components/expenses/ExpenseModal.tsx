// resources/js/Components/expenses/ExpenseModal.tsx
import { Fragment, useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, AlertCircle } from 'lucide-react';
import { Icon } from '@iconify/react';

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    mode: 'create' | 'edit';
    expense: any;
    pockets?: any[];
    onExpenseAdd?: (data: any) => void;
}

export default function ExpenseModal({ 
    isOpen, 
    onClose, 
    onSave, 
    mode, 
    expense,
    pockets = [],
    onExpenseAdd 
}: ExpenseModalProps) {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        pocket_id: '',
        expense_date: '',
        payment_method: '',
        merchant: '',
        notes: '',
    });
    const [selectedPocket, setSelectedPocket] = useState<any>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setIsInitialized(false);
            setError(null);
            return;
        }

        if (!isInitialized) {
            if (expense && mode === 'edit') {
                setFormData({
                    description: expense.description || '',
                    amount: expense.amount?.toString() || '',
                    pocket_id: expense.pocket_id?.toString() || '',
                    expense_date: expense.expense_date || '',
                    payment_method: expense.payment_method || '',
                    merchant: expense.merchant || '',
                    notes: expense.notes || '',
                });
                if (expense.pocket_id) {
                    const pocket = pockets.find(p => p.id === expense.pocket_id);
                    setSelectedPocket(pocket || null);
                }
            } else if (mode === 'create') {
                setFormData({
                    description: '',
                    amount: '',
                    pocket_id: '',
                    expense_date: new Date().toISOString().split('T')[0],
                    payment_method: '',
                    merchant: '',
                    notes: '',
                });
                setSelectedPocket(null);
            }
            setIsInitialized(true);
        }
    }, [expense, mode, isOpen, isInitialized, pockets]);

    useEffect(() => {
        if (!isOpen) {
            setIsInitialized(false);
        }
    }, [isOpen]);

    const handlePocketSelect = (pocketId: string) => {
        const pocket = pockets.find(p => p.id === parseInt(pocketId));
        setSelectedPocket(pocket || null);
        setFormData(prev => ({ ...prev, pocket_id: pocketId }));
        setError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        const amount = parseFloat(formData.amount);
        
        if (!amount || amount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (!formData.description.trim()) {
            setError('Please enter a description');
            return;
        }

        if (!formData.pocket_id) {
            setError('Please select a pocket');
            return;
        }
        
        if (selectedPocket) {
            const available = selectedPocket.allocated - selectedPocket.spent;
            // For edit mode, check if amount is increasing
            if (mode === 'edit' && expense) {
                const originalAmount = expense.amount || 0;
                const increaseAmount = amount - originalAmount;
                if (increaseAmount > 0 && increaseAmount > available) {
                    setError(`Insufficient balance! Available: ₱${available.toFixed(2)}`);
                    return;
                }
            } else if (mode === 'create' && amount > available) {
                setError(`Insufficient balance! Available: ₱${available.toFixed(2)}`);
                return;
            }
        }

        // ✅ For edit mode, include the expense ID
        if (mode === 'edit' && expense) {
            onSave({
                id: expense.id,
                ...formData,
                amount: amount,
                pocket_id: formData.pocket_id ? parseInt(formData.pocket_id) : null,
            });
        } else {
            onSave({
                ...formData,
                amount: amount,
                pocket_id: formData.pocket_id ? parseInt(formData.pocket_id) : null,
            });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const getAvailableBalance = () => {
        if (!selectedPocket) return 0;
        return selectedPocket.allocated - selectedPocket.spent;
    };

    const getPocketColor = () => {
        return selectedPocket?.color || '#5CB85C';
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

                            {/* Scrollable Form Body */}
                            <div className="flex-1 overflow-y-auto p-4 modal-scrollbar">
                                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                                    {/* Error Message */}
                                    {error && (
                                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                            <p className="text-sm text-red-500">{error}</p>
                                        </div>
                                    )}

                                    {/* Pocket Dropdown */}
                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">Pocket *</label>
                                        <select
                                            value={formData.pocket_id}
                                            onChange={(e) => handlePocketSelect(e.target.value)}
                                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none transition-colors"
                                            required
                                        >
                                            <option value="">Select pocket</option>
                                            {pockets.map((pocket) => {
                                                const available = pocket.allocated - pocket.spent;
                                                const isOverBudget = available < 0;
                                                return (
                                                    <option 
                                                        key={pocket.id} 
                                                        value={pocket.id}
                                                        style={{ 
                                                            color: isOverBudget ? '#FF5A5A' : 'white',
                                                            backgroundColor: isOverBudget ? '#FF5A5A20' : 'transparent'
                                                        }}
                                                    >
                                                        {pocket.icon && <Icon icon={pocket.icon} className="inline w-4 h-4 mr-1" />}
                                                        {pocket.name} (Available: {formatCurrency(available)})
                                                        {isOverBudget && ' ⚠️ Over budget'}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        
                                        {/* Pocket Info Card */}
                                        {selectedPocket && (
                                            <div 
                                                className="mt-2 p-3 rounded-lg border"
                                                style={{ 
                                                    backgroundColor: `${selectedPocket.color}15`,
                                                    borderColor: selectedPocket.color
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-sm font-medium text-white">
                                                            {selectedPocket.icon && <Icon icon={selectedPocket.icon} className="inline w-4 h-4 mr-1" />}
                                                            {selectedPocket.name}
                                                        </span>
                                                        <div className="text-xs text-[#9A9A9A]">
                                                            Allocated: {formatCurrency(selectedPocket.allocated)}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-medium" style={{ color: getPocketColor() }}>
                                                            {formatCurrency(getAvailableBalance())}
                                                        </div>
                                                        <div className="text-xs text-[#9A9A9A]">Available</div>
                                                    </div>
                                                </div>
                                                {/* Progress Bar */}
                                                {selectedPocket.allocated > 0 && (
                                                    <div className="mt-2 w-full h-1.5 bg-[#242424] rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-300"
                                                            style={{
                                                                width: `${Math.min((selectedPocket.spent / selectedPocket.allocated) * 100, 100)}%`,
                                                                backgroundColor: getAvailableBalance() < 0 ? '#FF5A5A' : selectedPocket.color,
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">Description *</label>
                                        <input
                                            type="text"
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>

                                    {/* Amount */}
                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">Amount *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={formData.amount}
                                            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none transition-colors"
                                            required
                                        />
                                        {selectedPocket && (
                                            <div className="mt-1 text-xs text-[#9A9A9A]">
                                                Available balance: <span style={{ color: getPocketColor() }}>
                                                    {formatCurrency(getAvailableBalance())}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">Date *</label>
                                        <input
                                            type="date"
                                            value={formData.expense_date}
                                            onChange={(e) => setFormData(prev => ({ ...prev, expense_date: e.target.value }))}
                                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>

                                    {/* Merchant */}
                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">Merchant</label>
                                        <input
                                            type="text"
                                            value={formData.merchant}
                                            onChange={(e) => setFormData(prev => ({ ...prev, merchant: e.target.value }))}
                                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none transition-colors"
                                        />
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">Payment Method</label>
                                        <select
                                            value={formData.payment_method}
                                            onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value }))}
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

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">Notes</label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
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
                                            disabled={selectedPocket && getAvailableBalance() <= 0 && parseFloat(formData.amount) > 0}
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