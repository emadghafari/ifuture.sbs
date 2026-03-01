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
        <div className="w-full h-full font-sans text-[#111111]">

            {/* Top Navigation / Title Area */}
            <div className="pb-0 border-b border-slate-200">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight">System Profile</h1>
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.location.href = '/admin/products'} className="bg-[#0f172a] hover:bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center gap-2">
                            <span className="text-lg leading-none mb-0.5">+</span> Add product
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-8 text-sm font-medium text-slate-500 border-b-2 border-transparent">
                    <button className="text-slate-900 border-b-2 border-slate-900 pb-3 -mb-[2px] px-1 hover:text-blue-600 transition-colors cursor-pointer active:scale-95">Overview</button>
                    <button className="hover:text-blue-600 pb-3 px-1 transition-colors cursor-pointer active:scale-95">Products</button>
                    <button className="hover:text-blue-600 pb-3 px-1 transition-colors cursor-pointer active:scale-95">Team Activity</button>
                    <button className="hover:text-blue-600 pb-3 px-1 transition-colors cursor-pointer active:scale-95">Messages</button>
                    <button className="hover:text-blue-600 pb-3 px-1 transition-colors cursor-pointer active:scale-95">Performance</button>
                    <button className="hover:text-blue-600 pb-3 px-1 transition-colors cursor-pointer active:scale-95">Files</button>
                </div>
            </div>

            {/* Split Content Area */}
            <div className="flex flex-col lg:flex-row">

                {/* Left Column (Profile info) */}
                <div className="w-full lg:w-[320px] py-10 pr-10 border-r border-slate-200 lg:min-h-[calc(100vh-140px)]">

                    {/* Main Avatar & Name */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 overflow-hidden shadow-inner flex items-center justify-center border-4 border-white shadow-md">
                            <span className="text-3xl font-bold text-white">{user?.name?.charAt(0) || 'A'}</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">{user?.name || 'Administrator'}</h2>
                            <p className="text-sm text-slate-400 font-medium tracking-wide">#SYS{user?.id ? user.id.toString().padStart(6, '0') : '000101'}</p>
                        </div>
                        <button className="ml-auto text-slate-300 hover:text-slate-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" /></svg>
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* About Section */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 mb-4">About</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    <span className="text-slate-500 w-16">Phone:</span>
                                    <span className="font-medium">System Default</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    <span className="text-slate-500 w-16">Email:</span>
                                    <span className="font-medium text-slate-900 truncate">{user?.email || 'admin@ifuture.com'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Address Placeholder */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 mb-4">Server Address</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <svg className="w-4 h-4 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z" /></svg>
                                    <span className="text-slate-500 w-20 flex-shrink-0">Location:</span>
                                    <span className="font-medium">Data Center 1, AWS</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-4 h-4 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                    <span className="text-slate-500 w-20 flex-shrink-0">IP Address:</span>
                                    <span className="font-medium">127.0.0.1</span>
                                </div>
                            </div>
                        </div>

                        {/* Employee Details / System details */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 mb-4">System details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <span className="text-slate-500 w-24">Created:</span>
                                    <span className="font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                                    <span className="text-slate-500 w-24">Role:</span>
                                    <span className="font-medium text-slate-900">Super Admin</span>
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
                            <h3 className="text-base font-bold text-slate-900">Database information</h3>
                            <button className="text-orange-600 font-semibold text-sm flex items-center gap-1 hover:text-orange-700 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                                <span>+</span> Add stat
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Entity Type</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Module</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Active Count</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Last Updated</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Status</th>
                                        <th className="pb-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-5 font-medium text-slate-900">Products Catalog</td>
                                        <td className="py-5 text-slate-500">Core Services</td>
                                        <td className="py-5 text-slate-900 font-medium">{apiStats.products} Items</td>
                                        <td className="py-5 text-slate-500">Live Sync</td>
                                        <td className="py-5 text-emerald-500 font-bold">{apiStats.status}</td>
                                        <td className="py-5 text-right"><button onClick={() => window.location.href = '/admin/products'} className="text-indigo-600 font-bold text-xs uppercase px-3 py-2 rounded-md hover:bg-indigo-50 hover:text-indigo-800 transition-all duration-300 cursor-pointer active:scale-95 opacity-80 group-hover:opacity-100">Manage</button></td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-5 font-medium text-slate-900">Team Members</td>
                                        <td className="py-5 text-slate-500">Management</td>
                                        <td className="py-5 text-slate-900 font-medium">{apiStats.team} Profiles</td>
                                        <td className="py-5 text-slate-500">Live Sync</td>
                                        <td className="py-5 text-emerald-500 font-bold">{apiStats.status}</td>
                                        <td className="py-5 text-right"><button onClick={() => window.location.href = '/admin/team'} className="text-indigo-600 font-bold text-xs uppercase px-3 py-2 rounded-md hover:bg-indigo-50 hover:text-indigo-800 transition-all duration-300 cursor-pointer active:scale-95 opacity-80 group-hover:opacity-100">Manage</button></td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-5 font-medium text-slate-900">Inbound Messages</td>
                                        <td className="py-5 text-slate-500">Public Front</td>
                                        <td className="py-5 text-slate-900 font-medium">{apiStats.messages_unread} Unread</td>
                                        <td className="py-5 text-slate-500">Total: {apiStats.messages_total}</td>
                                        <td className="py-5 text-amber-500 font-bold">Pending</td>
                                        <td className="py-5 text-right"><button onClick={() => window.location.href = '/admin/messages'} className="text-indigo-600 font-bold text-xs uppercase px-3 py-2 rounded-md hover:bg-indigo-50 hover:text-indigo-800 transition-all duration-300 cursor-pointer active:scale-95 opacity-80 group-hover:opacity-100">Review</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Lower Split Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* Activity */}
                        <div>
                            <h3 className="text-base font-bold text-slate-900 mb-6">Activity</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">SYS</div>
                                    <div>
                                        <p className="text-sm">
                                            <span className="font-bold text-slate-900">System Backup</span> <span className="text-slate-500">completed automatically on</span> <span className="font-medium text-slate-900">Today</span>
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">05:36 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <img src="https://ui-avatars.com/api/?name=E+G&background=F59E0B&color=fff" className="w-10 h-10 rounded-full flex-shrink-0" alt="avatar" />
                                    <div>
                                        <p className="text-sm">
                                            <span className="font-bold text-slate-900">Admin Emad</span> <span className="text-slate-500">updated product pricing on</span> <span className="font-medium text-slate-900">Sep 08, 2026</span>
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">03:12 PM</p>
                                    </div>
                                </div>
                            </div>
                            <button className="text-sm font-semibold text-red-500 hover:text-red-700 mt-6 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">View all</button>
                        </div>

                        {/* Resource Usage (Compensation equivalent) */}
                        <div>
                            <h3 className="text-base font-bold text-slate-900 mb-6">Resources</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{apiStats.uptime} Uptime</p>
                                    <p className="text-xs text-slate-400 mt-1">Effective date on {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">1.2 GB Storage Used</p>
                                    <p className="text-xs text-slate-400 mt-1">Effective date on {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">MySQL Database {apiStats.status}</p>
                                    <p className="text-xs text-slate-400 mt-1">Checked recently</p>
                                </div>
                            </div>
                            <button className="text-sm font-semibold text-red-500 hover:text-red-700 mt-6 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">View all</button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
