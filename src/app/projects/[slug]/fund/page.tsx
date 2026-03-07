"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/utils/api';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function FundProject(props: { params: Promise<{ slug: string }> }) {
    const { t } = useLanguage();
    const params = React.use(props.params);
    const router = useRouter();
    const [project, setProject] = useState<any>(null);
    const [shares, setShares] = useState<number | ''>('');
    const [gateway, setGateway] = useState<'stripe' | 'paypal'>('stripe');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
            // Use public endpoint to get project details
            const res = await fetch(`${API_URL}/api/public/projects/${params.slug}`);
            if (res.ok) {
                const p = await res.json();
                setProject(p);
            } else {
                setError('Failed to load project details.');
            }
            setLoading(false);

            // Validate user is actually logged in
            fetchWithAuth(`${API_URL}/api/auth/user`).then(r => {
                if (!r.ok) router.push(`/portal/login?redirect=/projects/${params.slug}/fund`);
            });
        };
        fetchProject();
    }, [params.slug]);

    const handleMockPayment = async () => {
        if (!shares || shares < 1) return setError('Minimum investment is 1 share');

        setError('');
        setProcessing(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';

        try {
            // Note: In Phase 2 we built /api/payment/stripe/intent and /api/payment/capture
            // But since we can't install Stripe.js, we will just simulate hitting the capture endpoint
            // directly if the user is authenticated. We'll use a mocked transaction ID.
            const txId = `${gateway.toUpperCase()}_MOCK_${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
            const costPerShare = project.target_amount / (project.total_shares || 1000);
            const totalAmount = shares * costPerShare;

            const res = await fetchWithAuth(`${API_URL}/api/payment/capture`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: project.id,
                    amount: totalAmount,
                    shares: shares,
                    gateway: gateway,
                    transaction_id: txId
                })
            });

            if (res.ok) {
                router.push('/portal/dashboard');
            } else {
                const data = await res.json();
                setError(data.message || 'Payment simulation failed.');
                setProcessing(false);
            }

        } catch (e) {
            setError('System connection error.');
            setProcessing(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#030a08] flex items-center justify-center p-6"><div className="text-xl font-bold text-slate-500 animate-pulse">Initializing Checkout...</div></div>;
    if (!project) return <div className="min-h-screen flex text-center mt-20 justify-center text-white">Project not found for funding.</div>;

    return (
        <div className="min-h-screen bg-[#030a08] pt-24 pb-20 selection:bg-primary-500/30">
            <div className="max-w-3xl mx-auto px-6 relative z-10">

                {/* Header Back link */}
                <Link href={`/projects/${project.slug}`} className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-primary-400 mb-8 transition-colors group">
                    <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform rtl:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform ltr:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    {t('back_projects')}
                </Link>

                <div className="bg-[#05100c] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden flex flex-col md:flex-row relative">
                    <div className="absolute inset-0 bg-primary-500/5 pointer-events-none"></div>

                    {/* Left: Summary */}
                    <div className="bg-[#091512] border-r border-white/5 p-8 text-white md:w-2/5 flex flex-col justify-between relative z-10">
                        <div>
                            <h2 className="text-xl font-bold mb-2">Back this Project</h2>
                            <h3 className="text-2xl font-black text-primary-400 leading-tight mb-6">{project.title}</h3>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">You are supporting the visionaries of tomorrow. Funds go directly to advancing the development timelines.</p>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-inner">
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Target Goal & Shares</div>
                            <div className="text-3xl font-black text-white mb-2 drop-shadow-sm">${Number(project.target_amount).toLocaleString()}</div>
                            <div className="text-sm text-primary-300 font-bold">({project.total_shares || 1000} Total Shares) = ${(project.target_amount / (project.total_shares || 1000)).toLocaleString()}/Share</div>
                        </div>
                    </div>

                    {/* Right: Checkout Engine */}
                    <div className="p-8 md:w-3/5 relative z-10">
                        <h3 className="text-2xl font-extrabold text-white mb-8">Investment Details</h3>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold flex items-center gap-3 shadow-inner">
                                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                {error}
                            </div>
                        )}

                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">{t('select_shares')}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <span className="text-slate-500 font-bold text-xl">📄</span>
                                    </div>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        placeholder="e.g. 5"
                                        value={shares}
                                        onChange={(e) => setShares(Number(e.target.value))}
                                        className="pl-14 block w-full px-5 py-4 bg-[#0a1b15] border border-white/10 rounded-2xl shadow-inner placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-2xl font-black text-white transition-all"
                                    />
                                </div>
                                {shares && shares > 0 && typeof shares === 'number' && (
                                    <div className="mt-4 text-sm flex gap-3 items-center bg-[#091512] p-3 rounded-xl border border-white/5">
                                        <span className="text-slate-400 font-medium">{t('total_cost')}</span>
                                        <span className="text-primary-400 font-bold shadow-[0_0_15px_rgba(4,120,87,0.4)] px-3 py-1 bg-primary-500/10 rounded border border-primary-500/20 text-lg">
                                            ${(shares * (project.target_amount / (project.total_shares || 1000))).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">{t('payment_method')}</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setGateway('stripe')}
                                        className={`flex flex-col items-center justify-center p-5 border-2 rounded-2xl transition-all duration-300 ${gateway === 'stripe' ? 'border-primary-500 bg-primary-500/10 text-white shadow-[0_0_20px_rgba(4,120,87,0.2)] scale-105' : 'border-white/10 hover:border-white/20 text-slate-500 bg-[#0a1b15]'}`}
                                    >
                                        <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M13.976 9.15c-2.172-.806-3.356-1.143-3.356-1.781 0-.629.563-1.01 1.638-1.01 1.761 0 3.323.513 4.542 1.258l1.343-4.14C16.892 2.7 15.012 2 12.872 2 7.72 2 4.414 4.887 4.414 8.65c0 5.4 7.23 5.483 7.23 7.375 0 .684-.666 1.134-1.849 1.134-1.956 0-3.952-.777-5.545-1.781l-1.371 4.239C4.54 20.843 6.64 21.6 9.117 21.6c5.29 0 8.705-2.81 8.705-6.75 0-5.63-7.23-5.65-7.23-7.46-.02-.128 2.62-1.636.002-.556L10.6 6.83l-3.356 2.32z" /></svg>
                                        <span className="font-bold text-xs uppercase tracking-wider mt-1">{t('credit_card')}</span>
                                    </button>

                                    <button
                                        onClick={() => setGateway('paypal')}
                                        className={`flex flex-col items-center justify-center p-5 border-2 rounded-2xl transition-all duration-300 ${gateway === 'paypal' ? 'border-primary-500 bg-primary-500/10 text-white shadow-[0_0_20px_rgba(4,120,87,0.2)] scale-105' : 'border-white/10 hover:border-white/20 text-slate-500 bg-[#0a1b15]'}`}
                                    >
                                        <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z" /></svg>
                                        <span className="font-bold text-xs uppercase tracking-wider mt-1">{t('paypal')}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-primary-500/10 text-primary-300 p-5 rounded-2xl text-sm border border-primary-500/20 flex items-start shadow-inner">
                                <svg className="w-5 h-5 mr-3 shrink-0 text-primary-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Note: Third-party payment popups are bypassed. This will perform an authenticated simulation hitting the backend directly to secure your shares.</span>
                            </div>

                            <button
                                onClick={handleMockPayment}
                                disabled={processing || !shares || shares < 1}
                                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-extrabold py-5 px-6 rounded-2xl shadow-[0_10px_30px_rgba(4,120,87,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:hover:-translate-y-0 flex items-center justify-center text-lg hover:-translate-y-1"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Processing Gateway...
                                    </span>
                                ) : (
                                    t('invest_now') + ` $${(Number(shares || 0) * (project?.target_amount / (project?.total_shares || 1000))).toLocaleString()} securely`
                                )}
                            </button>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
