"use client";

import React, { useEffect, useState, useRef } from 'react';
import { adminFetch } from '@/utils/api';

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('ar');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchProducts = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        const res = await adminFetch(`${API_URL}/api/admin/products`);
        const data = await res.json();
        setProducts(data);
        setLoading(false);
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        const url = editing.id ? `${API_URL}/api/admin/products/${editing.id}` : `${API_URL}/api/admin/products`;

        const formData = new FormData();
        formData.append('slug', editing.slug);
        formData.append('url', editing.url || '');
        formData.append('status', editing.status ? '1' : '0');
        formData.append('featured', editing.featured ? '1' : '0');
        formData.append('sort_order', editing.sort_order.toString());

        if (editing.new_image_file) {
            formData.append('image', editing.new_image_file);
        }

        const safeTranslations = editing.translations.map((t: any) => ({
            locale: t.locale,
            title: t.title || '',
            description: t.description || ''
        }));
        formData.append('translations', JSON.stringify(safeTranslations));

        const res = await adminFetch(url, {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            setEditing(null);
            fetchProducts();
        } else {
            console.error("Save failed", await res.text());
        }
    };

    const deleteProduct = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        await adminFetch(`${API_URL}/api/admin/products/${id}`, { method: 'DELETE' });
        fetchProducts();
    };

    if (loading) return <div>Loading...</div>;

    const languages = [
        { code: 'ar', name: 'العربية', flag: '🇵🇸' },
        { code: 'he', name: 'עברית', flag: '🇮🇱' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
    ];

    const getTrans = (p: any, locale: string) => p.translations.find((t: any) => t.locale === locale) || { title: '', description: '' };

    const updateTrans = (locale: string, field: string, value: string) => {
        setEditing((prev: any) => {
            const newTrans = [...(prev.translations || [])];
            const idx = newTrans.findIndex(t => t.locale === locale);
            if (idx > -1) newTrans[idx] = { ...newTrans[idx], [field]: value };
            else newTrans.push({ locale, [field]: value });
            return { ...prev, translations: newTrans };
        });
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setEditing({ ...editing, new_image_file: file, preview_url: url });
        }
    };

    const getPreviewImage = (p: any) => {
        if (p.preview_url) return p.preview_url;
        if (p.image_path) {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
            return `${API_URL}${p.image_path}`;
        }
        return null;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Products</h1>
                    <p className="text-slate-500">Manage your product listings across all languages.</p>
                </div>
                <button
                    onClick={() => setEditing({ slug: '', url: '', status: true, featured: false, sort_order: 0, translations: languages.map(l => ({ locale: l.code, title: '', description: '' })) })}
                    className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-blue-200"
                >
                    + Add Product
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-8 py-6 text-left">Product</th>
                            <th className="px-8 py-6 text-left">Status</th>
                            <th className="px-8 py-6 text-left">Order</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50/50">
                                <td className="px-8 py-6">
                                    <p className="font-bold text-slate-900">{getTrans(p, 'en').title || p.slug}</p>
                                    <p className="text-xs text-slate-400">{p.url}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${p.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {p.status ? 'Active' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 font-medium">{p.sort_order}</td>
                                <td className="px-8 py-6 text-right space-x-2 flex justify-end">
                                    <button onClick={() => setEditing(p)} className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer">✏️</button>
                                    <button onClick={() => deleteProduct(p.id)} className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer">🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-2xl font-bold">{editing.id ? 'Edit' : 'Add'} Product</h2>
                            <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer text-2xl leading-none">✕</button>
                        </div>

                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-12">
                            {/* Product Image Upload */}
                            <div className="flex items-center gap-8 mb-10 pb-10 border-b border-slate-100">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-48 h-32 rounded-2xl border-4 border-slate-50 bg-slate-100 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-all overflow-hidden relative group shadow-md"
                                >
                                    {getPreviewImage(editing) ? (
                                        <img src={getPreviewImage(editing)} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl text-slate-400 group-hover:text-blue-500">+</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-xs font-bold uppercase tracking-wider">Upload Cover</span>
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handlePhotoSelect} className="hidden" accept="image/*" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Product Cover Image</h3>
                                    <p className="text-sm text-slate-500">Upload a high quality wide image (e.g. 1200x800px) that showcases your product or system. Leave empty to use default icon.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-10">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Slug</label>
                                    <input type="text" required value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">URL</label>
                                    <input type="text" value={editing.url} onChange={e => setEditing({ ...editing, url: e.target.value })} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none" />
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-3xl p-8 mb-10">
                                <div className="flex space-x-4 mb-8">
                                    {languages.map(l => (
                                        <button type="button" key={l.code} onClick={() => setActiveTab(l.code)} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer ${activeTab === l.code ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-100'}`}>
                                            {l.flag} {l.name}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Title ({activeTab.toUpperCase()})</label>
                                        <input type="text" required value={editing.translations.find((t: any) => t.locale === activeTab)?.title || ''} onChange={e => updateTrans(activeTab, 'title', e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Description ({activeTab.toUpperCase()})</label>
                                        <textarea rows={4} value={editing.translations.find((t: any) => t.locale === activeTab)?.description || ''} onChange={e => updateTrans(activeTab, 'description', e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 outline-none resize-none"></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button type="button" onClick={() => setEditing(null)} className="px-8 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">Cancel</button>
                                <button type="submit" className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
