"use client";
import React, { useState, useEffect } from 'react';
import { adminFetch } from '@/utils/api';

export default function AdminProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const emptyProject = {
        title: '',
        slug: '',
        description: '',
        target_amount: 0,
        current_amount: 0,
        status: 'draft',
        url: '',
        total_shares: 1000,
        image: null
    };

    const fetchProjects = async () => {
        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        try {
            const res = await adminFetch(`${API_URL}/api/admin/projects`);
            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';

        const url = currentProject.id
            ? `${API_URL}/api/admin/projects/${currentProject.id}`
            : `${API_URL}/api/admin/projects`;

        const formData = new FormData();
        Object.keys(currentProject).forEach(key => {
            if (key === 'image' && currentProject[key] instanceof File) {
                formData.append(key, currentProject[key]);
            } else if (key !== 'image') {
                formData.append(key, currentProject[key]);
            }
        });

        try {
            const res = await adminFetch(url, {
                method: 'POST', // using POST instead of PUT because FormData doesnt work well with PUT in PHP without spoofing
                body: formData,
            });

            if (res.ok) {
                setIsEditing(false);
                fetchProjects();
            } else {
                alert("Failed to save project.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 font-sans">
            <div className="flex justify-between items-center bg-[#091512]/95 backdrop-blur border border-white/10 p-6 rounded-[2rem] shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-white">Crowdfunding Projects</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage active campaigns, edit details, and track funding progress.</p>
                </div>
                <button
                    onClick={() => { setCurrentProject(emptyProject); setIsEditing(true); }}
                    className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-2.5 rounded-xl font-bold hover:to-primary-400 transition-all shadow-[0_0_15px_rgba(4,120,87,0.4)] border border-primary-500/50 active:scale-95"
                >
                    + New Project
                </button>
            </div>

            {isEditing && (
                <div className="bg-[#091512]/95 backdrop-blur p-8 rounded-[2rem] shadow-sm border border-white/10">
                    <h2 className="text-xl font-bold mb-6 text-white">{currentProject.id ? 'Edit' : 'Create'} Project</h2>
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Title</label>
                                <input required type="text" value={currentProject.title} onChange={e => setCurrentProject({ ...currentProject, title: e.target.value })} className="w-full text-white bg-[#040D0A] p-4 border border-white/10 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Slug (URL friendly)</label>
                                <input
                                    required
                                    type="text"
                                    value={currentProject.slug}
                                    onChange={e => setCurrentProject({
                                        ...currentProject,
                                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                                    })}
                                    placeholder="e.g. card-system"
                                    className="w-full text-white bg-[#040D0A] p-4 border border-white/10 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Official Project URL (Optional)</label>
                                <input
                                    type="url"
                                    value={currentProject.url || ''}
                                    onChange={e => setCurrentProject({ ...currentProject, url: e.target.value })}
                                    placeholder="https://card.ifuture.sbs"
                                    className="w-full text-white bg-[#040D0A] p-4 border border-white/10 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Target Amount ($)</label>
                                <input required type="number" min="0" step="0.01" value={currentProject.target_amount} onChange={e => setCurrentProject({ ...currentProject, target_amount: parseFloat(e.target.value) })} className="w-full text-white bg-[#040D0A] p-4 border border-white/10 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors font-mono" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Total Shares Supply</label>
                                <input required type="number" min="1" step="1" value={currentProject.total_shares} onChange={e => setCurrentProject({ ...currentProject, total_shares: parseInt(e.target.value) })} className="w-full text-white bg-[#040D0A] p-4 border border-white/10 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors font-mono" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Status</label>
                                <select value={currentProject.status} onChange={e => setCurrentProject({ ...currentProject, status: e.target.value })} className="w-full p-4 border border-white/10 bg-[#040D0A] text-white rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors">
                                    <option value="draft">Draft</option>
                                    <option value="funding">Funding Phase</option>
                                    <option value="in_progress">In Progress (Active)</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
                            <textarea rows={4} value={currentProject.description} onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })} className="w-full p-4 border border-white/10 bg-[#040D0A] text-white rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors resize-y"></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Cover Image</label>
                            <div className="relative group">
                                <input type="file" accept="image/*" onChange={e => setCurrentProject({ ...currentProject, image: e.target.files?.[0] || null })} className="block w-full text-sm text-slate-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-500/20 file:text-primary-400 hover:file:bg-primary-500/30 file:transition-colors cursor-pointer border border-white/10 rounded-xl bg-[#040D0A] p-2" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 font-bold text-slate-400 bg-white/5 rounded-xl hover:bg-white/10 transition-colors active:scale-95">Cancel</button>
                            <button type="submit" className="px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:to-primary-400 shadow-[0_0_15px_rgba(4,120,87,0.4)] border border-primary-500/50 transition-all active:scale-95">Save Project</button>
                        </div>
                    </form>

                    {currentProject.id && (
                        <div className="mt-12 border-t border-white/10 pt-8">
                            <h3 className="text-xl font-bold mb-6 text-white">Timeline Stages</h3>
                            <StagesManager projectId={currentProject.id} initialStages={currentProject.stages || []} />
                        </div>
                    )}
                </div>
            )}

            {!isEditing && (
                <div className="bg-[#091512]/95 backdrop-blur rounded-[2rem] shadow-sm border border-white/10 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <th className="p-6">Project Info</th>
                                <th className="p-6">Status</th>
                                <th className="p-6">Funding Progress</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={4} className="p-8 text-center text-slate-500">Loading projects...</td></tr>
                            ) : projects.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-slate-500 italic">No projects found.</td></tr>
                            ) : (
                                projects.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-6 flex items-center gap-4">
                                            {p.image ? (
                                                <img src={process.env.NEXT_PUBLIC_API_URL + p.image} alt={p.title} className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.5)] bg-[#040D0A]" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 text-xs font-bold uppercase">{p.title?.charAt(0)}</div>
                                            )}
                                            <div>
                                                <div className="font-bold text-white text-base group-hover:text-primary-300 transition-colors">{p.title}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">/{p.slug}</div>
                                            </div>
                                        </td>
                                        <td className="p-6 capitalize text-sm">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${p.status === 'funding' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : p.status === 'completed' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-white/10 text-slate-300 border border-white/20'}`}>{p.status.replace('_', ' ')}</span>
                                        </td>
                                        <td className="p-6 w-1/3">
                                            <div className="flex justify-between items-end mb-2">
                                                <div className="text-xs font-bold text-slate-400">Raised <span className="text-white text-sm ml-1">${Number(p.current_amount).toLocaleString()}</span></div>
                                                <div className="text-[10px] font-bold text-primary-500 bg-primary-500/10 px-1.5 rounded">{Math.min(Math.round((p.current_amount / p.target_amount) * 100), 100)}%</div>
                                            </div>
                                            <div className="w-full bg-[#040D0A] border border-white/5 rounded-full h-1.5 overflow-hidden">
                                                <div className="bg-gradient-to-r from-primary-600 to-emerald-400 h-1.5 rounded-full shadow-[0_0_10px_rgba(4,120,87,0.8)] transition-all duration-1000" style={{ width: `${Math.min((p.current_amount / p.target_amount) * 100, 100)}%` }}></div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right space-x-2">
                                            <button onClick={() => { setCurrentProject(p); setIsEditing(true); }} className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 hover:bg-primary-500/20 hover:text-primary-300 border border-transparent hover:border-primary-500/30 transition-all text-sm font-bold active:scale-95">Edit</button>
                                            <button onClick={async () => {
                                                if (confirm('Are you sure you want to delete this project?')) {
                                                    await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/projects/${p.id}`, { method: 'DELETE' });
                                                    fetchProjects();
                                                }
                                            }} className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 hover:bg-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all text-sm font-bold active:scale-95">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function StagesManager({ projectId, initialStages }: { projectId: number, initialStages: any[] }) {
    const [stages, setStages] = useState(initialStages);
    const [newStage, setNewStage] = useState({ title: '', status: 'pending', description: '', order_index: stages.length });

    const fetchStages = async () => {
        const res = await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/projects/${projectId}`);
        const data = await res.json();
        setStages(Array.isArray(data?.stages) ? data.stages : []);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stages`, {
            method: 'POST',
            body: JSON.stringify({ ...newStage, project_id: projectId }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            setNewStage({ title: '', status: 'pending', description: '', order_index: stages.length + 1 });
            fetchStages();
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Delete stage?")) {
            await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stages/${id}`, { method: 'DELETE' });
            fetchStages();
        }
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stages/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
            headers: { 'Content-Type': 'application/json' }
        });
        fetchStages();
    };

    return (
        <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <form onSubmit={handleAdd} className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Stage Title</label>
                        <input required type="text" placeholder="e.g. Foundation" value={newStage.title} onChange={e => setNewStage({ ...newStage, title: e.target.value })} className="w-full p-3 text-sm border border-white/10 rounded-lg text-white bg-[#040D0A] focus:border-primary-500 outline-none" />
                    </div>
                    <div className="w-32">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Status</label>
                        <select value={newStage.status} onChange={e => setNewStage({ ...newStage, status: e.target.value })} className="w-full p-3 text-sm border border-white/10 rounded-lg text-white bg-[#040D0A] focus:border-primary-500 outline-none cursor-pointer">
                            <option value="pending">Pending</option>
                            <option value="in_progress">Active</option>
                            <option value="completed">Done</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-primary-600 border border-primary-500/50 text-white px-5 rounded-lg text-sm font-bold hover:bg-primary-500 transition shadow-[0_0_10px_rgba(4,120,87,0.3)] h-[46px] flex items-center justify-center hover:scale-105 active:scale-95">Add</button>
                </form>
            </div>

            <div className="space-y-3">
                {stages.map((stage: any, i: number) => (
                    <div key={stage.id} className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-[#040D0A] shadow-inner group hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-primary-400 flex items-center justify-center text-xs font-black shadow-[0_0_10px_rgba(4,120,87,0.1)]">{i + 1}</div>
                            <span className="font-bold text-white text-sm">{stage.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <select value={stage.status} onChange={e => handleUpdateStatus(stage.id, e.target.value)} className={`text-xs p-1.5 font-bold uppercase tracking-wider border border-white/10 rounded-md cursor-pointer outline-none ${stage.status === 'completed' ? 'bg-amber-500/20 text-amber-500' : stage.status === 'in_progress' ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-slate-400'}`}>
                                <option className="bg-[#040D0A] text-slate-300" value="pending">Pending</option>
                                <option className="bg-[#040D0A] text-slate-300" value="in_progress">Active</option>
                                <option className="bg-[#040D0A] text-slate-300" value="completed">Done</option>
                            </select>
                            <button onClick={() => handleDelete(stage.id)} className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 border border-transparent transition-all">✕</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
