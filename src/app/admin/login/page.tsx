"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
    const getCookie = (name: string) => {
        if (typeof document === 'undefined') return '';
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
        return '';
    };
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
            // Laravel Sanctum CSRF cookie
            await fetch(`${API_URL}/sanctum/csrf-cookie`, {
                credentials: 'include',
            });

            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // Verify Role Before Allowing Entry
                const userResponse = await fetch(`${API_URL}/api/auth/user`, {
                    headers: { 'Accept': 'application/json' },
                    credentials: 'include',
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    if (userData.role !== 'admin') {
                        // Force logout the invalid session immediately
                        await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
                        setError('Access Denied: Investor accounts cannot access the CMS.');
                        setLoading(false);
                        return;
                    }
                }

                router.push('/admin/dashboard');
            } else {
                const data = await response.json();
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Connection error. Please check backend.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#040D0A] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-primary-500/30">
            {/* Background Glow Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="text-center mb-6">
                    <Link href="/" className="inline-block">
                        <span className="text-3xl font-extrabold bg-gradient-to-r from-primary-400 to-emerald-300 bg-clip-text text-transparent">iFuture SBS</span>
                    </Link>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
                    CMS Portal Access
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Restricted secure super-admin portal. <Link href="/portal/login" className="font-medium text-primary-400 hover:text-primary-300">&larr; Back to Investor login</Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-[#091512]/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 sm:p-12 shadow-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
                        <p className="text-slate-400">iFuture SBS CMS</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                            />
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20 backdrop-blur">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold hover:to-primary-400 transition-all shadow-[0_0_20px_rgba(4,120,87,0.3)] disabled:opacity-50 border border-primary-500/50"
                        >
                            {loading ? 'Authenticating...' : 'Enter System'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
