"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { adminFetch } from '@/utils/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [isBellOpen, setIsBellOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === '/admin/login') return;

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        adminFetch(`${API_URL}/api/auth/user`)
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => {
                // strict role check
                if (data.role === 'investor') {
                    router.push('/portal/dashboard');
                    return;
                }
                setUser(data);
            })
            .catch(() => router.push('/admin/login'));
    }, [pathname, router]);

    if (pathname === '/admin/login') return <>{children}</>;
    if (!user && pathname !== '/admin/login') return <div className="min-h-screen bg-[#0b1120]"></div>;

    return (
        <div dir="ltr" className="min-h-screen bg-[#040D0A] flex font-sans text-slate-300 overflow-x-hidden selection:bg-primary-500/30">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            {/* Dark Premium Sidebar */}
            <aside className={`w-64 bg-[#091512]/95 backdrop-blur-3xl border-r border-white/10 text-slate-300 flex flex-col fixed inset-y-0 z-50 transform md:translate-x-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Header Profile / Switcher area */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                    <div className="flex items-center gap-3 cursor-pointer hover:text-white hover:scale-105 transition-all duration-300">
                        <div className="w-6 h-6 bg-white/10 border border-white/20 rounded flex items-center justify-center text-xs shadow-sm">👥</div>
                        <span className="font-semibold text-[0.95rem]">iFuture SBS</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">

                    {/* GENERAL SECTION */}
                    <div className="mb-6">
                        <p className="px-3 text-[0.65rem] font-bold tracking-widest text-slate-500 mb-3 uppercase">General</p>
                        <nav className="space-y-1">
                            <Link href="/admin/dashboard" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 ${pathname === '/admin/dashboard' ? 'bg-white/10 text-white font-bold border border-white/10 shadow-[0_0_15px_rgba(4,120,87,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1'}`}>
                                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                <span>Home</span>
                            </Link>
                        </nav>
                    </div>

                    {/* MODEL MANAGEMENT */}
                    <div className="mb-6">
                        <p className="px-3 text-[0.65rem] font-bold tracking-widest text-slate-500 mb-3 uppercase">Manage</p>
                        <nav className="space-y-1">
                            <Link href="/admin/products" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 ${pathname === '/admin/products' ? 'bg-white/10 text-white font-bold border border-white/10 shadow-[0_0_15px_rgba(4,120,87,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1'}`}>
                                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                <span>Products</span>
                            </Link>
                            <Link href="/admin/team" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 ${pathname === '/admin/team' ? 'bg-white/10 text-white font-bold border border-white/10 shadow-[0_0_15px_rgba(4,120,87,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1'}`}>
                                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                <span>Team Members</span>
                            </Link>
                            <Link href="/admin/projects" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 ${pathname === '/admin/projects' ? 'bg-white/10 text-white font-bold border border-white/10 shadow-[0_0_15px_rgba(4,120,87,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1'}`}>
                                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                <span>Projects</span>
                            </Link>

                            <Link href="/admin/revenues" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 ${pathname === '/admin/revenues' ? 'bg-white/10 text-white font-bold border border-white/10 shadow-[0_0_15px_rgba(4,120,87,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1'}`}>
                                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                <span>Project Revenues</span>
                            </Link>

                            <Link href="/admin/investors" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 ${pathname === '/admin/investors' ? 'bg-white/10 text-white font-bold border border-white/10 shadow-[0_0_15px_rgba(4,120,87,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1'}`}>
                                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span>Investors</span>
                            </Link>

                            <Link href="/admin/investments" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 ${pathname === '/admin/investments' ? 'bg-white/10 text-white font-bold border border-white/10 shadow-[0_0_15px_rgba(4,120,87,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1'}`}>
                                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Investments</span>
                            </Link>
                            <Link href="/admin/messages" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 ${pathname === '/admin/messages' ? 'bg-white/10 text-white font-bold border border-white/10 shadow-[0_0_15px_rgba(4,120,87,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1'}`}>
                                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <span>Messages</span>
                            </Link>
                        </nav>
                    </div>

                    {/* SETTINGS */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between px-3 mb-3">
                            <p className="text-[0.65rem] font-bold tracking-widest text-slate-500 uppercase">System</p>
                        </div>
                        <nav className="space-y-1">
                            <Link href="/admin/settings" className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 ${pathname === '/admin/settings' ? 'bg-white/10 text-white font-bold border border-white/10 shadow-[0_0_15px_rgba(4,120,87,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1'}`}>
                                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span>Settings</span>
                            </Link>
                            <button onClick={() => { const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs'; adminFetch(`${API_URL}/api/auth/logout`, { method: 'POST' }).then(() => router.push('/admin/login')); }} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 hover:scale-[1.02] active:scale-95">
                                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                <span>Sign Out</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Bottom Profile Preview */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-xs ring-2 ring-[#091512]">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 min-h-screen w-full md:w-auto bg-[#040D0A] z-10 relative">

                {/* Mobile Sidebar Toggle */}
                <div className="absolute top-6 left-6 md:hidden z-[100]">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 transition-colors shadow-sm focus:outline-none">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>

                {/* Top Right Floating Navigation */}
                <div className="absolute top-6 right-6 md:right-10 flex items-center gap-4 md:gap-6 z-[100]">

                    {/* Notification Bell */}
                    <div className="relative">
                        <button onClick={() => setIsBellOpen(!isBellOpen)} className="text-slate-400 hover:text-slate-700 relative transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        {isBellOpen && (
                            <div className="absolute right-0 mt-3 w-80 bg-[#091512] rounded-xl shadow-2xl border border-white/10 overflow-hidden text-sm">
                                <div className="px-4 py-3 bg-white/5 border-b border-white/10 font-bold text-white flex justify-between items-center">
                                    Notifications <button onClick={() => setIsBellOpen(false)} className="text-slate-400 hover:text-red-500">×</button>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-2 h-2 mt-1.5 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(4,120,87,0.8)]"></div>
                                        <div>
                                            <p className="text-white font-medium leading-tight">System Initialization Complete</p>
                                            <p className="text-slate-400 text-xs mt-1">iFuture SBS is live.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-2 h-2 mt-1.5 rounded-full bg-gold-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
                                        <div>
                                            <p className="text-white font-medium leading-tight">Settings Synchronized</p>
                                            <p className="text-slate-400 text-xs mt-1">Database seeded with default values.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-3 border-t border-white/10 text-center text-primary-400 font-medium hover:bg-white/5 cursor-pointer">
                                    View all activity
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 focus:outline-none cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 hover:opacity-90">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold tracking-wider shadow-md">
                                {user?.name.charAt(0)}
                            </div>
                            <svg className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-56 bg-[#091512] rounded-xl shadow-2xl border border-white/10 overflow-hidden text-sm">
                                <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                                    <p className="font-bold text-white">{user?.name}</p>
                                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                                </div>
                                <div className="py-2">
                                    <Link href="/admin/settings" className="flex items-center px-4 py-2 text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer font-medium">
                                        <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Account Settings
                                    </Link>
                                    <button onClick={() => { const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs'; adminFetch(`${API_URL}/api/auth/logout`, { method: 'POST' }).then(() => router.push('/admin/login')); }} className="w-full flex items-center px-4 py-2 text-red-400 hover:bg-red-500/10 text-left transition-colors cursor-pointer font-medium">
                                        <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-10 pt-28">
                    {children}
                </div>
            </main>
        </div>
    );
}
