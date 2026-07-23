import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Icon } from '@iconify/react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

// Toast Content Component - This is where hooks are used
const ToastContent: React.FC<{
    message: string;
    style: any;
    t: any;
    duration: number;
}> = ({ message, style, t, duration }) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!t.visible) return;
        
        const startTime = Date.now();
        const totalDuration = duration || 5000;
        
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / totalDuration) * 100);
            setProgress(remaining);
            
            if (remaining <= 0) {
                clearInterval(interval);
                toast.dismiss(t.id);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [t.visible, t.id, duration]);

    return (
        <div
            className={`${
                t.visible ? 'animate-slideIn' : 'animate-slideOut'
            } max-w-md w-full bg-[#1A1A1A] backdrop-blur-xl border rounded-2xl shadow-2xl pointer-events-auto overflow-hidden`}
            style={{
                borderColor: style.border,
                boxShadow: style.glow,
                background: 'rgba(26, 26, 26, 0.95)',
            }}
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-center gap-4 p-5">
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
                        <span className="text-[10px] text-[#6B7280] font-mono tracking-wider">
                            {Math.ceil(progress / 20)}s
                        </span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div 
                className="h-1 transition-all duration-100 ease-linear"
                style={{
                    width: `${progress}%`,
                    backgroundColor: style.color,
                    opacity: progress > 0 ? 1 : 0,
                }}
            />
        </div>
    );
};

export const showToast = ({ message, type = 'success', duration = 5000 }: ToastProps) => {
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
            <ToastContent
                message={message}
                style={style}
                t={t}
                duration={duration}
            />
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
                duration: 5000,
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