"use client";

import React, { useEffect, useState } from 'react';
import { adminFetch } from '@/utils/api';

export default function AdminMessages() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        adminFetch(`${API_URL}/api/admin/messages`)
            .then(res => res.json())
            .then(data => {
                setMessages(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Inquiries</h1>
                <p className="text-slate-500">Messages sent from the contact form.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-sm font-bold text-slate-700 uppercase tracking-widest">Name</th>
                                <th className="px-8 py-6 text-sm font-bold text-slate-700 uppercase tracking-widest">Contact Info</th>
                                <th className="px-8 py-6 text-sm font-bold text-slate-700 uppercase tracking-widest">Message</th>
                                <th className="px-8 py-6 text-sm font-bold text-slate-700 uppercase tracking-widest">Language</th>
                                <th className="px-8 py-6 text-sm font-bold text-slate-700 uppercase tracking-widest text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {messages.map((msg) => (
                                <tr key={msg.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-slate-900">{msg.name}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm text-slate-600">{msg.email}</p>
                                        <p className="text-xs text-slate-400 mt-1">{msg.phone || 'No phone'}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">{msg.message}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest">
                                            {msg.locale}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <p className="text-sm text-slate-500">{new Date(msg.created_at).toLocaleDateString()}</p>
                                    </td>
                                </tr>
                            ))}
                            {messages.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-slate-400 italic">No messages found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
