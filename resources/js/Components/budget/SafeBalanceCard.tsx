import { Wallet, TrendingUp } from 'lucide-react';

interface SafeBalanceCardProps {
    safeBalance: number;
    onAllocate: () => void;
}

export default function SafeBalanceCard({ safeBalance, onAllocate }: SafeBalanceCardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-[#9A9A9A] font-medium">Safe Balance</p>
                    <p className="text-3xl font-bold text-white mt-1 font-mono">
                        {formatCurrency(safeBalance)}
                    </p>
                    <p className="text-xs text-[#9A9A9A] mt-1">Available to allocate</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="p-3 rounded-xl bg-[#1A1A1A] border border-[#242424]">
                        <Wallet className="w-6 h-6 text-[#5CB85C]" />
                    </div>
                    <button
                        onClick={onAllocate}
                        className="flex items-center gap-1.5 text-xs text-[#5CB85C] hover:text-[#6FCF70] transition-colors"
                    >
                        <TrendingUp className="w-3.5 h-3.5" />
                        Allocate Funds
                    </button>
                </div>
            </div>
        </div>
    );
}