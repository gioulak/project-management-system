'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from 'next/link';
import { Lock, AlertCircle, CheckCircle, Loader2} from 'lucide-react';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if(formData.password.length < 6) {
            setError('Password must me at least 6 characters long');
            return;
        }
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password: formData.password,
                 }),
            });

            const data = await response.json();
            if(!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }
            setSuccess(true);
            //redirecting to lofin
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if(success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="bg-surface border border-border rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-success/20 rounded-full mb-4">
                            <CheckCircle className="h-8 w-8 text-success" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Password reset</h2>
                    <p className="text-muted mb-4">
                        Your password has been reset successfully
                    </p>
                    <p className="text-sm text-muted">Redirecting to login...</p>
                    </div>
                </div>
            );
    }

    return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl"></div>
                </div>
                {/** form card */}
                <div className="relative w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-lg">
                             <Lock className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
                        <p className="text-muted">Enter your new password.</p>
                    </div>
                    {/** form card */}
                    <div className="bg-surface border border-border rounded-2xl shadow-xl p-8 backdrop-blur-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/** error alert */}
                            {error && (
                                <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg flex items-center space-x-2">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            {/** password */}
                                                <div>
                                                    <label className="block text-sm font-medium text-foreground mb-2">
                                                        New Password
                                                    </label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
                                                        <input
                                                            type="password"
                                                            required
                                                            value={formData.password}
                                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                            className="w-full pl-10 pr-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground placeholder-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
                                                            placeholder="••••••"
                                                            minLength={6}
                                                        />
                                                    </div>
                                                    <p className="mt-1 text-xs text-muted">Must be at least 6 characters</p>
                                                    </div>

                            {/** confirm password */}
                                                <div>
                                                    <label className="block text-sm font-medium text-foreground mb-2">
                                                        Confirm New Password
                                                    </label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
                                                        <input
                                                            type="password"
                                                            required
                                                            value={formData.confirmPassword}
                                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                            className="w-full pl-10 pr-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground placeholder-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
                                                            placeholder="••••••"
                                                            minLength={6}
                                                        />
                                                    </div>
                                                </div>
                            
                            {/** submit button */}
                    <button
                        type="submit"
                        disabled={isLoading || !token}
                        className="w-full bg-gradient-primary text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Resetting...</span>
                            </>
                        ) : (
                            <>
                                <Lock className="h-5 w-5" />
                                <span>Reset Password</span>
                            </>
                        )}
                    </button>
                </form>

                {/** back to login */}
                <div className="mt-6 text-center">
                    <Link
                        href="/auth/login"
                        className="text-sm text-muted hover:text-foreground transition-smooth">
                            Remember your password? Sign In
                        </Link>
                </div>
            </div>
        </div>
    </div>
    );
}