'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSignupMutation } from '@/state/api';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const [signup, { isLoading }] = useSignupMutation();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        confirmPassword: '',    
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        //validate passwords match
        if(formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const { confirmPassword, ...signupData } = formData;
            await signup(signupData).unwrap();
            setSuccess(true);
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        } catch (err: any) {
            setError(err?.data?.message || 'Failed to create account')
        }
    };
    if(success) {
        return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="bg-surface border border-border rounded-2xl shadow-xl p-8 w-96 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-success/20 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Account Created!</h2>
                <p className="text-muted mb-4">
                    Your account has been created. Please wait for admin approval to activate your account.
                </p>
                <p className="text-sm text-muted">Redirecting to login...</p>
                    
            </div>
        </div>
        );
    }
    return (
        <div className="min-h-screen bg-surface flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
            </div>

            {/** signup card */}
            <div className="relative w-96">
                {/** header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-lg">
                         <UserPlus className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
                    <p className="text-muted">Join us to manage your projects efficiently</p>
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

                            {/** name fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground placeholder-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
                                        placeholder="John"
                                    />
                                </div>
                            <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground placeholder-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    {/** username */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
                            <input
                                type="text"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground placeholder-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
                                placeholder="johndoe"
                            />
                        </div>
                    </div>

                    {/** email */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground placeholder-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    {/** password */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Password
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
                            />
                        </div>
                    </div>

                    {/** confirm password */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Confirm Password
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
                                <span>Creating account...</span>
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-5 w-5" />
                                <span>Create Account</span>
                            </>
                        )}
                    </button>
                </form>

                {/** divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-surface text-muted">Already have an account?</span>
                    </div>
                </div>
            
                {/** sign in link */}
                <Link
                    href="/auth/login"
                    className="block w-full text-center py-3 px-4 border border-border rounded-lg text-foreground font-medium hover:bg-surface-hover transition-smooth"
                >
                    Sign In
                </Link>
            </div>
        </div>
    </div>
                    
    );
}