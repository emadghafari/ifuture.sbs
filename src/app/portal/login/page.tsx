"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
    const getCookie = (name: string) => {
        if (typeof document === 'undefined') return '';
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
        return '';
    };

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/portal/dashboard';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'login' | 'verify'>('login');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';

            // CSRF Cookie
            await fetch(`${API_URL}/sanctum/csrf-cookie`, {
                method: 'GET',
                credentials: 'include'
            });

            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });

            if (res.ok) {
                const data = await res.json();

                if (data.requires_2fa) {
                    setStep('verify');
                    setLoading(false);
                    return;
                }

                // Optional: ensure admin isn't trying to log in as investor
                if (data.user?.role === 'admin' && redirectUrl === '/portal/dashboard') {
                    router.push('/admin');
                } else {
                    router.push(redirectUrl);
                }
            } else {
                const data = await res.json();
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('System error. Please try again.');
        }

        setLoading(false);
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';

            const res = await fetch(`${API_URL}/api/auth/login-verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                },
                credentials: 'include',
                body: JSON.stringify({ email, password, code })
            });

            if (res.ok) {
                const data = await res.json();

                if (data.user?.role === 'admin' && redirectUrl === '/portal/dashboard') {
                    router.push('/admin');
                } else {
                    router.push(redirectUrl);
                }
            } else {
                const data = await res.json();
                setError(data.message || 'Invalid verification code');
            }
        } catch (err) {
            setError('System error. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center mb-6">
                    <Link href="/" className="inline-block">
                        <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">iFuture</span>
                    </Link>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-slate-900">
                    Sign in to Portal
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Or <Link href="/portal/register" className="font-medium text-indigo-600 hover:text-indigo-500">create a new investor account</Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-white py-8 px-4 sm:rounded-lg sm:px-10">
                    {step === 'login' ? (
                        <form className="space-y-6" onSubmit={handleLogin}>
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Email address</label>
                                <div className="mt-1">
                                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Password</label>
                                <div className="mt-1">
                                    <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <Link href="/portal/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <button disabled={loading} type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                    {loading ? 'Signing in...' : 'Sign in'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleVerify}>
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                                    {error}
                                </div>
                            )}
                            <div className="text-center mb-4">
                                <p className="text-sm text-slate-600">
                                    We sent a 5-digit verification code to <strong>{email}</strong>. Please enter it below to securely log in.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 text-center">Verification Code</label>
                                <div className="mt-1">
                                    <input required type="text" maxLength={5} value={code} onChange={e => setCode(e.target.value.replace(/[^0-9]/g, ''))} className="appearance-none text-center tracking-[0.5em] block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-2xl text-slate-800 font-bold" placeholder="12345" />
                                </div>
                            </div>

                            <div>
                                <button disabled={loading || code.length < 5} type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                    {loading ? 'Verifying...' : 'Verify & Sign in'}
                                </button>
                            </div>
                            <div className="text-center mt-4">
                                <button type="button" onClick={() => { setStep('login'); setError(''); setCode(''); }} className="text-sm text-indigo-600 font-medium hover:text-indigo-500">
                                    &larr; Back to login
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 'login' && (
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-slate-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={() => {
                                        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
                                        window.location.href = `${API_URL}/api/auth/google/redirect`;
                                    }}
                                    className="w-full flex justify-center items-center py-3 px-4 border border-slate-300 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                        <path d="M1 1h22v22H1z" fill="none" />
                                    </svg>
                                    Sign in with Google
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><div className="text-xl font-bold text-slate-400 animate-pulse">Loading Portal...</div></div>}>
            <LoginForm />
        </Suspense>
    );
}
