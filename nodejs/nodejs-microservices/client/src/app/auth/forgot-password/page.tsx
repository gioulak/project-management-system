'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if(!response.ok) {
                throw new Error(data.message || 'Failed tp send reset email');
            }
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if(success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="bg-surface border border-border rounded-2xl shadow-xl p-8 max-w-md w-full">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-success/20 rounded-full mb-4">
                        <CheckCircle className="h-8 w-8 text-success" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Check your Email</h2>
                <p className="text-muted mb-6">
                    A password reset link has been sent to <strong>{email}</strong>.
                    Please check your inbox.
                </p>
                <Link href="/auth/login"
                className="inline-flex items-center text-primary hover:text-primary-light transition-smooth"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                </Link>
                </div>
            </div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
            </div>
            {/** form card */}
            <div className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-lg">
                         <Mail className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Forgot Password?</h1>
                    <p className="text-muted">Enter your email to reset your password.</p>
                </div>
                {/** form card */}
                <div className="bg-surface border border-border rounded-2xl shadow-xl p-8 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/** error alert */}
                        {error && (
                            <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg flex items-center space-x-2">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {/** email */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">
                                                    Email Address
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
                                                    <input
                                                        type="email"
                                                        required
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground placeholder-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
                                                        placeholder="your.email@example.com"
                                                    />
                                                </div>
                                            </div>

                                            {/** submit button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-primary text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Sendning...</span>
                            </>
                        ) : (
                            <>
                                <Mail className="h-5 w-5" />
                                <span>Send Reset Link</span>
                            </>
                        )}
                    </button>
                </form>
                {/** back to login */}
                <div className="mt-6">
                    <Link
                        href="/auth/login"
                        className="flex items-center justify-center text-muted hover:text-foregoround transition-smooth">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back To Login
                        </Link>
                </div>
            </div>
        </div>
    </div>
    );
}