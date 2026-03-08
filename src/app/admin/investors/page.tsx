"use client";
import React, { useEffect, useState } from 'react';
import { adminFetch } from '@/utils/api';

export default function AdminInvestorsPage() {
    const [investors, setInvestors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInvestors = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
                const res = await adminFetch(`${API_URL}/api/admin/investors`);
                if (!res.ok) throw new Error('Failed to fetch investors');
                const data = await res.json();
                setInvestors(data);
            } catch (err) {
                setError('Could not load investors data. Ensure backend is reachable.');
            } finally {
                setLoading(false);
            }
        };

        fetchInvestors();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-6">
            <div className="flex justify-between items-center bg-[#091512]/95 backdrop-blur border border-white/10 p-6 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-white">Investor Profiles</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage and track all registered end-users and their project capital contributions.</p>
                </div>
                <div className="px-4 py-2 bg-primary-600/20 text-primary-400 rounded-lg text-sm font-bold border border-primary-500/20 shadow-[0_0_10px_rgba(4,120,87,0.2)]">
                    Total Registered: {investors.length}
                </div>
            </div>

            <div className="bg-[#091512]/95 backdrop-blur rounded-2xl border border-white/10 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-slate-300 text-xs uppercase tracking-wider font-bold">
                                <th className="p-4 border-b border-white/10">Investor details</th>
                                <th className="p-4 border-b border-white/10">Total Backed</th>
                                <th className="p-4 border-b border-white/10">Project Portfolio</th>
                                <th className="p-4 border-b border-white/10">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {investors.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500 italic">No investors registered yet.</td>
                                </tr>
                            ) : (
                                investors.map((investor) => {
                                    const totalInvested = investor.investments?.reduce((acc: number, val: any) => acc + Number(val.amount), 0) || 0;

                                    return (
                                        <tr key={investor.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-emerald-400 flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(4,120,87,0.3)] border border-[#040D0A]">
                                                        {investor.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-primary-300 transition-colors">{investor.name}</div>
                                                        <div className="text-sm text-slate-400">{investor.email}</div>
                                                        <div className="text-[0.65rem] font-medium text-slate-500 mt-0.5">ID: #{investor.id}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <div className="font-black text-primary-400">${totalInvested.toLocaleString()}</div>
                                                <div className="text-xs text-slate-400 font-medium">{investor.investments?.length || 0} transaction(s)</div>
                                            </td>

                                            <td className="p-4">
                                                {investor.investments && investor.investments.length > 0 ? (
                                                    <div className="flex flex-col gap-2">
                                                        {investor.investments.map((inv: any) => (
                                                            <div key={inv.id} className="flex items-center justify-between bg-primary-900/20 rounded px-3 py-1.5 border border-primary-500/20 inline-block w-fit min-w-[200px]">
                                                                <span className="text-xs font-bold text-slate-300 truncate max-w-[120px]" title={inv.project?.title || 'Unknown Project'}>
                                                                    {inv.project?.title || 'Unknown Project'}
                                                                </span>
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <span className="text-xs font-black text-primary-400 bg-white/5 px-2 py-0.5 rounded shadow-sm border border-white/10">
                                                                        ${Number(inv.amount).toLocaleString()}
                                                                    </span>
                                                                    {inv.contract_pdf_path && (
                                                                        <a href={inv.contract_pdf_path.startsWith('http') ? inv.contract_pdf_path : `https://api.ifuture.sbs/api/public/contracts/${inv.contract_pdf_path.split('/').pop()}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded hover:bg-emerald-500/20 transition-colors" title="Download Contract">
                                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                                            Contract PDF
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-500 italic">No investments yet</span>
                                                )}
                                            </td>

                                            <td className="p-4 text-sm text-slate-400 font-medium">
                                                {new Date(investor.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
