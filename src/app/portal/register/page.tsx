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
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== passwordConfirm) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';

            // First we need to get the CSRF cookie for Sanctum
            await fetch(`${API_URL}/sanctum/csrf-cookie`, {
                method: 'GET',
                credentials: 'include'
            });

            // Next, register the user directly via the API. Note: laravel fortify/breeze creates the session
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
                    role: 'investor' // Assign investor role
                })
            });

            if (res.ok) {
                // Now attempt login to grab the token/session
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
                    router.push('/portal/login'); // fallback
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

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center mb-6">
                    <Link href="/" className="inline-block">
                        <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">iFuture</span>
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
                    <form className="space-y-6" onSubmit={handleRegister}>
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

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
                </div>
            </div>
        </div>
    );
}
