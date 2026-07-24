import React, { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);
    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent): void => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent): void => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
            
            // Focus the confirm button by default
            setTimeout(() => {
                confirmButtonRef.current?.focus();
            }, 100);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent): void => {
        if (e.key === 'Tab') {
            const focusableElements = modalRef.current?.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (!focusableElements) return;

            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            onKeyDown={handleKeyDown}
        >
            <div
                ref={modalRef}
                className="bg-[#1A1A1A] rounded-2xl border border-[#242424] shadow-2xl max-w-md w-full p-6 animate-scaleIn"
                style={{
                    animation: 'scaleIn 0.3s ease-out forwards',
                }}
            >
                <style>{`
                    @keyframes scaleIn {
                        from {
                            opacity: 0;
                            transform: scale(0.95) translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }
                    @media (prefers-reduced-motion: reduce) {
                        .animate-scaleIn {
                            animation: none !important;
                            opacity: 1 !important;
                            transform: none !important;
                        }
                    }
                `}</style>

                <div className="text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-[#FF5A5A]/10 flex items-center justify-center mx-auto mb-4">
                        <Icon icon="mdi:logout" className="h-8 w-8 text-[#FF5A5A]" />
                    </div>

                    {/* Title */}
                    <h3 id="logout-title" className="text-xl font-semibold text-white mb-2">
                        Logout Confirmation
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#9A9A9A] leading-relaxed">
                        Are you sure you want to log out?
                        <br />
                        <span className="text-xs text-[#6B7280]">
                            You will need to sign in again to access your account.
                        </span>
                    </p>

                    {/* Actions */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button
                            ref={cancelButtonRef}
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-[#242424] text-[#9A9A9A] rounded-xl hover:border-white hover:text-white transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5CB85C]/50"
                        >
                            Cancel
                        </button>
                        <button
                            ref={confirmButtonRef}
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2.5 bg-[#FF5A5A] text-black rounded-xl hover:bg-[#FF6B6B] transition-all duration-200 text-sm font-semibold hover:shadow-lg hover:shadow-[#FF5A5A]/20 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#FF5A5A]/50"
                        >
                            <Icon icon="mdi:logout" className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;