import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Icon } from '@iconify/react';

interface PageProps {
    auth: {
        user: {
            email: string;
            name: string;
        };
    };
    status?: string;
}

export default function VerifyEmail() {
    const { auth, status } = usePage<PageProps>().props;
    const [isResending, setIsResending] = useState(false);
    const [resendStatus, setResendStatus] = useState<string | null>(null);

    const handleResend = async () => {
        setIsResending(true);
        setResendStatus(null);
        
        try {
            await router.post('/email/verification-notification');
            setResendStatus('A new verification link has been sent to your email.');
        } catch (error) {
            setResendStatus('Failed to send verification link. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <>
            <Head title="Verify Email" />
            
            <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4">
                <div className="bg-[#111111] border border-[#242424] rounded-2xl p-8 max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-[#5CB85C]/10 flex items-center justify-center mx-auto mb-4">
                            <Icon icon="mdi:email-check" className="w-8 h-8 text-[#5CB85C]" />
                        </div>
                        <h1 className="text-2xl font-semibold text-white">Verify Your Email</h1>
                        <p className="text-sm text-[#9A9A9A] mt-2">
                            We've sent a verification link to
                        </p>
                        <p className="text-sm font-medium text-white mt-1">
                            {auth.user.email}
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 p-3 rounded-lg bg-[#5CB85C]/10 border border-[#5CB85C]/20">
                            <p className="text-sm text-[#5CB85C] text-center">{status}</p>
                        </div>
                    )}
                    {resendStatus && (
                        <div className="mb-4 p-3 rounded-lg bg-[#5CB85C]/10 border border-[#5CB85C]/20">
                            <p className="text-sm text-[#5CB85C] text-center">{resendStatus}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="bg-[#1A1A1A] border border-[#242424] rounded-xl p-4">
                            <p className="text-sm text-[#9A9A9A]">
                                Please check your email and click the verification link to activate your account.
                                If you didn't receive the email, click the button below to send a new link.
                            </p>
                        </div>

                        <button
                            onClick={handleResend}
                            disabled={isResending}
                            className="w-full px-4 py-3 bg-[#5CB85C] text-black rounded-xl hover:bg-[#6FCF70] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isResending ? 'Sending...' : 'Resend Verification Email'}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#242424]"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[#111111] text-[#9A9A9A]">or</span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#242424] text-white rounded-xl hover:bg-[#242424] transition-colors font-medium"
                        >
                            Logout
                        </button>
                    </div>

                    <p className="text-xs text-[#9A9A9A] text-center mt-6">
                        Need help? Contact support at support@ledgerleaf.com
                    </p>
                </div>
            </div>
        </>
    );
}