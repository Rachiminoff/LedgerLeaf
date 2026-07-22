import { Fragment, useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, AlertCircle, Calendar } from 'lucide-react';
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
        notes: '',
    });
    const [selectedPocket, setSelectedPocket] = useState<any>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

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

    const getAvailableBalance = () => {
        if (!selectedPocket) return 0;
        return selectedPocket.allocated - selectedPocket.spent;
    };

    const getMaxAllowedAmount = () => {
        if (!selectedPocket) return 0;
        
        if (mode === 'edit' && expense) {
            const originalAmount = expense.amount || 0;
            const currentAvailable = getAvailableBalance();
            return originalAmount + currentAvailable;
        }
        
        return getAvailableBalance();
    };

    const handleAmountChange = (value: string) => {
        setError(null);
        setFormData(prev => ({ ...prev, amount: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        const amount = parseFloat(formData.amount);
        
        if (!amount || amount <= 0) {
            setError('Please enter a valid amount greater than 0');
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

        const available = getAvailableBalance();
        const maxAllowed = getMaxAllowedAmount();

        if (selectedPocket) {
            if (mode === 'create') {
                if (amount > available) {
                    setError(`Amount exceeds available balance. Available: ₱${available.toFixed(2)}`);
                    return;
                }
                if (available <= 0) {
                    setError(`This pocket has insufficient balance. Available: ₱${available.toFixed(2)}`);
                    return;
                }
            }
            
            if (mode === 'edit' && expense) {
                const originalAmount = expense.amount || 0;
                const increaseAmount = amount - originalAmount;
                const currentAvailable = getAvailableBalance();
                
                if (increaseAmount > 0 && increaseAmount > currentAvailable) {
                    setError(
                        `Cannot increase expense by ₱${increaseAmount.toFixed(2)}. ` +
                        `Only ₱${currentAvailable.toFixed(2)} available in this pocket.`
                    );
                    return;
                }
            }
        }

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

    const getPocketColor = () => {
        return selectedPocket?.color || '#5CB85C';
    };

    const wouldExceedBalance = () => {
        const amount = parseFloat(formData.amount);
        if (!amount || amount <= 0 || !selectedPocket) return false;
        
        if (mode === 'create') {
            return amount > getAvailableBalance();
        }
        
        if (mode === 'edit' && expense) {
            const originalAmount = expense.amount || 0;
            const increaseAmount = amount - originalAmount;
            return increaseAmount > 0 && increaseAmount > getAvailableBalance();
        }
        
        return false;
    };

    const isAmountValid = () => {
        const amount = parseFloat(formData.amount);
        if (!amount || amount <= 0) return false;
        return !wouldExceedBalance();
    };

    // Payment method options with icons
    const paymentMethods = [
        { value: 'Cash', icon: 'mdi:cash' },
        { value: 'Credit Card', icon: 'mdi:credit-card' },
        { value: 'Debit Card', icon: 'mdi:credit-card-outline' },
        { value: 'Bank Transfer', icon: 'mdi:bank-transfer' },
        { value: 'Mobile Payment', icon: 'mdi:cellphone' },
        { value: 'GCash', icon: 'mdi:cellphone' },
        { value: 'PayPal', icon: 'mdi:paypal' },
    ];

    // Date helper functions
    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getMinDate = () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        return date.toISOString().split('T')[0];
    };

    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getDayOfWeek = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-PH', {
            weekday: 'short',
        });
    };

    const handleDateChange = (value: string) => {
        setFormData(prev => ({ ...prev, expense_date: value }));
        setShowDatePicker(false);
        setError(null);
    };

    const isToday = (dateString: string) => {
        return dateString === getTodayDate();
    };

    const isPastDate = (dateString: string) => {
        if (!dateString) return false;
        return dateString < getTodayDate();
    };

    const isFutureDate = (dateString: string) => {
        if (!dateString) return false;
        return dateString > getTodayDate();
    };

    // Quick date buttons
    const quickDates = [
        { label: 'Today', value: getTodayDate() },
        { label: 'Yesterday', value: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
        { label: 'This Week', value: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0] },
    ];

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
                                        <label className="block text-sm text-[#9A9A9A] mb-1">
                                            Pocket <span className="text-[#FF5A5A]">*</span>
                                        </label>
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
                                                        {isOverBudget && ' Over budget'}
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
                                                        <div className="text-xs text-[#9A9A9A]">
                                                            Spent: {formatCurrency(selectedPocket.spent)}
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
                                        <label className="block text-sm text-[#9A9A9A] mb-1">
                                            Description <span className="text-[#FF5A5A]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none transition-colors"
                                            placeholder="Enter expense description"
                                            required
                                        />
                                    </div>

                                    {/* Amount with validation */}
                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">
                                            Amount <span className="text-[#FF5A5A]">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]">₱</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                value={formData.amount}
                                                onChange={(e) => handleAmountChange(e.target.value)}
                                                className={`w-full pl-8 pr-3 py-2 bg-[#171717] border rounded-lg text-white focus:outline-none transition-colors ${
                                                    wouldExceedBalance() && formData.amount
                                                        ? 'border-[#FF5A5A] focus:border-[#FF5A5A]'
                                                        : 'border-[#242424] focus:border-[#5CB85C]'
                                                }`}
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                        {selectedPocket && (
                                            <div className="mt-1 flex items-center justify-between text-xs">
                                                <span className="text-[#9A9A9A]">
                                                    Available: <span style={{ color: getPocketColor() }}>
                                                        {formatCurrency(getAvailableBalance())}
                                                    </span>
                                                </span>
                                                {mode === 'edit' && expense && (
                                                    <span className="text-[#9A9A9A]">
                                                        Original: {formatCurrency(expense.amount)}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        {wouldExceedBalance() && selectedPocket && (
                                            <div className="mt-1 text-xs text-[#FF5A5A]">
                                                Amount exceeds available balance of {formatCurrency(getAvailableBalance())}
                                            </div>
                                        )}
                                        {mode === 'edit' && expense && selectedPocket && (
                                            <div className="mt-1 text-xs text-[#9A9A9A]">
                                                {parseFloat(formData.amount) > expense.amount 
                                                    ? `Increasing by ₱${(parseFloat(formData.amount) - expense.amount).toFixed(2)}`
                                                    : parseFloat(formData.amount) < expense.amount
                                                    ? `Decreasing by ₱${(expense.amount - parseFloat(formData.amount)).toFixed(2)}`
                                                    : 'No change'}
                                            </div>
                                        )}
                                    </div>

                                    {/* Date - Improved with custom styling */}
                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">
                                            Date <span className="text-[#FF5A5A]">*</span>
                                        </label>
                                        
                                        {/* Date Input Container */}
                                        <div className="relative">
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]" />
                                                <input
                                                    type="date"
                                                    value={formData.expense_date}
                                                    onChange={(e) => handleDateChange(e.target.value)}
                                                    className="w-full pl-10 pr-3 py-2.5 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-datetime-edit]:text-white [&::-webkit-datetime-edit-day-field]:text-white [&::-webkit-datetime-edit-month-field]:text-white [&::-webkit-datetime-edit-year-field]:text-white"
                                                    min={getMinDate()}
                                                    max={getMaxDate()}
                                                    required
                                                />
                                            </div>
                                            
                                            {/* Date Display Badge */}
                                            {formData.expense_date && (
                                                <div className="mt-2 flex items-center gap-2 flex-wrap">
                                                    <span 
                                                        className={`text-xs px-2.5 py-1 rounded-full ${
                                                            isToday(formData.expense_date)
                                                                ? 'bg-[#5CB85C]/20 text-[#5CB85C] border border-[#5CB85C]/30'
                                                                : isPastDate(formData.expense_date)
                                                                ? 'bg-[#9A9A9A]/20 text-[#9A9A9A] border border-[#9A9A9A]/30'
                                                                : 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30'
                                                        }`}
                                                    >
                                                        {isToday(formData.expense_date) && 'Today'}
                                                        {isPastDate(formData.expense_date) && getDayOfWeek(formData.expense_date)}
                                                        {isFutureDate(formData.expense_date) && 'Future'}
                                                    </span>
                                                    <span className="text-sm text-white">
                                                        {formatDisplayDate(formData.expense_date)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Quick Date Buttons */}
                                        <div className="mt-2 flex gap-2 flex-wrap">
                                            {quickDates.map((date) => (
                                                <button
                                                    key={date.label}
                                                    type="button"
                                                    onClick={() => handleDateChange(date.value)}
                                                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                                                        formData.expense_date === date.value
                                                            ? 'bg-[#5CB85C] text-black'
                                                            : 'bg-[#1A1A1A] text-[#9A9A9A] hover:text-white border border-[#242424] hover:border-[#5CB85C]'
                                                    }`}
                                                >
                                                    {date.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Payment Method with Icons */}
                                    <div>
                                        <label className="block text-sm text-[#9A9A9A] mb-1">Payment Method</label>
                                        <select
                                            value={formData.payment_method}
                                            onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value }))}
                                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none transition-colors"
                                        >
                                            <option value="">Select payment method</option>
                                            {paymentMethods.map((method) => (
                                                <option key={method.value} value={method.value}>
                                                    {method.value}
                                                </option>
                                            ))}
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
                                            placeholder="Optional notes"
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
                                            disabled={!isAmountValid() || !formData.pocket_id || !formData.description.trim()}
                                            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                                                !isAmountValid() || !formData.pocket_id || !formData.description.trim()
                                                    ? 'bg-[#242424] text-[#9A9A9A] cursor-not-allowed'
                                                    : 'bg-[#5CB85C] text-white hover:bg-[#4CAF50]'
                                            }`}
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