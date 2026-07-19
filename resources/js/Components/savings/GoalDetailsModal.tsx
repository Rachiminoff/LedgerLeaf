import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Pencil, Archive, Trash2, Plus, Minus } from 'lucide-react';

interface GoalDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    goal: any;
    onDeposit: () => void;
    onWithdraw: () => void;
    onEdit: () => void;
}

export default function GoalDetailsModal({
    isOpen,
    onClose,
    goal,
    onDeposit,
    onWithdraw,
    onEdit,
}: GoalDetailsModalProps) {
    if (!goal) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date: string) => {
        if (!date) return 'No deadline';
        return new Date(date).toLocaleDateString('en-PH', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
    const isCompleted = goal.is_completed;
    const remaining = goal.target_amount - goal.current_amount;

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
                        <Dialog.Panel className="w-full max-w-lg bg-[#111111] rounded-2xl shadow-xl border border-[#242424] overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-[#242424]">
                                <Dialog.Title className="text-lg font-semibold text-white">
                                    {goal.name}
                                </Dialog.Title>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-lg hover:bg-[#242424] transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#9A9A9A]" />
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                {/* Progress Bar */}
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-[#9A9A9A]">Progress</span>
                                        <span className="text-white">{progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#242424] rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${Math.min(progress, 100)}%`,
                                                backgroundColor: isCompleted ? '#5CB85C' : '#5CB85C',
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-[#1A1A1A] rounded-xl p-3">
                                        <p className="text-xs text-[#9A9A9A]">Target</p>
                                        <p className="text-sm font-semibold text-white">
                                            {formatCurrency(goal.target_amount)}
                                        </p>
                                    </div>
                                    <div className="bg-[#1A1A1A] rounded-xl p-3">
                                        <p className="text-xs text-[#9A9A9A]">Saved</p>
                                        <p className="text-sm font-semibold text-[#5CB85C]">
                                            {formatCurrency(goal.current_amount)}
                                        </p>
                                    </div>
                                    <div className="bg-[#1A1A1A] rounded-xl p-3">
                                        <p className="text-xs text-[#9A9A9A]">Remaining</p>
                                        <p className="text-sm font-semibold text-[#F59E0B]">
                                            {formatCurrency(remaining)}
                                        </p>
                                    </div>
                                    <div className="bg-[#1A1A1A] rounded-xl p-3">
                                        <p className="text-xs text-[#9A9A9A]">Status</p>
                                        <p className={`text-sm font-semibold ${
                                            isCompleted ? 'text-[#5CB85C]' : 'text-[#3B82F6]'
                                        }`}>
                                            {isCompleted ? 'Completed' : 'In Progress'}
                                        </p>
                                    </div>
                                </div>

                                {/* Details Section */}
                                <div className="space-y-2 text-sm">
                                    {goal.target_date && (
                                        <div className="flex justify-between">
                                            <span className="text-[#9A9A9A]">Target Date</span>
                                            <span className="text-white">{formatDate(goal.target_date)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-[#9A9A9A]">Created</span>
                                        <span className="text-white">{formatDate(goal.created_at)}</span>
                                    </div>
                                    {goal.description && (
                                        <div>
                                            <span className="text-[#9A9A9A]">Description</span>
                                            <p className="text-white mt-1">{goal.description}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-4 border-t border-[#242424] flex-wrap">
                                    <button
                                        onClick={onDeposit}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#5CB85C] text-black rounded-lg hover:bg-[#6FCF70] transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Deposit
                                    </button>
                                    <button
                                        onClick={onWithdraw}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] text-black rounded-lg hover:bg-[#E5A800] transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                        Withdraw
                                    </button>
                                    <button
                                        onClick={onEdit}
                                        className="flex items-center gap-2 px-4 py-2 border border-[#242424] text-[#9A9A9A] rounded-lg hover:border-white transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="flex items-center gap-2 px-4 py-2 border border-[#FF5A5A]/30 text-[#FF5A5A] rounded-lg hover:bg-[#FF5A5A]/10 transition-colors"
                                    >
                                        <Archive className="w-4 h-4" />
                                        Archive
                                    </button>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}