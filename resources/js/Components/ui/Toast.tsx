import React from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Icon } from '@iconify/react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

export const showToast = ({ message, type = 'success', duration = 5000 }: ToastProps) => {
    const styles = {
        success: {
            icon: 'mdi:check-circle-outline',
            color: '#5CB85C',
            bg: 'rgba(92, 184, 92, 0.12)',
            border: 'rgba(92, 184, 92, 0.25)',
            glow: '0 0 30px rgba(92, 184, 92, 0.05)',
        },
        error: {
            icon: 'mdi:close-circle-outline',
            color: '#FF5A5A',
            bg: 'rgba(255, 90, 90, 0.12)',
            border: 'rgba(255, 90, 90, 0.25)',
            glow: '0 0 30px rgba(255, 90, 90, 0.05)',
        },
        warning: {
            icon: 'mdi:alert-outline',
            color: '#F59E0B',
            bg: 'rgba(245, 158, 11, 0.12)',
            border: 'rgba(245, 158, 11, 0.25)',
            glow: '0 0 30px rgba(245, 158, 11, 0.05)',
        },
        info: {
            icon: 'mdi:information-outline',
            color: '#3B82F6',
            bg: 'rgba(59, 130, 246, 0.12)',
            border: 'rgba(59, 130, 246, 0.25)',
            glow: '0 0 30px rgba(59, 130, 246, 0.05)',
        },
    };

    const style = styles[type] || styles.success;

    toast.custom(
        (t) => (
            <div
                className={`${
                    t.visible ? 'animate-slideIn' : 'animate-slideOut'
                } max-w-md w-full bg-[#111111] border rounded-2xl shadow-2xl pointer-events-auto flex items-center gap-4 p-5 transition-all duration-300`}
                style={{
                    borderColor: style.border,
                    boxShadow: style.glow,
                }}
            >
                <div
                    className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
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
                    <div
                        className="mt-2 h-0.5 w-12 rounded-full transition-all duration-500"
                        style={{ backgroundColor: style.color }}
                    />
                </div>
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
            }}
            containerStyle={{
                top: 24,
                right: 24,
            }}
        />
    );
}

// Helper functions with default 5 second duration (no 'X' button since it crashes the website, no idea why)
export const toastSuccess = (message: string, duration?: number) =>
    showToast({ message, type: 'success', duration: duration || 5000 });

export const toastError = (message: string, duration?: number) =>
    showToast({ message, type: 'error', duration: duration || 5000 });

export const toastWarning = (message: string, duration?: number) =>
    showToast({ message, type: 'warning', duration: duration || 5000 });

export const toastInfo = (message: string, duration?: number) =>
    showToast({ message, type: 'info', duration: duration || 5000 });

export const toastPromise = (
    promise: Promise<any>,
    messages: {
        loading: string;
        success: string;
        error: string;
    }
) => {
    return toast.promise(
        promise,
        {
            loading: (
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-[#5CB85C] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-white">{messages.loading}</span>
                </div>
            ),
            success: () => (
                <div className="flex items-center gap-3">
                    <Icon icon="mdi:check-circle-outline" className="w-5 h-5 text-[#5CB85C]" />
                    <span className="text-sm font-medium text-white">{messages.success}</span>
                </div>
            ),
            error: (error: any) => (
                <div className="flex items-center gap-3">
                    <Icon icon="mdi:close-circle-outline" className="w-5 h-5 text-[#FF5A5A]" />
                    <span className="text-sm font-medium text-white">
                        {messages.error || error?.message || 'Something went wrong'}
                    </span>
                </div>
            ),
        },
        {
            position: 'top-right',
            style: {
                background: '#111111',
                border: '1px solid #242424',
                borderRadius: '12px',
                padding: '16px 20px',
                color: '#FFFFFF',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
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