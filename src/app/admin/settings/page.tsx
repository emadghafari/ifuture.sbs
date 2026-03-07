"use client";

import React, { useEffect, useState, useRef } from 'react';
import { adminFetch } from '@/utils/api';
import Image from 'next/image';

export default function AdminSettings() {
    const [settings, setSettings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Master Tabs state
    type MainTab = 'global' | 'localized' | 'integrations';
    const [activeMainTab, setActiveMainTab] = useState<MainTab>('global');

    const [activeTab, setActiveTab] = useState('en');
    const [stripeMode, setStripeMode] = useState<'test' | 'live'>('test');
    const [paypalMode, setPaypalMode] = useState<'test' | 'live'>('test');

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const ogInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);

    const fetchSettings = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        const res = await adminFetch(`${API_URL}/api/admin/settings`);
        const data = await res.json();
        setSettings(data);

        const logoSetting = data.find((s: any) => s.key === 'site_logo');
        if (logoSetting && logoSetting.value) setLogoPreview(API_URL + logoSetting.value);

        const ogSetting = data.find((s: any) => s.key === 'seo_og_image');
        if (ogSetting && ogSetting.value) setOgImagePreview(API_URL + ogSetting.value);

        const favSetting = data.find((s: any) => s.key === 'seo_favicon');
        if (favSetting && favSetting.value) setFaviconPreview(API_URL + favSetting.value);

        setLoading(false);
    };

    useEffect(() => { fetchSettings(); }, []);

    const handleUpdate = async () => {
        setSaving(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        await adminFetch(`${API_URL}/api/admin/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ settings }),
        });
        setSaving(false);
        alert('Settings saved!');
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('logo', file);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        const res = await adminFetch(`${API_URL}/api/admin/settings/logo`, {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            const data = await res.json();
            const PROD_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
            setLogoPreview(PROD_API_URL + data.logo_url);
            fetchSettings(); // Refresh settings to get new logo path
        } else {
            alert('Failed to upload logo.');
        }
    };

    const handleOgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const formData = new FormData();
        formData.append('og_image', e.target.files[0]);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        const res = await adminFetch(`${API_URL}/api/admin/settings/og-image`, { method: 'POST', body: formData });
        if (res.ok) {
            const data = await res.json();
            setOgImagePreview(API_URL + data.og_image_url);
            fetchSettings();
        } else {
            alert('Failed to upload OG Image.');
        }
    };

    const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const formData = new FormData();
        formData.append('favicon', e.target.files[0]);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        const res = await adminFetch(`${API_URL}/api/admin/settings/favicon`, { method: 'POST', body: formData });
        if (res.ok) {
            const data = await res.json();
            setFaviconPreview(API_URL + data.favicon_url);
            fetchSettings();
        } else {
            alert('Failed to upload Favicon.');
        }
    };

    const updateValue = (key: string, locale: string | null, value: string) => {
        setSettings(prev => {
            const exists = prev.find(s => s.key === key && s.locale === locale);
            if (exists) return prev.map(s => (s.key === key && s.locale === locale) ? { ...s, value } : s);
            return [...prev, { key, locale, value }];
        });
    };

    if (loading) return <div>Loading...</div>;

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'ar', name: 'العربية', flag: '🇵🇸' },
        { code: 'he', name: 'עברית', flag: '🇮🇱' },
    ];

    const getS = (key: string, locale: string | null) => settings.find(s => s.key === key && s.locale === locale)?.value || '';

    return (
        <div className="max-w-5xl pb-20 font-sans text-slate-300">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Project Settings</h1>
                    <p className="text-slate-400">Manage global site content, branding, and localized copywriting.</p>
                </div>
                <button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold hover:to-primary-400 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(4,120,87,0.4)] border border-primary-500/50 disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Master Tabs Controller */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveMainTab('global')}
                    className={`px-8 py-4 rounded-[1.5rem] font-bold transition-all shadow-sm flex items-center gap-3 ${activeMainTab === 'global' ? 'bg-[#091512] text-white border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'bg-[#040D0A] text-slate-500 border border-transparent hover:text-slate-300'}`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Global Setup
                </button>
                <button
                    onClick={() => setActiveMainTab('localized')}
                    className={`px-8 py-4 rounded-[1.5rem] font-bold transition-all shadow-sm flex items-center gap-3 ${activeMainTab === 'localized' ? 'bg-[#091512] text-white border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'bg-[#040D0A] text-slate-500 border border-transparent hover:text-slate-300'}`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                    Localized Content
                </button>
                <button
                    onClick={() => setActiveMainTab('integrations')}
                    className={`px-8 py-4 rounded-[1.5rem] font-bold transition-all shadow-sm flex items-center gap-3 ${activeMainTab === 'integrations' ? 'bg-[#091512] text-white border border-primary-500/30 shadow-[0_10px_30px_rgba(4,120,87,0.3)]' : 'bg-[#040D0A] text-slate-500 border border-transparent hover:text-slate-300'}`}
                >
                    <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Integrations & API
                </button>
            </div>

            {/* TAB CONTENT: GLOBAL */}
            {activeMainTab === 'global' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-[#091512]/95 backdrop-blur rounded-[2.5rem] shadow-sm border border-white/10 p-10 flex items-center gap-10 text-slate-300">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">Brand Identity</h3>
                            <p className="text-sm text-slate-400 mb-6">Upload your company logo and main site name.</p>
                            <div className="flex items-center gap-6">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-24 h-24 rounded-2xl border-2 border-dashed border-white/20 bg-[#040D0A] flex items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-white/5 transition-all overflow-hidden relative group"
                                >
                                    {logoPreview ? (
                                        <Image src={logoPreview} alt="Logo" fill className="object-contain p-2" />
                                    ) : (
                                        <span className="text-2xl text-slate-500 group-hover:text-primary-400">+</span>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Global Site Name</label>
                                        <input
                                            type="text"
                                            value={getS('site_name', null)}
                                            onChange={(e) => updateValue('site_name', null, e.target.value)}
                                            className="w-80 px-5 py-3 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Copyright Text</label>
                                        <input
                                            type="text"
                                            value={getS('site_copyright', null)}
                                            onChange={(e) => updateValue('site_copyright', null, e.target.value)}
                                            placeholder="© 2026 iFuture Hub. All rights reserved."
                                            className="w-80 px-5 py-3 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-l border-white/10 pl-10 flex-1">
                            <h3 className="text-lg font-bold text-white mb-2">Global Contact Details</h3>
                            <p className="text-sm text-slate-400 mb-6">These communicate your primary public points of contact.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Company Support Email</label>
                                    <input type="email" value={getS('company_email', null)} onChange={(e) => updateValue('company_email', null, e.target.value)} className="w-full max-w-sm px-5 py-3 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Company Global Phone</label>
                                    <input type="text" value={getS('company_phone', null)} onChange={(e) => updateValue('company_phone', null, e.target.value)} className="w-full max-w-sm px-5 py-3 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors" />
                                </div>
                                <div className="pt-4 mt-4 border-t border-white/10">
                                    <h4 className="text-sm font-bold text-white mb-3">Social Media URLs (Global)</h4>
                                    <div className="space-y-3 relative">
                                        <input type="text" placeholder="Facebook URL" value={getS('social_facebook', null)} onChange={(e) => updateValue('social_facebook', null, e.target.value)} className="w-full max-w-sm px-4 py-2 rounded-lg bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none text-sm transition-colors" />
                                        <input type="text" placeholder="Instagram URL" value={getS('social_instagram', null)} onChange={(e) => updateValue('social_instagram', null, e.target.value)} className="w-full max-w-sm px-4 py-2 rounded-lg bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none text-sm transition-colors" />
                                        <input type="text" placeholder="TikTok URL" value={getS('social_tiktok', null)} onChange={(e) => updateValue('social_tiktok', null, e.target.value)} className="w-full max-w-sm px-4 py-2 rounded-lg bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none text-sm transition-colors" />
                                        <input type="text" placeholder="X (Twitter) URL" value={getS('social_x', null)} onChange={(e) => updateValue('social_x', null, e.target.value)} className="w-full max-w-sm px-4 py-2 rounded-lg bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none text-sm transition-colors" />
                                        <input type="text" placeholder="LinkedIn URL" value={getS('social_linkedin', null)} onChange={(e) => updateValue('social_linkedin', null, e.target.value)} className="w-full max-w-sm px-4 py-2 rounded-lg bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none text-sm transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#091512]/95 backdrop-blur rounded-[2.5rem] shadow-sm border border-white/10 p-10 flex items-start gap-16">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">Social Share Image (OG Image)</h3>
                            <p className="text-sm text-slate-400 mb-6 w-64">The image previewed when someone shares your site on Facebook, WhatsApp, LinkedIn, etc. (Recommended: 1200x630)</p>
                            <div
                                onClick={() => ogInputRef.current?.click()}
                                className="w-64 h-36 rounded-2xl border-2 border-dashed border-white/20 bg-[#040D0A] flex items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-white/5 transition-all overflow-hidden relative group"
                            >
                                {ogImagePreview ? (
                                    <Image src={ogImagePreview} alt="OG Image" fill className="object-cover" />
                                ) : (
                                    <span className="text-2xl text-slate-500 group-hover:text-primary-400">+</span>
                                )}
                                <input type="file" ref={ogInputRef} onChange={handleOgUpload} className="hidden" accept="image/*" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">Browser Tab Icon (Favicon)</h3>
                            <p className="text-sm text-slate-400 mb-6">The small icon displayed in browser tabs. (Recommended: 32x32 `.ico` or `.png`)</p>
                            <div
                                onClick={() => faviconInputRef.current?.click()}
                                className="w-20 h-20 rounded-2xl border-2 border-dashed border-white/20 bg-[#040D0A] flex items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-white/5 transition-all overflow-hidden relative group"
                            >
                                {faviconPreview ? (
                                    <Image src={faviconPreview} alt="Favicon" fill className="object-contain p-2" />
                                ) : (
                                    <span className="text-2xl text-slate-500 group-hover:text-primary-400">+</span>
                                )}
                                <input type="file" ref={faviconInputRef} onChange={handleFaviconUpload} className="hidden" accept="image/*,.ico" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: LOCALIZED */}
            {activeMainTab === 'localized' && (
                <>
                    <div className="flex border-b border-white/10 px-8 bg-white/5 relative">
                        {languages.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => setActiveTab(lang.code)}
                                className={`px-8 py-6 font-bold text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer border-b-2 z-10 ${activeTab === lang.code ? 'border-primary-500 text-primary-400 bg-white/5' : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-white/5'}`}
                            >
                                <span className="mr-2">{lang.flag}</span>
                                {lang.name}
                            </button>
                        ))}
                    </div>

                    <div className="p-12 space-y-12">

                        {/* Hero Section settings */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center mr-3 text-sm font-black border border-primary-500/30">01</span>
                                Hero Section copy
                            </h3>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Hero Company Name (Gradient Accent Text)</label>
                                    <input
                                        type="text" value={getS('hero_company_name', activeTab)} onChange={(e) => updateValue('hero_company_name', activeTab, e.target.value)}
                                        className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Title Line 1</label>
                                    <input
                                        type="text" value={getS('hero_title_1', activeTab)} onChange={(e) => updateValue('hero_title_1', activeTab, e.target.value)}
                                        className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Title Line 2</label>
                                    <input
                                        type="text" value={getS('hero_title_2', activeTab)} onChange={(e) => updateValue('hero_title_2', activeTab, e.target.value)}
                                        className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6 mb-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Subtitle</label>
                                    <textarea
                                        rows={2} value={getS('hero_subtitle', activeTab)} onChange={(e) => updateValue('hero_subtitle', activeTab, e.target.value)}
                                        className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors resize-none"
                                    ></textarea>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-bold text-slate-300 mb-2">CTA Button text</label>
                                    <input
                                        type="text" value={getS('hero_button', activeTab)} onChange={(e) => updateValue('hero_button', activeTab, e.target.value)}
                                        className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Hero Stats */}
                            <div className="p-6 bg-[#040D0A] rounded-2xl border border-white/10">
                                <h4 className="text-sm font-bold text-white mb-4">Hero Statistics</h4>
                                <div className="grid grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex gap-2 relative">
                                            <input
                                                type="text" placeholder="Value (e.g. 99%)" value={getS(`stat_${i}_val`, activeTab)} onChange={(e) => updateValue(`stat_${i}_val`, activeTab, e.target.value)}
                                                className="w-1/3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 text-primary-400 outline-none text-sm font-bold transition-colors"
                                            />
                                            <input
                                                type="text" placeholder="Label" value={getS(`stat_${i}_lbl`, activeTab)} onChange={(e) => updateValue(`stat_${i}_lbl`, activeTab, e.target.value)}
                                                className="w-2/3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 text-white outline-none text-sm transition-colors"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-white/10">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center mr-3 text-sm font-black border border-primary-500/30">02</span>
                                About Company
                            </h3>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Tagline (Small Uppercase Label)</label>
                                    <input
                                        type="text" value={getS('about_tagline', activeTab)} onChange={(e) => updateValue('about_tagline', activeTab, e.target.value)}
                                        className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">CTA Button</label>
                                    <input
                                        type="text" value={getS('about_cta', activeTab)} onChange={(e) => updateValue('about_cta', activeTab, e.target.value)}
                                        className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Title 1</label>
                                    <input
                                        type="text" value={getS('about_title_1', activeTab)} onChange={(e) => updateValue('about_title_1', activeTab, e.target.value)}
                                        className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Title 2 (Gradient)</label>
                                    <input
                                        type="text" value={getS('about_title_2', activeTab)} onChange={(e) => updateValue('about_title_2', activeTab, e.target.value)}
                                        className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
                                <textarea
                                    rows={3} value={getS('about_description', activeTab)} onChange={(e) => updateValue('about_description', activeTab, e.target.value)}
                                    className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors resize-none"
                                ></textarea>
                            </div>
                            <div className="mt-6">
                                <label className="block text-sm font-bold text-slate-300 mb-2">Physical HQ Address</label>
                                <input
                                    type="text" value={getS('company_address', activeTab)} onChange={(e) => updateValue('company_address', activeTab, e.target.value)}
                                    className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="pt-10 border-t border-white/10">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center mr-3 text-sm font-black border border-primary-500/30">03</span>
                                Team Section Header
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Team Title</label>
                                    <input
                                        type="text" value={getS('team_title', activeTab)} onChange={(e) => updateValue('team_title', activeTab, e.target.value)}
                                        className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Team Subtitle</label>
                                    <input
                                        type="text" value={getS('team_subtitle', activeTab)} onChange={(e) => updateValue('team_subtitle', activeTab, e.target.value)}
                                        className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-white/10">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center mr-3 text-sm font-black border border-primary-500/30">04</span>
                                Search Engine Optimization (SEO)
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Meta Description (Short summary for Google)</label>
                                    <textarea
                                        rows={2} value={getS('seo_description', activeTab)} onChange={(e) => updateValue('seo_description', activeTab, e.target.value)}
                                        className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors resize-none"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Keywords (Comma separated)</label>
                                    <input
                                        type="text" value={getS('seo_keywords', activeTab)} onChange={(e) => updateValue('seo_keywords', activeTab, e.target.value)}
                                        placeholder="e.g. smart solutions, tech agency, software development"
                                        className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-white/10">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center mr-3 text-sm font-black border border-primary-500/30">05</span>
                                Footer Configuration
                            </h3>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Company Column Title</label>
                                    <input
                                        type="text" value={getS('footer_company_title', activeTab)} onChange={(e) => updateValue('footer_company_title', activeTab, e.target.value)}
                                        placeholder="e.g. COMPANY"
                                        className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Platforms Column Title</label>
                                    <input
                                        type="text" value={getS('footer_platforms_title', activeTab)} onChange={(e) => updateValue('footer_platforms_title', activeTab, e.target.value)}
                                        placeholder="e.g. PLATFORMS"
                                        className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Footer Description (Appears above physical address)</label>
                                <textarea
                                    rows={3} value={getS('footer_description', activeTab)} onChange={(e) => updateValue('footer_description', activeTab, e.target.value)}
                                    className="w-full px-5 py-4 rounded-xl bg-[#040D0A] border border-white/10 focus:border-primary-500 text-white outline-none transition-colors resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {/* TAB CONTENT: INTEGRATIONS */}
            {activeMainTab === 'integrations' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-[#091512]/95 backdrop-blur rounded-[2.5rem] shadow-sm border border-primary-500/20 p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-3xl pointer-events-none"></div>

                        <div className="mb-10 w-full flex items-end justify-between border-b border-white/10 pb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                    <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                    Payment Gateways
                                </h3>
                                <p className="text-sm text-slate-400 max-w-xl">Configure the connection exactly to Stripe and PayPal systems to receive funding directly into your merchant accounts.</p>
                            </div>
                        </div>

                        {/* Stripe Gateway Card */}
                        <div className="bg-[#05100c] rounded-3xl p-8 border border-white/5 shadow-inner mb-8">
                            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 text-indigo-400 font-extrabold text-2xl tracking-tighter italic">S</div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white">Stripe Checkout</h4>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Credit Card & Debit Processing</p>
                                    </div>
                                </div>
                                <div className="flex bg-[#030a08] rounded-xl p-1 border border-white/10">
                                    <button onClick={() => setStripeMode('test')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${stripeMode === 'test' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-500 hover:text-white'}`}>Test Mode</button>
                                    <button onClick={() => setStripeMode('live')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${stripeMode === 'live' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-500 hover:text-white'}`}>Live Mode</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 relative">
                                {stripeMode === 'test' && (
                                    <div className="absolute inset-0 border-2 border-amber-500/20 rounded-xl pointer-events-none -m-4"></div>
                                )}
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Publishable Key ({stripeMode.toUpperCase()})</label>
                                    <input type="text" placeholder={stripeMode === 'test' ? "pk_test_..." : "pk_live_..."} value={getS(`payment_stripe_pk_${stripeMode}`, null)} onChange={(e) => updateValue(`payment_stripe_pk_${stripeMode}`, null, e.target.value)} className="w-full px-5 py-3 rounded-xl bg-[#040D0A] border border-white/5 focus:border-indigo-500/50 text-white outline-none transition-colors font-mono text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Secret Key ({stripeMode.toUpperCase()})</label>
                                    <input type="password" placeholder={stripeMode === 'test' ? "sk_test_..." : "sk_live_..."} value={getS(`payment_stripe_sk_${stripeMode}`, null)} onChange={(e) => updateValue(`payment_stripe_sk_${stripeMode}`, null, e.target.value)} className="w-full px-5 py-3 rounded-xl bg-[#040D0A] border border-white/5 focus:border-indigo-500/50 text-white outline-none transition-colors font-mono text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* PayPal Gateway Card */}
                        <div className="bg-[#05100c] rounded-3xl p-8 border border-white/5 shadow-inner">
                            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 text-blue-400 font-extrabold text-2xl tracking-tighter italic">P</div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white">PayPal REST API</h4>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">PayPal Accounts Processing</p>
                                    </div>
                                </div>
                                <div className="flex bg-[#030a08] rounded-xl p-1 border border-white/10">
                                    <button onClick={() => setPaypalMode('test')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${paypalMode === 'test' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-500 hover:text-white'}`}>Sandbox (Test)</button>
                                    <button onClick={() => setPaypalMode('live')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${paypalMode === 'live' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-500 hover:text-white'}`}>Live Mode</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 relative">
                                {paypalMode === 'test' && (
                                    <div className="absolute inset-0 border-2 border-amber-500/20 rounded-xl pointer-events-none -m-4"></div>
                                )}
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Client ID ({paypalMode === 'test' ? 'SANDBOX' : 'LIVE'})</label>
                                    <input type="password" value={getS(`payment_paypal_client_${paypalMode}`, null)} onChange={(e) => updateValue(`payment_paypal_client_${paypalMode}`, null, e.target.value)} className="w-full px-5 py-3 rounded-xl bg-[#040D0A] border border-white/5 focus:border-blue-500/50 text-white outline-none transition-colors font-mono text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Secret Token ({paypalMode === 'test' ? 'SANDBOX' : 'LIVE'})</label>
                                    <input type="password" value={getS(`payment_paypal_secret_${paypalMode}`, null)} onChange={(e) => updateValue(`payment_paypal_secret_${paypalMode}`, null, e.target.value)} className="w-full px-5 py-3 rounded-xl bg-[#040D0A] border border-white/5 focus:border-blue-500/50 text-white outline-none transition-colors font-mono text-sm" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
