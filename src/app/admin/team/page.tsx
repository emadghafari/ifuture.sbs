"use client";

import React, { useEffect, useState, useRef } from 'react';
import { adminFetch } from '@/utils/api';
import Image from 'next/image';

export default function AdminTeam() {
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('ar');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchTeam = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        try {
            const res = await adminFetch(`${API_URL}/api/admin/team`);
            if (!res.ok) {
                setTeam([]);
                setLoading(false);
                return;
            }
            const data = await res.json();
            setTeam(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch team", error);
            setTeam([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTeam(); }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        // Ensure we send to the correct URL whether adding or editing
        let url = editing.id ? `${API_URL}/api/admin/team/${editing.id}` : `${API_URL}/api/admin/team`;

        const formData = new FormData();
        formData.append('type', editing.type);
        formData.append('sort_order', editing.sort_order.toString());

        if (editing.facebook_url) formData.append('facebook_url', editing.facebook_url);
        if (editing.twitter_url) formData.append('twitter_url', editing.twitter_url);
        if (editing.linkedin_url) formData.append('linkedin_url', editing.linkedin_url);

        if (editing.new_photo_file) {
            formData.append('photo', editing.new_photo_file);
        }

        // Clean up translations to ensure no undefined values break JSON.stringify and Laravel validation
        const transArray = Array.isArray(editing.translations) ? editing.translations : [];
        const safeTranslations = transArray.map((t: any) => ({
            locale: t.locale,
            name: t.name || '',
            role: t.role || '',
            bio: t.bio || ''
        }));

        // Must stringify array data for FormData
        formData.append('translations', JSON.stringify(safeTranslations));

        try {
            const res = await adminFetch(url, {
                method: 'POST', // Native Fetch POST, Laravel intercepts _method field
                body: formData,
            });

            if (res.ok) {
                setEditing(null);
                fetchTeam();
            } else {
                const errorText = await res.text();
                let errorData: any = {};
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) { }
                console.error(`Save failed (Status: ${res.status}):`, errorText);
                alert(`Error saving team member! Status: ${res.status}\nMessage: ${errorData.message || errorText.substring(0, 100)}`);
            }
        } catch (error) {
            console.error("Network error:", error);
            alert('A network error occurred while saving.');
        }
    };

    const deleteMember = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        await adminFetch(`${API_URL}/api/admin/team/${id}`, { method: 'DELETE' });
        fetchTeam();
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setEditing({ ...editing, new_photo_file: file, preview_url: url });
        }
    };

    if (loading) return <div>Loading...</div>;

    const languages = [
        { code: 'ar', name: 'العربية', flag: '🇵🇸' },
        { code: 'he', name: 'עברית', flag: '🇮🇱' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
    ];

    const updateTrans = (locale: string, field: string, value: string) => {
        setEditing((prev: any) => {
            if (!prev) return prev;
            const newTrans = [...(prev.translations || [])];
            const idx = newTrans.findIndex(t => t.locale === locale);
            if (idx > -1) newTrans[idx] = { ...newTrans[idx], [field]: value };
            else newTrans.push({ locale, [field]: value });
            return { ...prev, translations: newTrans };
        });
    };

    const getPreviewImage = (m: any) => {
        if (m.preview_url) return m.preview_url;
        if (m.photo_path) {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
            return `${API_URL}${m.photo_path}`;
        }
        return null;
    };

    return (
        <div className="font-sans text-slate-300">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Team Members</h1>
                    <p className="text-slate-400">Manage your company team and leadership profiles.</p>
                </div>
                <button
                    onClick={() => setEditing({ type: 'developer', photo_path: '', sort_order: 0, facebook_url: '', twitter_url: '', linkedin_url: '', translations: languages.map(l => ({ locale: l.code, name: '', role: '', bio: '' })) })}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold hover:to-primary-400 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(4,120,87,0.4)] border border-primary-500/50"
                >
                    + Add Member
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                {team.map(m => {
                    const imgUrl = getPreviewImage(m);
                    return (
                        <div key={m.id} className="bg-[#091512]/95 backdrop-blur p-6 rounded-[2.5rem] shadow-sm border border-white/10 flex flex-col items-center text-center hover:bg-white/5 transition-colors group">
                            <div className="w-24 h-24 rounded-full bg-[#040D0A] mb-6 flex items-center justify-center text-4xl border-[3px] border-white/10 shadow-[0_0_15px_rgba(4,120,87,0.2)] group-hover:shadow-[0_0_20px_rgba(4,120,87,0.4)] group-hover:border-primary-500/50 transition-all duration-500 font-black text-primary-400 relative overflow-hidden">
                                {imgUrl ? (
                                    <img src={imgUrl} alt="Photo" className="w-full h-full object-cover" />
                                ) : (
                                    (m.translations || []).find((t: any) => t.locale === 'en')?.name?.charAt(0) || 'T'
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-300 transition-colors">{(m.translations || []).find((t: any) => t.locale === 'en')?.name || 'Unnamed'}</h3>
                            <p className="text-primary-500 font-black text-[0.65rem] uppercase tracking-widest mb-6">{(m.translations || []).find((t: any) => t.locale === 'en')?.role || m.type}</p>

                            <div className="flex space-x-3 mt-auto w-full">
                                <button onClick={() => setEditing({ ...m, translations: Array.isArray(m.translations) ? m.translations : [] })} className="flex-1 py-3 rounded-xl bg-white/5 text-slate-300 font-bold text-xs hover:bg-primary-500/20 hover:text-primary-300 border border-transparent hover:border-primary-500/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">Edit</button>
                                <button onClick={() => deleteMember(m.id)} className="flex-1 py-3 rounded-xl bg-white/5 text-slate-300 font-bold text-xs hover:bg-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">Remove</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {editing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#040D0A]/80 backdrop-blur-md p-4">
                    <div className="bg-[#091512] border border-white/10 rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-2xl font-bold text-white">{editing.id ? 'Edit' : 'Add'} Team Member</h2>
                            <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer text-2xl leading-none">✕</button>
                        </div>

                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 sm:p-12">

                            {/* Profile Image Upload */}
                            <div className="flex items-center gap-8 mb-10 pb-10 border-b border-white/10">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-32 h-32 rounded-full border-[3px] border-white/5 bg-[#040D0A] flex items-center justify-center cursor-pointer hover:border-primary-500 transition-all overflow-hidden relative group shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                                >
                                    {getPreviewImage(editing) ? (
                                        <img src={getPreviewImage(editing)} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl text-slate-500 group-hover:text-primary-400">+</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-xs font-bold uppercase tracking-wider">Upload</span>
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handlePhotoSelect} className="hidden" accept="image/*" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Profile Picture</h3>
                                    <p className="text-sm text-slate-400">Upload a professional headshot. Recommended 500x500px.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-10">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Member Type Category</label>
                                    <select value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value })} className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors">
                                        <option className="bg-[#040D0A] text-slate-300" value="founder">Founder / Executive</option>
                                        <option className="bg-[#040D0A] text-slate-300" value="developer">Developer / Engineer</option>
                                        <option className="bg-[#040D0A] text-slate-300" value="manager">Manager / Coordinator</option>
                                        <option className="bg-[#040D0A] text-slate-300" value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">List Display Order (0 is first)</label>
                                    <input type="number" value={editing.sort_order} onChange={e => setEditing({ ...editing, sort_order: parseInt(e.target.value) })} className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" />
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden mb-10">
                                <div className="flex border-b border-white/10 relative">
                                    {languages.map(l => (
                                        <button type="button" key={l.code} onClick={() => setActiveTab(l.code)} className={`px-8 py-5 font-bold text-sm transition-all duration-300 cursor-pointer border-b-2 ${activeTab === l.code ? 'border-primary-500 text-primary-400 bg-white/5' : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-300'}`}>
                                            <span className="mr-2">{l.flag}</span> {l.name}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-8 space-y-6 bg-transparent">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-300 mb-2">Display Name ({activeTab.toUpperCase()})</label>
                                            <input type="text" required value={(editing.translations || []).find((t: any) => t.locale === activeTab)?.name || ''} onChange={e => updateTrans(activeTab, 'name', e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-[#040D0A]/50 border border-white/10 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-300 mb-2">Job Title / Role ({activeTab.toUpperCase()})</label>
                                            <input type="text" required value={(editing.translations || []).find((t: any) => t.locale === activeTab)?.role || ''} onChange={e => updateTrans(activeTab, 'role', e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-[#040D0A]/50 border border-white/10 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Short Biography ({activeTab.toUpperCase()})</label>
                                        <textarea rows={3} value={(editing.translations || []).find((t: any) => t.locale === activeTab)?.bio || ''} onChange={e => updateTrans(activeTab, 'bio', e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-[#040D0A]/50 border border-white/10 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none transition-colors"></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button type="button" onClick={() => setEditing(null)} className="px-8 py-4 rounded-2xl font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">Cancel</button>
                                <button type="submit" className="px-10 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold hover:to-primary-400 shadow-[0_0_20px_rgba(4,120,87,0.4)] border border-primary-500/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">Save Member Profile</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
