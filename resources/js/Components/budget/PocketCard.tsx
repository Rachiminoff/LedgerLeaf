import { Pencil, Archive, Trash2, TrendingUp, X } from 'lucide-react';
import { Icon } from '@iconify/react';
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface PocketCardProps {
    pocket: any;
    onEdit: (pocket: any) => void;
    onArchive: (id: number) => void;
    onDelete: (id: number) => void;
    onAllocate: (id: number) => void;
    onRefund?: (id: number, amount: number) => void;
}

export default function PocketCard({
    pocket,
    onEdit,
    onArchive,
    onDelete,
    onAllocate,
    onRefund,
}: PocketCardProps) {
    const [showActions, setShowActions] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalAction, setModalAction] = useState<'archive' | 'delete' | null>(null);

    const progress = pocket.progress || 0;
    const isOverBudget = progress > 100;
    const isNearLimit = progress > 80 && progress <= 100;

    const getStatusColor = () => {
        if (isOverBudget) return '#FF5A5A';
        if (isNearLimit) return '#F4B400';
        return '#5CB85C';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const getRefundableAmount = () => {
        return pocket.allocated - pocket.spent;
    };

    const handleAction = (action: 'archive' | 'delete') => {
        setModalAction(action);
        setShowConfirmModal(true);
    };

    const confirmAction = async () => {
        if (!modalAction) return;
        
        const refundAmount = getRefundableAmount();
        
        setIsProcessing(true);
        setShowConfirmModal(false);
        
        try {
            if (refundAmount > 0 && onRefund) {
                await onRefund(pocket.id, refundAmount);
            }
            
            if (modalAction === 'archive') {
                await onArchive(pocket.id);
            } else {
                await onDelete(pocket.id);
            }
        } catch (error) {
            console.error(`Failed to ${modalAction} pocket:`, error);
            alert(`Failed to ${modalAction} pocket. Please try again.`);
        } finally {
            setIsProcessing(false);
            setModalAction(null);
        }
    };

    return (
        <>
            <div
                className="relative"
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
            >
                <div className="bg-[#111111] border border-[#242424] rounded-xl p-4 hover:border-[#5CB85C] transition-all duration-300 hover:shadow-[0_0_30px_rgba(92,184,92,0.05)]">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${pocket.color}20` }}
                            >
                                <Icon
                                    icon={pocket.icon || 'mdi:folder'}
                                    className="w-5 h-5"
                                    style={{ color: pocket.color }}
                                />
                            </div>

                            <div className="min-w-0">
                                <h3 className="font-semibold text-white truncate">
                                    {pocket.name}
                                </h3>

                                <p className="text-xs text-[#9A9A9A] truncate">
                                    {pocket.description || 'No description'}
                                </p>
                            </div>
                        </div>

                        <div className="text-left sm:text-right">
                            <p className="text-sm font-semibold text-white">
                                {formatCurrency(pocket.allocated)}
                            </p>

                            <p className="text-xs text-[#9A9A9A]">
                                Spent: {formatCurrency(pocket.spent)}
                            </p>
                            
                            {getRefundableAmount() > 0 && (
                                <p className="text-xs text-[#5CB85C]">
                                    Refundable: {formatCurrency(getRefundableAmount())}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-[#9A9A9A] mb-1">
                            <span>
                                Used {Math.min(progress, 100).toFixed(0)}%
                            </span>

                            <span>
                                {formatCurrency(pocket.remaining)} remaining
                            </span>
                        </div>

                        <div className="w-full h-2 bg-[#242424] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${Math.min(progress, 100)}%`,
                                    backgroundColor: getStatusColor(),
                                }}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between">

                        <span
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                                backgroundColor: `${getStatusColor()}20`,
                                color: getStatusColor(),
                            }}
                        >
                            {isOverBudget
                                ? 'Over Budget'
                                : isNearLimit
                                ? 'Near Limit'
                                : 'Healthy'}
                        </span>

                        {/* Mobile Actions */}
                        <div className="flex md:hidden items-center gap-1">
                            <button
                                onClick={() => onAllocate(pocket.id)}
                                className="p-2 rounded-lg hover:bg-[#242424] transition-colors"
                                disabled={isProcessing}
                            >
                                <TrendingUp className="w-4 h-4 text-[#5CB85C]" />
                            </button>

                            <button
                                onClick={() => onEdit(pocket)}
                                className="p-2 rounded-lg hover:bg-[#242424] transition-colors"
                                disabled={isProcessing}
                            >
                                <Pencil className="w-4 h-4 text-[#9A9A9A]" />
                            </button>

                            <button
                                onClick={() => handleAction('archive')}
                                className="p-2 rounded-lg hover:bg-[#242424] transition-colors"
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <div className="w-4 h-4 border-2 border-[#9A9A9A] border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Archive className="w-4 h-4 text-[#9A9A9A]" />
                                )}
                            </button>

                            <button
                                onClick={() => handleAction('delete')}
                                className="p-2 rounded-lg hover:bg-[#242424] transition-colors"
                                disabled={isProcessing}
                            >
                                <Trash2 className="w-4 h-4 text-[#FF5A5A]" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop Hover Actions */}
                <div
                    className={`hidden md:flex absolute top-3 right-3 z-20 items-center gap-1 bg-[#111111] border border-[#242424] rounded-lg p-1 shadow-xl transition-all duration-200 ease-out ${
                        showActions
                            ? 'opacity-100 translate-y-0 pointer-events-auto'
                            : 'opacity-0 -translate-y-1 pointer-events-none'
                    }`}
                >
                    <button
                        onClick={() => onAllocate(pocket.id)}
                        className="p-2 rounded-md hover:bg-[#242424] transition-colors"
                        title="Allocate Funds"
                        disabled={isProcessing}
                    >
                        <TrendingUp className="w-4 h-4 text-[#5CB85C]" />
                    </button>

                    <button
                        onClick={() => onEdit(pocket)}
                        className="p-2 rounded-md hover:bg-[#242424] transition-colors"
                        title="Edit"
                        disabled={isProcessing}
                    >
                        <Pencil className="w-4 h-4 text-[#9A9A9A] hover:text-white" />
                    </button>

                    <button
                        onClick={() => handleAction('archive')}
                        className="p-2 rounded-md hover:bg-[#242424] transition-colors"
                        title={getRefundableAmount() > 0 ? `Archive & Refund ${formatCurrency(getRefundableAmount())}` : 'Archive'}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <div className="w-4 h-4 border-2 border-[#9A9A9A] border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Archive className="w-4 h-4 text-[#9A9A9A] hover:text-white" />
                        )}
                    </button>

                    <button
                        onClick={() => handleAction('delete')}
                        className="p-2 rounded-md hover:bg-[#242424] transition-colors"
                        title={getRefundableAmount() > 0 ? `Delete & Refund ${formatCurrency(getRefundableAmount())}` : 'Delete'}
                        disabled={isProcessing}
                    >
                        <Trash2 className="w-4 h-4 text-[#9A9A9A] hover:text-[#FF5A5A]" />
                    </button>
                </div>
            </div>

            {/* ─── Confirmation Modal ─── */}
            <Transition.Root show={showConfirmModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setShowConfirmModal(false)}>
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
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Dialog.Title className="text-lg font-semibold text-white">
                                            {modalAction === 'archive' ? 'Archive Pocket' : 'Delete Pocket'}
                                        </Dialog.Title>
                                        <button
                                            onClick={() => setShowConfirmModal(false)}
                                            className="p-1 rounded-lg hover:bg-[#242424] transition-colors"
                                        >
                                            <X className="w-5 h-5 text-[#9A9A9A]" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[#9A9A9A] text-sm">
                                            {modalAction === 'archive' 
                                                ? `Are you sure you want to archive "${pocket.name}"?`
                                                : `Are you sure you want to permanently delete "${pocket.name}"?`
                                            }
                                        </p>

                                        {getRefundableAmount() > 0 && (
                                            <div className="p-3 rounded-lg bg-[#5CB85C]/10 border border-[#5CB85C]/20">
                                                <p className="text-sm text-[#5CB85C]">
                                                    <span className="font-medium">💰 Refund:</span> 
                                                    {' '}{formatCurrency(getRefundableAmount())} will be returned to your safe balance.
                                                </p>
                                            </div>
                                        )}

                                        {getRefundableAmount() <= 0 && (
                                            <div className="p-3 rounded-lg bg-[#9A9A9A]/10 border border-[#9A9A9A]/20">
                                                <p className="text-sm text-[#9A9A9A]">
                                                    No remaining balance to refund.
                                                </p>
                                            </div>
                                        )}

                                        {pocket.spent > 0 && (
                                            <div className="p-3 rounded-lg bg-[#F4B400]/10 border border-[#F4B400]/20">
                                                <p className="text-sm text-[#F4B400]">
                                                    <span className="font-medium">📊 Spent:</span> 
                                                    {' '}{formatCurrency(pocket.spent)} has been used from this pocket.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3 mt-6 pt-4 border-t border-[#242424]">
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmModal(false)}
                                            className="flex-1 px-4 py-2 border border-[#242424] text-[#9A9A9A] rounded-lg hover:border-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={confirmAction}
                                            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                                                modalAction === 'archive'
                                                    ? 'bg-[#F4B400] text-black hover:bg-[#E5A800]'
                                                    : 'bg-[#FF5A5A] text-white hover:bg-[#E04444]'
                                            }`}
                                        >
                                            {modalAction === 'archive' ? 'Archive Pocket' : 'Delete Pocket'}
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}