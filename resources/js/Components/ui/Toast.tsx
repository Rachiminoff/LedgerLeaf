import React from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Icon } from '@iconify/react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

export const showToast = ({ message, type = 'success', duration = 4000 }: ToastProps) => {
    const styles = {
        success: {
            icon: 'mdi:check-circle',
            color: '#5CB85C',
            bg: 'rgba(92, 184, 92, 0.15)',
            border: 'rgba(92, 184, 92, 0.3)',
            glow: '0 0 40px rgba(92, 184, 92, 0.08)',
            textColor: '#D4EDDA',
        },
        error: {
            icon: 'mdi:close-circle',
            color: '#FF6B6B',
            bg: 'rgba(255, 107, 107, 0.15)',
            border: 'rgba(255, 107, 107, 0.3)',
            glow: '0 0 40px rgba(255, 107, 107, 0.08)',
            textColor: '#FDDEDE',
        },
        warning: {
            icon: 'mdi:alert',
            color: '#FFB74D',
            bg: 'rgba(255, 183, 77, 0.15)',
            border: 'rgba(255, 183, 77, 0.3)',
            glow: '0 0 40px rgba(255, 183, 77, 0.08)',
            textColor: '#FFF3E0',
        },
        info: {
            icon: 'mdi:information',
            color: '#64B5F6',
            bg: 'rgba(100, 181, 246, 0.15)',
            border: 'rgba(100, 181, 246, 0.3)',
            glow: '0 0 40px rgba(100, 181, 246, 0.08)',
            textColor: '#E3F2FD',
        },
    };

    const style = styles[type] || styles.success;

    toast.custom(
        (t) => (
            <div
                className={`${
                    t.visible ? 'animate-slideIn' : 'animate-slideOut'
                } max-w-md w-full bg-[#1A1A1A] backdrop-blur-xl border rounded-2xl shadow-2xl pointer-events-auto flex items-center gap-4 p-5 transition-all duration-300`}
                style={{
                    borderColor: style.border,
                    boxShadow: style.glow,
                    background: 'rgba(26, 26, 26, 0.95)',
                }}
            >
                <div
                    className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: style.bg }}
                >
                    <Icon
                        icon={style.icon}
                        className="w-6 h-6"
                        style={{ color: style.color }}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white leading-relaxed tracking-wide">
                        {message}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                        <div
                            className="h-0.5 rounded-full transition-all duration-500"
                            style={{ 
                                backgroundColor: style.color,
                                width: '60px',
                            }}
                        />
                        <span className="text-[10px] text-[#6B7280] font-mono tracking-wider">
                            JUST NOW
                        </span>
                    </div>
                </div>

                {/* Close button - fixed version */}
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="flex-shrink-0 w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center transition-all duration-200 group"
                >
                    <Icon
                        icon="mdi:close"
                        className="w-4 h-4 text-[#6B7280] group-hover:text-white transition-colors"
                    />
                </button>
            </div>
        ),
        {
            duration: duration,
            position: 'top-right',
        }
    );
};

export function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    background: 'transparent',
                    boxShadow: 'none',
                    padding: 0,
                    maxWidth: '100%',
                },
                className: 'toast-container',
                duration: 4000,
            }}
            containerStyle={{
                top: 24,
                right: 24,
            }}
        />
    );
}

// Helper functions
export const toastSuccess = (message: string, duration?: number) =>
    showToast({ message, type: 'success', duration: duration || 4000 });

export const toastError = (message: string, duration?: number) =>
    showToast({ message, type: 'error', duration: duration || 4000 });

export const toastWarning = (message: string, duration?: number) =>
    showToast({ message, type: 'warning', duration: duration || 4000 });

export const toastInfo = (message: string, duration?: number) =>
    showToast({ message, type: 'info', duration: duration || 4000 });

export const toastPromise = (
    promise: Promise<any>,
    messages: {
        loading: React.ReactNode;
        success: React.ReactNode;
        error: React.ReactNode;
    }
) => {
    return toast.promise(
        promise,
        {
            loading: (
                <div className="flex items-center gap-3 bg-[#1A1A1A] border border-[#242424] rounded-xl px-4 py-3">
                    <div className="w-5 h-5 border-2 border-[#5CB85C] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-white">{messages.loading}</span>
                </div>
            ),
            success: (
                <div className="flex items-center gap-3 bg-[#1A1A1A] border border-[#242424] rounded-xl px-4 py-3">
                    <Icon icon="mdi:check-circle" className="w-5 h-5 text-[#5CB85C]" />
                    <span className="text-sm font-medium text-white">{messages.success}</span>
                </div>
            ),
            error: (
                <div className="flex items-center gap-3 bg-[#1A1A1A] border border-[#242424] rounded-xl px-4 py-3">
                    <Icon icon="mdi:close-circle" className="w-5 h-5 text-[#FF6B6B]" />
                    <span className="text-sm font-medium text-white">{messages.error}</span>
                </div>
            ),
        },
        {
            position: 'top-right',
            style: {
                background: 'transparent',
                boxShadow: 'none',
                padding: 0,
            },
        }
    );
};

export default {
    showToast,
    ToastProvider,
    toastSuccess,
    toastError,
    toastWarning,
    toastInfo,
    toastPromise,
};