"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
    const getCookie = (name: string) => {
        if (typeof document === 'undefined') return '';
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
        return '';
    };

    const router = useRouter();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== passwordConfirm) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';

            await fetch(`${API_URL}/sanctum/csrf-cookie`, {
                method: 'GET',
                credentials: 'include'
            });

            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirm,
                    role: 'investor'
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.requires_verification) {
                    setStep(2);
                } else {
                    router.push('/portal/login');
                }
            } else {
                const data = await res.json();
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('System error. Please try again.');
        }
        setLoading(false);
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (verificationCode.length !== 5) {
            return setError('Please enter a valid 5-digit code.');
        }

        setLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';

            const res = await fetch(`${API_URL}/api/auth/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    code: verificationCode
                })
            });

            if (res.ok) {
                // login and redirect
                const loginRes = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                });

                if (loginRes.ok) {
                    router.push('/portal/dashboard');
                } else {
                    router.push('/portal/login');
                }

            } else {
                const data = await res.json();
                setError(data.message || 'Verification failed');
            }
        } catch (err) {
            setError('System error. Please try again.');
        }
        setLoading(false);
    };

    const handleResendCode = async () => {
        setError('');
        setSuccessMessage('');
        setLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';

            const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                },
                credentials: 'include',
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccessMessage('A new verification code has been sent to your email.');
            } else {
                setError(data.message || 'Failed to resend code');
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
                    {step === 1 ? 'Create Investor Account' : 'Verify Your Email'}
                </h2>
                {step === 1 && (
                    <p className="mt-2 text-center text-sm text-slate-600">
                        Or <Link href="/portal/login" className="font-medium text-indigo-600 hover:text-indigo-500">sign in to your existing account</Link>
                    </p>
                )}
                {step === 2 && (
                    <p className="mt-2 text-center text-sm text-slate-600">
                        We sent a 5-digit code to <strong>{email}</strong>
                    </p>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md border border-slate-200 rounded-3xl overflow-hidden">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 p-3 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-medium">
                            {successMessage}
                        </div>
                    )}

                    {step === 1 ? (
                        <form className="space-y-6" onSubmit={handleRegister}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                                <div className="mt-1">
                                    <input required type="text" value={name} onChange={e => setName(e.target.value)} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800" />
                                </div>
                            </div>

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

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                                <div className="mt-1">
                                    <input required type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800" />
                                </div>
                            </div>

                            <div>
                                <button disabled={loading} type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                    {loading ? 'Creating...' : 'Register'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleVerify}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 text-center">Verification Code</label>
                                <div className="mt-2 text-center">
                                    <input
                                        required
                                        type="text"
                                        maxLength={5}
                                        value={verificationCode}
                                        onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                        className="appearance-none inline-block w-40 text-center text-3xl tracking-widest px-4 py-4 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                                        placeholder="00000"
                                    />
                                </div>
                            </div>

                            <div>
                                <button disabled={loading || verificationCode.length !== 5} type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                    {loading ? 'Verifying...' : 'Verify Email'}
                                </button>
                            </div>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={handleResendCode}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                                >
                                    Didn't receive a code? Resend
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
