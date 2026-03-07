"use client";
import React, { useState, useEffect } from 'react';
import { adminFetch } from '@/utils/api';

export default function AdminInvestments() {
    const [investments, setInvestments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchInvestments = async () => {
        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        try {
            const res = await adminFetch(`${API_URL}/api/admin/investments`);
            const data = await res.json();
            setInvestments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchInvestments();
    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Investment Ledger</h1>
                <div className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-inner">
                    Total Volume: <span className="text-emerald-600 font-bold ml-1">${(Array.isArray(investments) ? investments : []).reduce((acc, inv) => acc + Number(inv?.amount || 0), 0).toLocaleString()}</span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-sm font-semibold text-slate-600">
                            <th className="p-4">Transaction ID</th>
                            <th className="p-4">Investor</th>
                            <th className="p-4">Project</th>
                            <th className="p-4 text-right">Amount</th>
                            <th className="p-4 text-center">Gateway</th>
                            <th className="p-4 text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="p-4 text-center text-slate-500">Loading ledger...</td></tr>
                        ) : investments.length === 0 ? (
                            <tr><td colSpan={6} className="p-4 text-center text-slate-500">No investments recorded yet.</td></tr>
                        ) : (
                            (Array.isArray(investments) ? investments : []).map((inv) => (
                                <tr key={inv.id} className="border-b border-slate-50 font-medium text-slate-600 last:border-none hover:bg-slate-50/50 transition">
                                    <td className="p-4">
                                        <div className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block border border-slate-200 w-[120px] truncate" title={inv.transaction_id}>
                                            {inv.transaction_id}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-semibold text-slate-800">{inv.user?.name || 'Unknown'}</div>
                                        <div className="text-xs text-slate-400">{inv.user?.email || 'N/A'}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {inv.project?.image && <div className="w-6 h-6 rounded bg-slate-200 bg-cover bg-center shrink-0 border border-slate-200" style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}${inv.project.image})` }}></div>}
                                            <span className="text-sm truncate max-w-[150px] block" title={inv.project?.title}>{inv.project?.title || 'Deleted Project'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">${Number(inv.amount).toLocaleString()}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {inv.gateway === 'stripe' ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M13.976 9.15c-2.172-.806-3.356-1.143-3.356-1.781 0-.629.563-1.01 1.638-1.01 1.761 0 3.323.513 4.542 1.258l1.343-4.14C16.892 2.7 15.012 2 12.872 2 7.72 2 4.414 4.887 4.414 8.65c0 5.4 7.23 5.483 7.23 7.375 0 .684-.666 1.134-1.849 1.134-1.956 0-3.952-.777-5.545-1.781l-1.371 4.239C4.54 20.843 6.64 21.6 9.117 21.6c5.29 0 8.705-2.81 8.705-6.75 0-5.63-7.23-5.65-7.23-7.46-.02-.128 2.62-1.636.002-.556L10.6 6.83l-3.356 2.32z" /></svg> Stripe
                                            </span>
                                        ) : inv.gateway === 'paypal' ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z" /></svg> PayPal
                                            </span>
                                        ) : (
                                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded capitalize">{inv.gateway}</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right text-sm text-slate-500">
                                        {new Date(inv.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
