// resources/js/Components/Profile/DeleteAccount.tsx
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface Props {
    onDelete: (data: { confirmation: string; password: string }) => void;
    isDeleting: boolean;
}

export default function DeleteAccount({ onDelete, isDeleting }: Props) {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ confirmation?: string; password?: string }>({});

    const handleOpenModal = () => {
        setConfirmationText('');
        setPassword('');
        setErrors({});
        setIsConfirmModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsConfirmModalOpen(false);
        setConfirmationText('');
        setPassword('');
        setErrors({});
    };

    const handleDelete = () => {
        const newErrors: { confirmation?: string; password?: string } = {};

        if (confirmationText !== 'DELETE EVERYTHING') {
            newErrors.confirmation = 'Please type "DELETE EVERYTHING" to confirm.';
        }

        if (!password) {
            newErrors.password = 'Please enter your password to confirm.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // ✅ Pass both confirmation and password
        onDelete({
            confirmation: confirmationText,
            password: password,
        });

        handleCloseModal();
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isConfirmModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isConfirmModalOpen]);

    const isConfirmEnabled = confirmationText === 'DELETE EVERYTHING' && password.length > 0;

    return (
        <>
            <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-red-500 mb-1">Delete Account</h3>
                        <p className="text-xs text-[#9A9A9A] max-w-md">
                            This permanently removes your LedgerLeaf account and all associated financial data.
                            This action cannot be undone.
                        </p>
                    </div>
                    <button
                        onClick={handleOpenModal}
                        className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors text-sm whitespace-nowrap"
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-[#111111] border border-[#242424] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                    <Icon icon="mdi:alert-circle" className="w-5 h-5 text-red-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Delete Account</h3>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="text-[#9A9A9A] hover:text-white transition-colors"
                                disabled={isDeleting}
                            >
                                <Icon icon="mdi:close" className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Warning */}
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                            <p className="text-sm text-red-400">
                                <strong>Warning:</strong> This action is irreversible. All your financial data,
                                including expenses, savings goals, and pockets, will be permanently deleted.
                            </p>
                        </div>

                        {/* Confirmation Input */}
                        <div className="mb-4">
                            <label className="block text-xs text-[#9A9A9A] mb-2">
                                Type <span className="text-red-500 font-mono font-bold">DELETE EVERYTHING</span> to confirm
                            </label>
                            <input
                                type="text"
                                value={confirmationText}
                                onChange={(e) => {
                                    setConfirmationText(e.target.value);
                                    setErrors({});
                                }}
                                className={`w-full bg-[#171717] border rounded-lg px-4 py-2.5 text-white focus:outline-none transition-colors font-mono ${
                                    errors.confirmation 
                                        ? 'border-red-500 focus:border-red-500' 
                                        : 'border-[#242424] focus:border-red-500'
                                }`}
                                placeholder="Type DELETE EVERYTHING here"
                                disabled={isDeleting}
                            />
                            {errors.confirmation && (
                                <p className="text-xs text-red-500 mt-1">{errors.confirmation}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="mb-6">
                            <label className="block text-xs text-[#9A9A9A] mb-2">
                                Enter your password to confirm
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrors({});
                                    }}
                                    className={`w-full bg-[#171717] border rounded-lg px-4 py-2.5 text-white pr-10 focus:outline-none transition-colors ${
                                        errors.password 
                                            ? 'border-red-500 focus:border-red-500' 
                                            : 'border-[#242424] focus:border-red-500'
                                    }`}
                                    placeholder="Enter your password"
                                    disabled={isDeleting}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] hover:text-white transition-colors"
                                >
                                    <Icon
                                        icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'}
                                        className="w-4 h-4"
                                    />
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                disabled={isDeleting}
                                className="px-4 py-2.5 bg-[#171717] border border-[#242424] text-white font-medium rounded-lg hover:bg-[#1f1f1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting || !isConfirmEnabled}
                                className={`px-4 py-2.5 text-white font-medium rounded-lg transition-colors ${
                                    isConfirmEnabled && !isDeleting
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-red-500/50 cursor-not-allowed'
                                }`}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}