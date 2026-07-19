import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    onWithdraw: (data: { amount: number; notes: string }) => void;
    goal: any;
    loading: boolean;
}

export default function WithdrawModal({
    isOpen,
    onClose,
    onWithdraw,
    goal,
    loading,
}: WithdrawModalProps) {
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setAmount('');
            setNotes('');
            setError(null);
        }
    }, [isOpen]);

    if (!goal) return null;

    const maxAmount = goal.current_amount || 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const parsedAmount = parseFloat(amount);

        if (!parsedAmount || parsedAmount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (parsedAmount > maxAmount) {
            setError(`Amount exceeds current saved amount of ${formatCurrency(maxAmount)}`);
            return;
        }

        onWithdraw({ amount: parsedAmount, notes });
        onClose();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const parsedAmount = parseFloat(amount) || 0;
    const remainingAfterWithdraw = goal.current_amount - parsedAmount;

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
                        <Dialog.Panel className="w-full max-w-md bg-[#111111] rounded-2xl shadow-xl border border-[#242424] overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-[#242424]">
                                <Dialog.Title className="text-lg font-semibold text-white">
                                    Withdraw from Savings
                                </Dialog.Title>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-lg hover:bg-[#242424] transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#9A9A9A]" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                {/* Preview Section */}
                                <div className="bg-[#171717] rounded-xl p-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#9A9A9A]">Goal</span>
                                        <span className="text-white">{goal.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#9A9A9A]">Current Saved</span>
                                        <span className="text-white">{formatCurrency(goal.current_amount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#9A9A9A]">Target</span>
                                        <span className="text-white">{formatCurrency(goal.target_amount)}</span>
                                    </div>
                                    {parsedAmount > 0 && (
                                        <div className="flex justify-between text-sm pt-2 border-t border-[#242424]">
                                            <span className="text-[#9A9A9A]">After Withdrawal</span>
                                            <span className="text-[#F59E0B]">{formatCurrency(remainingAfterWithdraw)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FF5A5A]/10 border border-[#FF5A5A]/30">
                                        <AlertCircle className="w-4 h-4 text-[#FF5A5A] flex-shrink-0" />
                                        <p className="text-sm text-[#FF5A5A]">{error}</p>
                                    </div>
                                )}

                                {/* Amount Input */}
                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">Amount *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max={maxAmount}
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:outline-none focus:border-[#5CB85C] transition-colors"
                                        placeholder="0.00"
                                        required
                                        disabled={loading}
                                    />
                                    <p className="text-xs text-[#9A9A9A] mt-1">
                                        Max: {formatCurrency(maxAmount)}
                                    </p>
                                </div>

                                {/* Notes Input */}
                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">Notes</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:outline-none focus:border-[#5CB85C] transition-colors resize-none"
                                        rows={2}
                                        placeholder="Optional notes about this withdrawal"
                                        disabled={loading}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4 border-t border-[#242424]">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 border border-[#242424] text-[#9A9A9A] rounded-lg hover:border-white transition-colors disabled:opacity-50"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !amount || parseFloat(amount) <= 0}
                                        className="flex-1 px-4 py-2 bg-[#F59E0B] text-black rounded-lg hover:bg-[#E5A800] transition-colors disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            'Withdraw'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}