"use client";
import React, { useEffect, useState } from 'react';
import { adminFetch } from '@/utils/api';

export default function Dashboard() {
    const [apiStats, setApiStats] = useState<any>({ products: 0, team: 0, messages_total: 0, messages_unread: 0, status: 'Healthy', uptime: '99.9%' });
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        adminFetch(`${API_URL}/api/auth/user`).then(r => r.json()).then(setUser);
        adminFetch(`${API_URL}/api/admin/dashboard/stats`).then(r => r.json()).then(setApiStats);
    }, []);

    return (
        <div className="w-full h-full font-sans text-slate-300">

            {/* Top Navigation / Title Area */}
            <div className="pb-0 border-b border-white/10">
                <div className="flex justify-between items-center mb-8 pt-8 px-8">
                    <h1 className="text-2xl font-bold tracking-tight text-white">System Profile</h1>
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.location.href = '/admin/products'} className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 shadow-[0_0_15px_rgba(4,120,87,0.4)] hover:shadow-[0_0_20px_rgba(4,120,87,0.6)] hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center gap-2">
                            <span className="text-lg leading-none mb-0.5">+</span> Add product
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-8 text-sm font-medium text-slate-400 border-b-2 border-transparent px-8">
                    <button className="text-primary-400 border-b-2 border-primary-500 pb-3 -mb-[2px] px-1 hover:text-primary-300 transition-colors cursor-pointer active:scale-95">Overview</button>
                    <button className="hover:text-primary-400 pb-3 px-1 transition-colors cursor-pointer active:scale-95">Products</button>
                    <button className="hover:text-primary-400 pb-3 px-1 transition-colors cursor-pointer active:scale-95">Team Activity</button>
                    <button className="hover:text-primary-400 pb-3 px-1 transition-colors cursor-pointer active:scale-95">Messages</button>
                    <button className="hover:text-primary-400 pb-3 px-1 transition-colors cursor-pointer active:scale-95">Performance</button>
                    <button className="hover:text-primary-400 pb-3 px-1 transition-colors cursor-pointer active:scale-95">Files</button>
                </div>
            </div>

            {/* Split Content Area */}
            <div className="flex flex-col lg:flex-row px-8">

                {/* Left Column (Profile info) */}
                <div className="w-full lg:w-[320px] py-10 pr-10 border-r border-white/10 lg:min-h-[calc(100vh-140px)]">

                    {/* Main Avatar & Name */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 overflow-hidden shadow-inner flex items-center justify-center border-4 border-[#040D0A] shadow-[0_0_15px_rgba(4,120,87,0.3)]">
                            <span className="text-3xl font-bold text-white">{user?.name?.charAt(0) || 'A'}</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-white">{user?.name || 'Administrator'}</h2>
                            <p className="text-sm text-primary-500 font-medium tracking-wide">#SYS{user?.id ? user.id.toString().padStart(6, '0') : '000101'}</p>
                        </div>
                        <button className="ml-auto text-slate-500 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" /></svg>
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* About Section */}
                        <div>
                            <h3 className="text-sm font-bold text-white mb-4">About</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    <span className="text-slate-400 w-16">Phone:</span>
                                    <span className="font-medium text-white">System Default</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    <span className="text-slate-400 w-16">Email:</span>
                                    <span className="font-medium text-white truncate">{user?.email || 'admin@ifuture.sbs'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Address Placeholder */}
                        <div>
                            <h3 className="text-sm font-bold text-white mb-4">Server Address</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <svg className="w-4 h-4 text-slate-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z" /></svg>
                                    <span className="text-slate-400 w-20 flex-shrink-0">Location:</span>
                                    <span className="font-medium text-white">Data Center 1, AWS</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-4 h-4 text-slate-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                    <span className="text-slate-400 w-20 flex-shrink-0">IP Address:</span>
                                    <span className="font-medium text-white">127.0.0.1</span>
                                </div>
                            </div>
                        </div>

                        {/* Employee Details / System details */}
                        <div>
                            <h3 className="text-sm font-bold text-white mb-4">System details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <span className="text-slate-400 w-24">Created:</span>
                                    <span className="font-medium text-white">{new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                                    <span className="text-slate-400 w-24">Role:</span>
                                    <span className="font-medium text-white">Super Admin</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Data tables) */}
                <div className="flex-1 py-10 pl-10 min-w-0">

                    {/* Database Hub Information Table */}
                    <div className="mb-14">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-base font-bold text-white">Database information</h3>
                            <button className="text-primary-500 font-semibold text-sm flex items-center gap-1 hover:text-primary-400 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                                <span>+</span> Add stat
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">Entity Type</th>
                                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">Module</th>
                                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">Active Count</th>
                                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">Last Updated</th>
                                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">Status</th>
                                        <th className="pb-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr className="hover:bg-white/5 transition-colors group">
                                        <td className="py-5 font-bold text-white">Products Catalog</td>
                                        <td className="py-5 text-slate-400">Core Services</td>
                                        <td className="py-5 text-white font-medium">{apiStats.products} Items</td>
                                        <td className="py-5 text-slate-400">Live Sync</td>
                                        <td className="py-5 text-primary-500 font-bold">{apiStats.status}</td>
                                        <td className="py-5 text-right"><button onClick={() => window.location.href = '/admin/products'} className="text-primary-400 border border-primary-500/20 font-bold text-xs uppercase px-3 py-2 rounded-md hover:bg-primary-500/10 hover:text-primary-300 transition-all duration-300 cursor-pointer active:scale-95 opacity-80 group-hover:opacity-100">Manage</button></td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors group">
                                        <td className="py-5 font-bold text-white">Team Members</td>
                                        <td className="py-5 text-slate-400">Management</td>
                                        <td className="py-5 text-white font-medium">{apiStats.team} Profiles</td>
                                        <td className="py-5 text-slate-400">Live Sync</td>
                                        <td className="py-5 text-primary-500 font-bold">{apiStats.status}</td>
                                        <td className="py-5 text-right"><button onClick={() => window.location.href = '/admin/team'} className="text-primary-400 border border-primary-500/20 font-bold text-xs uppercase px-3 py-2 rounded-md hover:bg-primary-500/10 hover:text-primary-300 transition-all duration-300 cursor-pointer active:scale-95 opacity-80 group-hover:opacity-100">Manage</button></td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors group">
                                        <td className="py-5 font-bold text-white">Inbound Messages</td>
                                        <td className="py-5 text-slate-400">Public Front</td>
                                        <td className="py-5 text-white font-medium">{apiStats.messages_unread} Unread</td>
                                        <td className="py-5 text-slate-400">Total: {apiStats.messages_total}</td>
                                        <td className="py-5 text-amber-500 font-bold">Pending</td>
                                        <td className="py-5 text-right"><button onClick={() => window.location.href = '/admin/messages'} className="text-primary-400 border border-primary-500/20 font-bold text-xs uppercase px-3 py-2 rounded-md hover:bg-primary-500/10 hover:text-primary-300 transition-all duration-300 cursor-pointer active:scale-95 opacity-80 group-hover:opacity-100">Review</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Lower Split Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* Activity */}
                        <div>
                            <h3 className="text-base font-bold text-white mb-6">Activity</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-400 flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-[0_0_10px_rgba(4,120,87,0.3)]">SYS</div>
                                    <div>
                                        <p className="text-sm">
                                            <span className="font-bold text-white">System Backup</span> <span className="text-slate-400">completed automatically on</span> <span className="font-medium text-primary-400">Today</span>
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">05:36 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <img src="https://ui-avatars.com/api/?name=E+G&background=F59E0B&color=fff" className="w-10 h-10 rounded-full flex-shrink-0 ring-2 ring-primary-500/30 shadow-[0_0_10px_rgba(4,120,87,0.3)]" alt="avatar" />
                                    <div>
                                        <p className="text-sm">
                                            <span className="font-bold text-white">Admin Emad</span> <span className="text-slate-400">updated product pricing on</span> <span className="font-medium text-primary-400">Sep 08, 2026</span>
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">03:12 PM</p>
                                    </div>
                                </div>
                            </div>
                            <button className="text-sm font-semibold text-primary-500 hover:text-primary-400 mt-6 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">View all</button>
                        </div>

                        {/* Resource Usage (Compensation equivalent) */}
                        <div>
                            <h3 className="text-base font-bold text-white mb-6">Resources</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm font-bold text-white">{apiStats.uptime} Uptime</p>
                                    <p className="text-xs text-slate-400 mt-1">Effective date on {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">1.2 GB Storage Used</p>
                                    <p className="text-xs text-slate-400 mt-1">Effective date on {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">MySQL Database {apiStats.status}</p>
                                    <p className="text-xs text-slate-400 mt-1">Checked recently</p>
                                </div>
                            </div>
                            <button className="text-sm font-semibold text-primary-500 hover:text-primary-400 mt-6 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">View all</button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
