import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, TrendingUp } from 'lucide-react';

interface AllocateFundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAllocate: (pocketId: number, amount: number) => void;
    pockets: any[];
    selectedPocketId: number | null;
    safeBalance: number;
}

export default function AllocateFundsModal({
    isOpen,
    onClose,
    onAllocate,
    pockets,
    selectedPocketId,
    safeBalance,
}: AllocateFundsModalProps) {
    const [pocketId, setPocketId] = useState<number | null>(selectedPocketId);
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pocketId && amount) {
            onAllocate(pocketId, parseFloat(amount));
            setAmount('');
            setPocketId(null);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount);
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
                        <Dialog.Panel className="w-full max-w-md bg-[#111111] rounded-2xl shadow-xl border border-[#242424]">
                            <div className="flex items-center justify-between p-4 border-b border-[#242424]">
                                <Dialog.Title className="text-lg font-semibold text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-[#5CB85C]" />
                                    Allocate Funds
                                </Dialog.Title>
                                <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#242424] transition-colors">
                                    <X className="w-5 h-5 text-[#9A9A9A]" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">Safe Balance</label>
                                    <p className="text-lg font-bold text-white">{formatCurrency(safeBalance)}</p>
                                </div>

                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">Select Pocket</label>
                                    <select
                                        value={pocketId || ''}
                                        onChange={(e) => setPocketId(Number(e.target.value))}
                                        className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none"
                                        required
                                    >
                                        <option value="">Select a pocket...</option>
                                        {pockets.filter(p => !p.is_archived).map((pocket) => (
                                            <option key={pocket.id} value={pocket.id}>
                                                {pocket.icon} {pocket.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">Amount to Allocate</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max={safeBalance}
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-[#242424]">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 border border-[#242424] text-[#9A9A9A] rounded-lg hover:border-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!pocketId || !amount || parseFloat(amount) > safeBalance}
                                        className="flex-1 px-4 py-2 bg-[#5CB85C] text-black rounded-lg hover:bg-[#6FCF70] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Allocate Funds
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