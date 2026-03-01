"use client";

import React, { useEffect, useState, useRef } from 'react';
import { adminFetch } from '@/utils/api';
import Image from 'next/image';

export default function AdminSettings() {
    const [settings, setSettings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('ar');
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
        { code: 'ar', name: 'العربية', flag: '🇵🇸' },
        { code: 'he', name: 'עברית', flag: '🇮🇱' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
    ];

    const getS = (key: string, locale: string | null) => settings.find(s => s.key === key && s.locale === locale)?.value || '';

    return (
        <div className="max-w-5xl pb-20">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Project Settings</h1>
                    <p className="text-slate-500">Manage global site content, branding, and localized copywriting.</p>
                </div>
                <button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Global Branding */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 mb-8 flex items-center gap-10">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Brand Identity</h3>
                    <p className="text-sm text-slate-500 mb-6">Upload your company logo and main site name.</p>
                    <div className="flex items-center gap-6">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all overflow-hidden relative group"
                        >
                            {logoPreview ? (
                                <Image src={logoPreview} alt="Logo" fill className="object-contain p-2" />
                            ) : (
                                <span className="text-2xl text-slate-400 group-hover:text-blue-500">+</span>
                            )}
                            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Global Site Name</label>
                                <input
                                    type="text"
                                    value={getS('site_name', null)}
                                    onChange={(e) => updateValue('site_name', null, e.target.value)}
                                    className="w-80 px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Copyright Text</label>
                                <input
                                    type="text"
                                    value={getS('site_copyright', null)}
                                    onChange={(e) => updateValue('site_copyright', null, e.target.value)}
                                    placeholder="© 2026 iFuture Hub. All rights reserved."
                                    className="w-80 px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-l border-slate-100 pl-10 flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Global Contact Details</h3>
                    <p className="text-sm text-slate-500 mb-6">These communicate your primary public points of contact.</p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Company Support Email</label>
                            <input type="email" value={getS('company_email', null)} onChange={(e) => updateValue('company_email', null, e.target.value)} className="w-full max-w-sm px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Company Global Phone</label>
                            <input type="text" value={getS('company_phone', null)} onChange={(e) => updateValue('company_phone', null, e.target.value)} className="w-full max-w-sm px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all" />
                        </div>
                        <div className="pt-4 mt-4 border-t border-slate-100">
                            <h4 className="text-sm font-bold text-slate-800 mb-3">Social Media URLs (Global)</h4>
                            <div className="space-y-3">
                                <input type="text" placeholder="Facebook URL" value={getS('social_facebook', null)} onChange={(e) => updateValue('social_facebook', null, e.target.value)} className="w-full max-w-sm px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-sm transition-all" />
                                <input type="text" placeholder="Instagram URL" value={getS('social_instagram', null)} onChange={(e) => updateValue('social_instagram', null, e.target.value)} className="w-full max-w-sm px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-sm transition-all" />
                                <input type="text" placeholder="TikTok URL" value={getS('social_tiktok', null)} onChange={(e) => updateValue('social_tiktok', null, e.target.value)} className="w-full max-w-sm px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-sm transition-all" />
                                <input type="text" placeholder="X (Twitter) URL" value={getS('social_x', null)} onChange={(e) => updateValue('social_x', null, e.target.value)} className="w-full max-w-sm px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-sm transition-all" />
                                <input type="text" placeholder="LinkedIn URL" value={getS('social_linkedin', null)} onChange={(e) => updateValue('social_linkedin', null, e.target.value)} className="w-full max-w-sm px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-sm transition-all" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Gateways */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Crowdfunding Gateways (Global)</h3>
                <p className="text-sm text-slate-500 mb-6 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                    These API keys are used across all languages. Keep them secure.
                </p>

                <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded">STRIPE</span>
                            <span className="text-sm font-semibold text-slate-700">Visa / Mastercard API</span>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Secret Key (sk_...)</label>
                            <input type="password" placeholder="sk_live_..." value={getS('payment_stripe_secret', null)} onChange={(e) => updateValue('payment_stripe_secret', null, e.target.value)} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none transition-all font-mono text-sm" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded">PAYPAL</span>
                            <span className="text-sm font-semibold text-slate-700">PayPal REST API</span>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Client ID</label>
                            <input type="password" value={getS('payment_paypal_client_id', null)} onChange={(e) => updateValue('payment_paypal_client_id', null, e.target.value)} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all font-mono text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Secret Token</label>
                            <input type="password" value={getS('payment_paypal_secret', null)} onChange={(e) => updateValue('payment_paypal_secret', null, e.target.value)} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all font-mono text-sm" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Global SEO Assets */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 mb-8 flex items-start gap-16">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Social Share Image (OG Image)</h3>
                    <p className="text-sm text-slate-500 mb-6 w-64">The image previewed when someone shares your site on Facebook, WhatsApp, LinkedIn, etc. (Recommended: 1200x630)</p>
                    <div
                        onClick={() => ogInputRef.current?.click()}
                        className="w-64 h-36 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all overflow-hidden relative group"
                    >
                        {ogImagePreview ? (
                            <Image src={ogImagePreview} alt="OG Image" fill className="object-cover" />
                        ) : (
                            <span className="text-2xl text-slate-400 group-hover:text-blue-500">+</span>
                        )}
                        <input type="file" ref={ogInputRef} onChange={handleOgUpload} className="hidden" accept="image/*" />
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Browser Tab Icon (Favicon)</h3>
                    <p className="text-sm text-slate-500 mb-6">The small icon displayed in browser tabs. (Recommended: 32x32 `.ico` or `.png`)</p>
                    <div
                        onClick={() => faviconInputRef.current?.click()}
                        className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all overflow-hidden relative group"
                    >
                        {faviconPreview ? (
                            <Image src={faviconPreview} alt="Favicon" fill className="object-contain p-2" />
                        ) : (
                            <span className="text-2xl text-slate-400 group-hover:text-blue-500">+</span>
                        )}
                        <input type="file" ref={faviconInputRef} onChange={handleFaviconUpload} className="hidden" accept="image/*,.ico" />
                    </div>
                </div>
            </div>

            {/* Localized Content */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex border-b border-slate-100 px-8 bg-slate-50/50">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => setActiveTab(lang.code)}
                            className={`px-8 py-6 font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-b-2 z-10 ${activeTab === lang.code ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                        >
                            <span className="mr-2">{lang.flag}</span>
                            {lang.name}
                        </button>
                    ))}
                </div>

                <div className="p-12 space-y-12">

                    {/* Hero Section settings */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">01</span>
                            Hero Section copy
                        </h3>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Hero Company Name (Gradient Accent Text)</label>
                                <input
                                    type="text" value={getS('hero_company_name', activeTab)} onChange={(e) => updateValue('hero_company_name', activeTab, e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Title Line 1</label>
                                <input
                                    type="text" value={getS('hero_title_1', activeTab)} onChange={(e) => updateValue('hero_title_1', activeTab, e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Title Line 2</label>
                                <input
                                    type="text" value={getS('hero_title_2', activeTab)} onChange={(e) => updateValue('hero_title_2', activeTab, e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6 mb-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Subtitle</label>
                                <textarea
                                    rows={2} value={getS('hero_subtitle', activeTab)} onChange={(e) => updateValue('hero_subtitle', activeTab, e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all resize-none"
                                ></textarea>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">CTA Button text</label>
                                <input
                                    type="text" value={getS('hero_button', activeTab)} onChange={(e) => updateValue('hero_button', activeTab, e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Hero Stats */}
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="text-sm font-bold text-slate-900 mb-4">Hero Statistics</h4>
                            <div className="grid grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            type="text" placeholder="Value (e.g. 99%)" value={getS(`stat_${i}_val`, activeTab)} onChange={(e) => updateValue(`stat_${i}_val`, activeTab, e.target.value)}
                                            className="w-1/3 px-3 py-2 rounded-xl bg-white border border-slate-200 focus:border-blue-500 outline-none text-sm font-bold"
                                        />
                                        <input
                                            type="text" placeholder="Label" value={getS(`stat_${i}_lbl`, activeTab)} onChange={(e) => updateValue(`stat_${i}_lbl`, activeTab, e.target.value)}
                                            className="w-2/3 px-3 py-2 rounded-xl bg-white border border-slate-200 focus:border-blue-500 outline-none text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">02</span>
                            About Company
                        </h3>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Tagline (Small Uppercase Label)</label>
                                <input
                                    type="text" value={getS('about_tagline', activeTab)} onChange={(e) => updateValue('about_tagline', activeTab, e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">CTA Button</label>
                                <input
                                    type="text" value={getS('about_cta', activeTab)} onChange={(e) => updateValue('about_cta', activeTab, e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Title 1</label>
                                <input
                                    type="text" value={getS('about_title_1', activeTab)} onChange={(e) => updateValue('about_title_1', activeTab, e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Title 2 (Gradient)</label>
                                <input
                                    type="text" value={getS('about_title_2', activeTab)} onChange={(e) => updateValue('about_title_2', activeTab, e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                            <textarea
                                rows={3} value={getS('about_description', activeTab)} onChange={(e) => updateValue('about_description', activeTab, e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all resize-none"
                            ></textarea>
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Physical HQ Address</label>
                            <input
                                type="text" value={getS('company_address', activeTab)} onChange={(e) => updateValue('company_address', activeTab, e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-10 border-t border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">03</span>
                            Team Section Header
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Team Title</label>
                                <input
                                    type="text" value={getS('team_title', activeTab)} onChange={(e) => updateValue('team_title', activeTab, e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Team Subtitle</label>
                                <input
                                    type="text" value={getS('team_subtitle', activeTab)} onChange={(e) => updateValue('team_subtitle', activeTab, e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">04</span>
                            Search Engine Optimization (SEO)
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Description (Short summary for Google)</label>
                                <textarea
                                    rows={2} value={getS('seo_description', activeTab)} onChange={(e) => updateValue('seo_description', activeTab, e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all resize-none"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Keywords (Comma separated)</label>
                                <input
                                    type="text" value={getS('seo_keywords', activeTab)} onChange={(e) => updateValue('seo_keywords', activeTab, e.target.value)}
                                    placeholder="e.g. smart solutions, tech agency, software development"
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">05</span>
                            Footer Configuration
                        </h3>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Company Column Title</label>
                                <input
                                    type="text" value={getS('footer_company_title', activeTab)} onChange={(e) => updateValue('footer_company_title', activeTab, e.target.value)}
                                    placeholder="e.g. COMPANY"
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Platforms Column Title</label>
                                <input
                                    type="text" value={getS('footer_platforms_title', activeTab)} onChange={(e) => updateValue('footer_platforms_title', activeTab, e.target.value)}
                                    placeholder="e.g. PLATFORMS"
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Footer Description (Appears above physical address)</label>
                            <textarea
                                rows={3} value={getS('footer_description', activeTab)} onChange={(e) => updateValue('footer_description', activeTab, e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
