import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, TrendingUp, AlertCircle, Wallet, Info } from 'lucide-react';
import { Icon } from '@iconify/react';

interface AllocateFundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAllocate: (pocketId: number, amount: number) => void;
    pockets: any[];
    selectedPocketId: number | null;
    safeBalance: number;
    isLoading?: boolean;
}

export default function AllocateFundsModal({
    isOpen,
    onClose,
    onAllocate,
    pockets,
    selectedPocketId,
    safeBalance,
    isLoading = false,
}: AllocateFundsModalProps) {
    const [pocketId, setPocketId] = useState<number | null>(selectedPocketId);
    const [amount, setAmount] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [selectedPocket, setSelectedPocket] = useState<any>(null);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setPocketId(selectedPocketId);
            setAmount('');
            setError(null);
            if (selectedPocketId) {
                const pocket = pockets.find(p => p.id === selectedPocketId);
                setSelectedPocket(pocket || null);
            } else {
                setSelectedPocket(null);
            }
        }
    }, [isOpen, selectedPocketId, pockets]);

    // Update selected pocket when pocketId changes
    useEffect(() => {
        if (pocketId) {
            const pocket = pockets.find(p => p.id === pocketId);
            setSelectedPocket(pocket || null);
        } else {
            setSelectedPocket(null);
        }
        setError(null);
    }, [pocketId, pockets]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!pocketId) {
            setError('Please select a pocket.');
            return;
        }

        const amountNum = parseFloat(amount);
        if (!amount || isNaN(amountNum) || amountNum <= 0) {
            setError('Please enter a valid amount greater than 0.');
            return;
        }

        if (amountNum > safeBalance) {
            setError(`Amount exceeds safe balance of ${formatCurrency(safeBalance)}`);
            return;
        }

        onAllocate(pocketId, amountNum);
        setAmount('');
        setPocketId(null);
        setSelectedPocket(null);
        setError(null);
    };

    const handleAmountChange = (value: string) => {
        setAmount(value);
        setError(null);
        
        const amountNum = parseFloat(value);
        if (amountNum > 0 && amountNum > safeBalance) {
            setError(`Amount exceeds safe balance of ${formatCurrency(safeBalance)}`);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const getPocketIcon = (pocket: any) => {
        return pocket?.icon || 'mdi:folder';
    };

    const getPocketColor = (pocket: any) => {
        return pocket?.color || '#5CB85C';
    };

    const availablePockets = pockets.filter(p => !p.is_archived && p.balance >= 0);
    const amountNum = parseFloat(amount) || 0;
    const isAmountValid = amountNum > 0 && amountNum <= safeBalance;
    const canSubmit = pocketId && isAmountValid && !isLoading;

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
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
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
                        <Dialog.Panel className="w-full max-w-md bg-[#111111] rounded-2xl shadow-2xl border border-[#242424] overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-[#242424] bg-[#0D0D0D]">
                                <Dialog.Title className="text-lg font-semibold text-white flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-[#5CB85C]/10 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-[#5CB85C]" />
                                    </div>
                                    Allocate Funds
                                </Dialog.Title>
                                <button 
                                    onClick={onClose} 
                                    className="p-1 rounded-lg hover:bg-[#242424] transition-colors"
                                    disabled={isLoading}
                                >
                                    <X className="w-5 h-5 text-[#9A9A9A] hover:text-white transition-colors" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                {/* Safe Balance Display */}
                                <div className="p-3 rounded-lg bg-[#171717] border border-[#242424]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Wallet className="w-4 h-4 text-[#9A9A9A]" />
                                            <span className="text-sm text-[#9A9A9A]">Safe Balance</span>
                                        </div>
                                        <span className="text-sm font-bold text-[#5CB85C]">
                                            {formatCurrency(safeBalance)}
                                        </span>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                        <p className="text-sm text-red-500">{error}</p>
                                    </div>
                                )}

                                {/* Pocket Selection */}
                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1.5">
                                        Select Pocket <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={pocketId || ''}
                                            onChange={(e) => setPocketId(Number(e.target.value))}
                                            className="w-full px-3 py-2.5 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none focus:ring-1 focus:ring-[#5CB85C] transition-all appearance-none"
                                            required
                                            disabled={isLoading}
                                        >
                                            <option value="">Select a pocket...</option>
                                            {availablePockets.map((pocket) => (
                                                <option key={pocket.id} value={pocket.id}>
                                                    {pocket.icon} {pocket.name} ({formatCurrency(pocket.balance || 0)})
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    {availablePockets.length === 0 && (
                                        <p className="text-xs text-[#6B7280] mt-1">
                                            No active pockets available. Create a pocket first.
                                        </p>
                                    )}
                                </div>

                                {/* Selected Pocket Preview */}
                                {selectedPocket && (
                                    <div className="p-3 rounded-lg bg-[#171717] border border-[#242424] flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: `${getPocketColor(selectedPocket)}20` }}
                                        >
                                            <Icon
                                                icon={getPocketIcon(selectedPocket)}
                                                className="w-4 h-4"
                                                style={{ color: getPocketColor(selectedPocket) }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white truncate">{selectedPocket.name}</p>
                                            <p className="text-xs text-[#9A9A9A]">
                                                Balance: {formatCurrency(selectedPocket.balance || 0)}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Amount Input */}
                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1.5">
                                        Amount to Allocate <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] font-medium">
                                            ₱
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            max={safeBalance}
                                            value={amount}
                                            onChange={(e) => handleAmountChange(e.target.value)}
                                            className={`w-full pl-8 pr-3 py-2.5 bg-[#171717] border rounded-lg text-white focus:outline-none focus:ring-1 transition-all ${
                                                error && amount
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-[#242424] focus:border-[#5CB85C] focus:ring-[#5CB85C]'
                                            }`}
                                            placeholder="Enter amount"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between mt-1.5">
                                        <p className="text-xs text-[#6B7280]">
                                            Max: {formatCurrency(safeBalance)}
                                        </p>
                                        {amountNum > 0 && (
                                            <p className={`text-xs ${amountNum <= safeBalance ? 'text-[#5CB85C]' : 'text-red-500'}`}>
                                                {amountNum <= safeBalance ? 'Available' : 'Exceeds balance'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Action Buttons */}
                                {safeBalance > 0 && (
                                    <div className="flex gap-2">
                                        {[25, 50, 75, 100].map((percentage) => (
                                            <button
                                                key={percentage}
                                                type="button"
                                                onClick={() => {
                                                    const quickAmount = (safeBalance * percentage) / 100;
                                                    setAmount(quickAmount.toFixed(2));
                                                    setError(null);
                                                }}
                                                className="flex-1 px-2 py-1.5 text-xs bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] hover:border-[#5CB85C] hover:text-white transition-colors"
                                                disabled={isLoading}
                                            >
                                                {percentage}%
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-[#242424]">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2.5 border border-[#242424] text-[#9A9A9A] rounded-lg hover:border-white hover:text-white transition-colors"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!canSubmit}
                                        className={`flex-1 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                                            canSubmit
                                                ? 'bg-[#5CB85C] text-black hover:bg-[#6FCF70]'
                                                : 'bg-[#242424] text-[#9A9A9A] cursor-not-allowed'
                                        }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                                Allocating...
                                            </>
                                        ) : (
                                            <>
                                                <TrendingUp className="w-4 h-4" />
                                                Allocate Funds
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Info Note */}
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#171717] border border-[#242424]">
                                    <Info className="w-3 h-3 text-[#6B7280] flex-shrink-0" />
                                    <p className="text-[10px] text-[#6B7280]">
                                        Allocating funds will deduct from your safe balance and add to the selected pocket's balance.
                                    </p>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}