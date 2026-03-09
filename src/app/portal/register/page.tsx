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
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [codeSent, setCodeSent] = useState(false);

    const handleSendCode = async () => {
        setError('');
        setSuccessMessage('');

        if (!email) {
            return setError('Please enter your email address first.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return setError('Please enter a valid email address.');
        }

        setSendingCode(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';

            await fetch(`${API_URL}/sanctum/csrf-cookie`, {
                method: 'GET',
                credentials: 'include'
            });

            const res = await fetch(`${API_URL}/api/auth/send-registration-code`, {
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
                setCodeSent(true);
                setSuccessMessage('Verification code sent to your email.');
            } else {
                setError(data.message ? `Server Issue: ${data.message}` : 'Server Error: Failed to send verification code.');
            }
        } catch (err) {
            setError('System error. Please try again.');
        }
        setSendingCode(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (password !== passwordConfirm) {
            return setError('Passwords do not match');
        }

        if (verificationCode.length !== 5) {
            return setError('Please enter the 5-digit verification code sent to your email.');
        }

        setLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';

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
                    role: 'investor',
                    verification_code: verificationCode
                })
            });

            if (res.ok) {
                // Auto login after successful registration since email is verified
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
                if (data.errors && data.errors.verification_code) {
                    setError(data.errors.verification_code[0]);
                } else {
                    setError(data.message || 'Registration failed');
                }
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
                        <span className="text-3xl font-extrabold text-blue-600">iFuture</span>
                    </Link>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-slate-900">
                    Create Investor Account
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Or <Link href="/portal/login" className="font-medium text-indigo-600 hover:text-indigo-500">sign in to your existing account</Link>
                </p>
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

                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Full Name</label>
                            <div className="mt-1">
                                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email address</label>
                            <div className="mt-1 flex gap-2">
                                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800 flex-1" placeholder="info@ifuture.sbs" />
                                <button
                                    type="button"
                                    disabled={sendingCode || !email || codeSent}
                                    onClick={handleSendCode}
                                    className="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 transition-colors"
                                >
                                    {sendingCode ? 'Sending...' : (codeSent ? 'Code Sent' : 'Send Code')}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Verification Code</label>
                            <div className="mt-1">
                                <input required type="text" maxLength={5} value={verificationCode} onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800 text-center tracking-widest text-lg font-mono" placeholder="00000" />
                            </div>
                            <p className="mt-1 text-xs text-slate-500">Enter the 5-digit code sent to your email address.</p>
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
                            <button disabled={loading} type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors">
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
