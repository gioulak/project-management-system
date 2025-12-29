'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSigninMutation } from '@/state/api';
import { LogIn, Mail, Lock, AlertCircle, Loader2} from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [signin, { isLoading }] = useSigninMutation();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const result = await signin(formData).unwrap();
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('user', JSON.stringify(result.user));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err?.data?.message || 'Invalid credentials')
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl"></div>
                </div>
                <div className="relative w-96">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-lg">
                            <LogIn className="h-8 w-8 text-white" />
                        </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-muted">Sign in to your account to continue</p>
                </div>

                    <div className="bg-surface border border-border rounded-2xl shadow-xl p-8 backdrop-blur-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/*** error */}
                            {error && (
                                <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg flex items-center space-x-2">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}
        
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Username or Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
                            <input
                                type="text"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground placeholder-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
                                placeholder="Enter you username"
                            />
                        </div>
                        </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-foreground">
                                        Password
                                    </label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-sm text-primary hover:text-primary-light transition-smooth"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground placeholder-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-primary text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-5 w-5" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>    
                    </form>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-surface text-muted">Dont have an account?</span>
                        </div>
                    </div>

                    <Link
                        href="/auth/signup"
                        className="block w-full text-center py-3 px-4 border border-border rounded-lg text-foreground font-medium hover:bg-surface-hover transition-smooth">
                            Create an account
                        </Link>
                    </div>

                    <p className="text-center text-muted text-sm mt-6"> {/** might remove, too much? */}
                        By signing in, you agree to our Terms of Service and Provacy Policy
                    </p> 
            </div>
        </div>
    );
}