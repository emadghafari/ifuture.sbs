"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';

            const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message || 'Password reset link sent to your email.');
            } else {
                setError(data.message || 'Failed to send reset link. Please check the email and try again.');
            }
        } catch (err) {
            setError('System error. Please try again later.');
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
                    Reset Password
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Enter your email to receive a password reset link
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-white py-8 px-4 sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleForgot}>
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-medium">
                                {message}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email address</label>
                            <div className="mt-1">
                                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800" />
                            </div>
                        </div>

                        <div>
                            <button disabled={loading} type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                {loading ? 'Sending link...' : 'Send Reset Link'}
                            </button>
                        </div>

                        <div className="text-center mt-4 text-sm">
                            <Link href="/portal/login" className="font-medium text-slate-600 hover:text-slate-900">
                                Back to Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
