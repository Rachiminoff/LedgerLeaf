import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ArrowRightLeft } from 'lucide-react';

interface TransferFundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTransfer: (fromPocketId: number, toPocketId: number, amount: number) => void;
    pockets: any[];
}

export default function TransferFundsModal({ isOpen, onClose, onTransfer, pockets }: TransferFundsModalProps) {
    const [fromPocketId, setFromPocketId] = useState<number | null>(null);
    const [toPocketId, setToPocketId] = useState<number | null>(null);
    const [amount, setAmount] = useState('');

    const fromPocket = pockets.find(p => p.id === fromPocketId);
    const maxAmount = fromPocket?.balance || 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (fromPocketId && toPocketId && amount) {
            onTransfer(fromPocketId, toPocketId, parseFloat(amount));
            setAmount('');
            setFromPocketId(null);
            setToPocketId(null);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const availablePockets = pockets.filter(p => !p.is_archived && p.id !== toPocketId);

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
                                    <ArrowRightLeft className="w-5 h-5 text-[#8B5CF6]" />
                                    Transfer Funds
                                </Dialog.Title>
                                <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#242424] transition-colors">
                                    <X className="w-5 h-5 text-[#9A9A9A]" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">From Pocket</label>
                                    <select
                                        value={fromPocketId || ''}
                                        onChange={(e) => setFromPocketId(Number(e.target.value))}
                                        className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none"
                                        required
                                    >
                                        <option value="">Select source pocket...</option>
                                        {pockets.filter(p => !p.is_archived).map((pocket) => (
                                            <option key={pocket.id} value={pocket.id}>
                                                {pocket.icon} {pocket.name} ({formatCurrency(pocket.balance)})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-center">
                                    <div className="w-10 h-10 rounded-full bg-[#171717] border border-[#242424] flex items-center justify-center">
                                        <ArrowRightLeft className="w-5 h-5 text-[#8B5CF6]" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">To Pocket</label>
                                    <select
                                        value={toPocketId || ''}
                                        onChange={(e) => setToPocketId(Number(e.target.value))}
                                        className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:border-[#5CB85C] focus:outline-none"
                                        required
                                    >
                                        <option value="">Select destination pocket...</option>
                                        {pockets
                                            .filter(p => !p.is_archived && p.id !== fromPocketId)
                                            .map((pocket) => (
                                                <option key={pocket.id} value={pocket.id}>
                                                    {pocket.icon} {pocket.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">
                                        Amount (Max: {formatCurrency(maxAmount)})
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max={maxAmount}
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
                                        disabled={!fromPocketId || !toPocketId || !amount || parseFloat(amount) > maxAmount}
                                        className="flex-1 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Transfer Funds
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