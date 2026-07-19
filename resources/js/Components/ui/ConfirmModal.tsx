import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, AlertTriangle, Info, AlertCircle, Shield } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'danger',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
}: ConfirmModalProps) {
    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: AlertCircle,
                    iconColor: '#FF5A5A',
                    iconBg: 'rgba(255, 90, 90, 0.1)',
                    borderColor: '#FF5A5A30',
                    buttonBg: '#FF5A5A',
                    buttonHover: '#E04444',
                    buttonText: 'text-white',
                };
            case 'warning':
                return {
                    icon: AlertTriangle,
                    iconColor: '#F4B400',
                    iconBg: 'rgba(244, 180, 0, 0.1)',
                    borderColor: '#F4B40030',
                    buttonBg: '#F4B400',
                    buttonHover: '#E5A800',
                    buttonText: 'text-black',
                };
            case 'success':
                return {
                    icon: Shield,
                    iconColor: '#5CB85C',
                    iconBg: 'rgba(92, 184, 92, 0.1)',
                    borderColor: '#5CB85C30',
                    buttonBg: '#5CB85C',
                    buttonHover: '#4CAF50',
                    buttonText: 'text-white',
                };
            default:
                return {
                    icon: Info,
                    iconColor: '#3B82F6',
                    iconBg: 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#3B82F630',
                    buttonBg: '#3B82F6',
                    buttonHover: '#2563EB',
                    buttonText: 'text-white',
                };
        }
    };

    const styles = getTypeStyles();
    const IconComponent = styles.icon;

    // Format message with line breaks
    const formattedMessage = message.split('\n').map((line, index) => (
        <span key={index}>
            {line}
            {index < message.split('\n').length - 1 && <br />}
        </span>
    ));

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
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div
                                        className="p-2 rounded-lg flex-shrink-0"
                                        style={{ backgroundColor: styles.iconBg }}
                                    >
                                        <IconComponent className="w-5 h-5" style={{ color: styles.iconColor }} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <Dialog.Title className="text-lg font-semibold text-white">
                                            {title}
                                        </Dialog.Title>
                                        <p className="text-sm text-[#9A9A9A] mt-1 whitespace-pre-wrap leading-relaxed">
                                            {formattedMessage}
                                        </p>
                                    </div>

                                    {/* Close Button */}
                                    <button
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className="p-1 rounded-lg hover:bg-[#242424] transition-colors flex-shrink-0 disabled:opacity-50"
                                    >
                                        <X className="w-5 h-5 text-[#9A9A9A]" />
                                    </button>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 mt-6 pt-4 border-t border-[#242424]">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-2 border border-[#242424] text-[#9A9A9A] rounded-lg hover:border-white hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onConfirm}
                                        disabled={isLoading}
                                        className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${styles.buttonText}`}
                                        style={{
                                            backgroundColor: styles.buttonBg,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = styles.buttonHover;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = styles.buttonBg;
                                        }}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                        fill="none"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            confirmText
                                        )}
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