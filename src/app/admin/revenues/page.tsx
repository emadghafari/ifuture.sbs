"use client";
import React, { useEffect, useState } from 'react';
import { adminFetch } from '@/utils/api';

export default function AdminRevenues() {
    const [revenues, setRevenues] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const [form, setForm] = useState({
        project_id: '',
        amount: '',
        description: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
            const [revRes, projRes] = await Promise.all([
                adminFetch(`${API_URL}/api/admin/revenues`),
                adminFetch(`${API_URL}/api/admin/projects`) // Needed to populate the dropdown
            ]);

            if (revRes.ok && projRes.ok) {
                setRevenues(await revRes.json());

                // Only show active or funding projects in the dropdown
                const allProjs = await projRes.json();
                setProjects(allProjs.filter((p: any) => p.status !== 'draft'));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
            const res = await adminFetch(`${API_URL}/api/admin/revenues`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                setForm({ project_id: '', amount: '', description: '' });
                setIsAddOpen(false);
                fetchData();
            } else {
                alert("Failed to save revenue. Check your inputs.");
            }
        } catch (error) {
            alert('An error occurred.');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteRevenue = async (id: number) => {
        if (!confirm('Are you sure you want to delete this revenue entry? It will remove dividends from investors.')) return;
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
            await adminFetch(`${API_URL}/api/admin/revenues/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            alert('Failed to delete.');
        }
    };

    if (isLoading) return <div className="text-white">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Project Revenues</h1>
                    <p className="text-slate-400 font-medium">Distribute profits and dividends to project investors.</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(4,120,87,0.3)] hover:shadow-[0_0_25px_rgba(4,120,87,0.5)] transform hover:-translate-y-0.5"
                >
                    + Declare Revenue
                </button>
            </div>

            {isAddOpen && (
                <div className="bg-[#091512]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in-up">
                    <h2 className="text-xl font-bold text-white mb-6">Distribute New Profit</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Select Project</label>
                                <select
                                    required
                                    value={form.project_id}
                                    onChange={e => setForm({ ...form, project_id: e.target.value })}
                                    className="w-full p-4 border border-white/10 bg-[#040D0A] text-white rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                                >
                                    <option value="">-- Choose Project --</option>
                                    {projects.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.title} (Target: ${Number(p.target_amount).toLocaleString()} | Shares: {p.total_shares})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Profit Amount ($)</label>
                                <input
                                    required
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={form.amount}
                                    onChange={e => setForm({ ...form, amount: e.target.value })}
                                    className="w-full text-white bg-[#040D0A] p-4 border border-white/10 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors font-mono"
                                    placeholder="e.g. 15000.00"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Description / Period</label>
                            <input
                                required
                                type="text"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="w-full text-white bg-[#040D0A] p-4 border border-white/10 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                                placeholder="e.g. Annual Profit for 2026"
                            />
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-white/10">
                            <button type="submit" disabled={isSaving} className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-medium py-3 px-8 rounded-xl transition-all">
                                {isSaving ? 'Distributing...' : 'Save & Distribute'}
                            </button>
                            <button type="button" onClick={() => setIsAddOpen(false)} className="bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-8 rounded-xl transition-all border border-white/10">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-[#091512] text-xs uppercase font-bold text-slate-400 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-5">Date</th>
                                <th className="px-6 py-5">Project</th>
                                <th className="px-6 py-5">Description</th>
                                <th className="px-6 py-5">Distributed Profit</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-base">
                            {revenues.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">No revenues have been declared yet.</td>
                                </tr>
                            ) : (
                                revenues.map(rev => (
                                    <tr key={rev.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-5 whitespace-nowrap text-slate-400">
                                            {new Date(rev.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5 font-bold text-white">
                                            {rev.project?.title || 'Unknown Project'}
                                        </td>
                                        <td className="px-6 py-5">
                                            {rev.description}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex items-center px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full font-bold font-mono text-sm shadow-sm">
                                                +${Number(rev.amount).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button onClick={() => deleteRevenue(rev.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors" title="Delete Entry">
                                                <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
