"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchWithAuth } from '@/utils/api'; // We'll create a user-facing api helper
import { useLanguage } from '@/context/LanguageContext';

export default function InvestorDashboard() {
    const router = useRouter();
    const { language, setLanguage } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const [investments, setInvestments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const translations: any = {
        en: {
            loading: 'Loading secure portal...',
            welcome: 'Welcome Back',
            track: 'Track your investments and project development timelines.',
            signOut: 'Sign Out',
            totalInvested: 'Total Invested',
            projectsBacked: 'Projects Backed',
            quickActions: 'Quick Actions',
            browseProjects: 'Browse Projects',
            yourPortfolio: 'Your Portfolio',
            portfolioEmpty: 'Portfolio Empty',
            portfolioEmptyDesc: "Looks like you haven't backed any projects yet. Discover the future and start building your portfolio.",
            exploreCampaigns: 'Explore Campaigns',
            invested: 'Invested',
            liveRoadmap: 'Live Developer Roadmap',
            noTimeline: 'No timeline stages defined yet.',
            unknownProject: 'Unknown Project',
            earnedDividends: 'Total Dividends',
            sharesOwned: 'Shares Owned'
        },
        ar: {
            loading: 'جاري تحميل البوابة الآمنة...',
            welcome: 'مرحباً بك',
            track: 'تتبع استثماراتك والجداول الزمنية لتطوير المشاريع.',
            signOut: 'تسجيل الخروج',
            totalInvested: 'إجمالي الاستثمارات',
            projectsBacked: 'المشاريع المدعومة',
            quickActions: 'إجراءات سريعة',
            browseProjects: 'تصفح المشاريع',
            yourPortfolio: 'محفظتك',
            portfolioEmpty: 'المحفظة فارغة',
            portfolioEmptyDesc: 'يبدو أنك لم تدعم أي مشاريع بعد. اكتشف المستقبل وابدأ في بناء محفظتك.',
            exploreCampaigns: 'استكشف الحملات',
            invested: 'استثمار',
            liveRoadmap: 'خارطة طريق التطوير الحية',
            noTimeline: 'لم يتم تحديد مراحل زمنية بعد.',
            unknownProject: 'مشروع غير معروف',
            earnedDividends: 'إجمالي الأرباح',
            sharesOwned: 'الأسهم المملوكة'
        },
        he: {
            loading: 'טוען פורטל מאובטח...',
            welcome: 'ברוך שובך',
            track: 'עקוב אחר ההשקעות שלך ולוחות הזמנים לפיתוח פרויקטים.',
            signOut: 'התנתק',
            totalInvested: 'סך השקעות',
            projectsBacked: 'פרויקטים שגובו',
            quickActions: 'פעולות מהירות',
            browseProjects: 'עיין בפרויקטים',
            yourPortfolio: 'תיק ההשקעות שלך',
            portfolioEmpty: 'תיק ההשקעות ריק',
            portfolioEmptyDesc: 'נראה שטרם גיבית פרויקטים. גלה את העתיד והתחל לבנות את תיק ההשקעות שלך.',
            exploreCampaigns: 'חקור קמפיינים',
            invested: 'מושקע',
            liveRoadmap: 'מפת הדרכים חיה של המפתחים',
            noTimeline: 'טרם נקבעו שלבי לוח זמנים.',
            unknownProject: 'פרויקט לא ידוע',
            earnedDividends: 'סך הדיבידנדים',
            sharesOwned: 'מניות בבעלות'
        }
    };
    const t = translations[language] || translations.en;


    const checkAuthAndFetchData = async () => {
        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        try {
            // Get user profile
            const userRes = await fetchWithAuth(`${API_URL}/api/auth/user`);
            if (!userRes.ok) {
                router.push('/portal/login');
                return;
            }
            const userData = await userRes.json();
            if (userData.role === 'admin') {
                router.push('/admin/dashboard');
                return;
            }
            setUser(userData);

            // Fetch user's investments and eager load the associated project + stages
            const invRes = await fetchWithAuth(`${API_URL}/api/investor/investments`); // We need to build this route on Laravel side
            if (invRes.ok) {
                const invData = await invRes.json();
                setInvestments(invData);
            }

        } catch (e) {
            console.error(e);
            router.push('/portal/login');
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuthAndFetchData();
    }, []);

    const handleLogout = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        await fetchWithAuth(`${API_URL}/api/auth/logout`, { method: 'POST' });
        router.push('/portal/login');
    };

    if (loading) {
        return <div className="min-h-screen bg-[#030a08] flex items-center justify-center p-6"><div className="text-xl font-bold text-slate-500 animate-pulse">{t.loading}</div></div>;
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#030a08] pt-24 pb-20 selection:bg-primary-500/30">
            <div className="max-w-6xl mx-auto px-6 relative z-10">

                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white">{t.welcome}, <span className="text-primary-400">{user.name.split(' ')[0]}</span></h1>
                        <p className="text-slate-400 mt-1">{t.track}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Go to Site */}
                        <Link href="/" className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition px-4 py-2 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md shadow-sm hover:bg-white/10">
                            <svg className="w-4 h-4 rtl:-scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Site
                        </Link>

                        {/* Language Switcher */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm font-bold text-slate-300 hover:text-white transition px-4 py-2 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md shadow-sm">
                                <span>{language.toUpperCase()}</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            <div className="absolute right-0 rtl:left-0 top-full mt-2 w-32 bg-[#0d1f1c] rounded-xl shadow-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                                <button onClick={() => setLanguage('en')} className={`w-full text-center px-4 py-3 hover:bg-white/5 transition-colors text-sm font-medium ${language === 'en' ? 'text-primary-400 bg-primary-500/10' : 'text-slate-300'}`}>English</button>
                                <button onClick={() => setLanguage('ar')} className={`w-full text-center px-4 py-3 hover:bg-white/5 transition-colors text-sm font-medium ${language === 'ar' ? 'text-primary-400 bg-primary-500/10' : 'text-slate-300'}`}>العربية</button>
                                <button onClick={() => setLanguage('he')} className={`w-full text-center px-4 py-3 hover:bg-white/5 transition-colors text-sm font-medium ${language === 'he' ? 'text-primary-400 bg-primary-500/10' : 'text-slate-300'}`}>עברית</button>
                            </div>
                        </div>

                        <button onClick={handleLogout} className="text-sm font-bold text-slate-400 hover:text-red-400 transition px-4 py-2 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md shadow-sm hover:bg-red-500/10 hover:border-red-500/20">
                            {t.signOut}
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left Column: Stats */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-900/20">
                            <h3 className="text-blue-100 font-medium mb-2 opacity-80">{t.totalInvested}</h3>
                            <div className="text-5xl font-black mb-6 tracking-tight">
                                ${investments.reduce((acc, inv) => acc + Number(inv.amount), 0).toLocaleString()}
                            </div>
                            <div className="flex justify-between items-center text-sm font-medium border-t border-blue-500/30 pt-4 cursor-pointer hover:text-blue-200">
                                <span>{investments.length} {t.projectsBacked}</span>
                                <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-900/20">
                            <h3 className="text-emerald-100 items-center gap-2 flex font-medium mb-2 opacity-90">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                {t.earnedDividends}
                            </h3>
                            <div className="text-5xl font-black tracking-tight drop-shadow-sm">
                                ${investments.reduce((acc, inv) => acc + (Number(inv.earned_dividend) || 0), 0).toLocaleString()}
                            </div>
                        </div>

                        <div className="bg-[#05100c] backdrop-blur-3xl rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors duration-500 pointer-events-none"></div>
                            <h3 className="text-lg font-bold text-white mb-6 tracking-wide relative z-10">{t.quickActions}</h3>
                            <Link href="/projects" className="relative z-10 flex items-center justify-between p-4 rounded-2xl bg-[#0a1b15] hover:bg-[#0c241c] border border-white/5 transition-all duration-300 group/link cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(4,120,87,0.2)]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center border border-primary-500/30 group-hover/link:scale-110 group-hover/link:bg-primary-500 group-hover/link:text-white transition-all duration-300">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </div>
                                    <span className="font-bold text-white tracking-wide">{t.browseProjects}</span>
                                </div>
                                <svg className="w-5 h-5 text-slate-500 group-hover/link:text-white transition-colors rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Portfolio Timeline */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span>
                            {t.yourPortfolio}
                        </h2>

                        {investments.length === 0 ? (
                            <div className="bg-[#05100c] rounded-3xl p-16 text-center border border-white/5 shadow-2xl flex flex-col items-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors duration-500 pointer-events-none"></div>
                                <div className="w-24 h-24 bg-[#0a1b15] rounded-full flex items-center justify-center mb-8 text-4xl border border-white/5 shadow-inner">💎</div>
                                <h3 className="text-2xl font-extrabold text-white mb-3 tracking-wide">{t.portfolioEmpty}</h3>
                                <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg">{t.portfolioEmptyDesc}</p>
                                <Link href="/projects" className="px-8 py-4 bg-primary-600 text-white font-bold rounded-xl shadow-[0_10px_30px_rgba(4,120,87,0.3)] hover:bg-primary-500 hover:-translate-y-1 transition-all">
                                    {t.exploreCampaigns}
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {investments.map((inv) => (
                                    <div key={inv.id} className="bg-[#05100c] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-xl flex flex-col md:flex-row group transition-all hover:border-primary-500/30 hover:shadow-2xl hover:-translate-y-1 relative">

                                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/5 group-hover:to-primary-500/10 pointer-events-none transition-colors duration-500"></div>

                                        <div className="md:w-1/3 h-56 md:h-auto relative bg-[#030a08] border-r border-white/5">
                                            {inv.project?.image ? (
                                                <img src={`${process.env.NEXT_PUBLIC_API_URL}${inv.project.image}`} alt={inv.project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-600 bg-[#0a1b15]">
                                                    <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-[#030a08]/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-primary-400 border border-primary-500/20 shadow-lg">
                                                ${Number(inv.amount).toLocaleString()} {t.invested}
                                            </div>
                                        </div>

                                        <div className="p-8 md:w-2/3 flex flex-col justify-between relative z-10">
                                            <div>
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="font-extrabold text-2xl text-white group-hover:text-primary-400 transition-colors tracking-wide">{inv.project?.title || t.unknownProject}</h3>
                                                    <span className={`px-4 py-1.5 text-[0.65rem] font-bold rounded-full uppercase tracking-wider border ${inv.project?.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                                        {inv.project?.status?.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-400 line-clamp-2 mb-6 leading-relaxed">{inv.project?.description}</p>

                                                {inv.contract_pdf_path && (
                                                    <div className="mb-6">
                                                        <a href={inv.contract_pdf_path.startsWith('http') ? inv.contract_pdf_path : `https://api.ifuture.sbs${inv.contract_pdf_path}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-xl transition-colors border border-slate-700">
                                                            <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                            Download Contract Document
                                                        </a>
                                                    </div>
                                                )}

                                                <div className="flex gap-4 mb-8">
                                                    <div className="bg-[#0a1b15] px-5 py-3 rounded-2xl flex flex-col justify-center border border-white/5 flex-1 shadow-inner">
                                                        <span className="text-[0.65rem] text-slate-400 font-bold tracking-widest uppercase mb-1">{t.sharesOwned}</span>
                                                        <span className="text-2xl font-black text-white leading-none">{inv.shares || 1}</span>
                                                    </div>
                                                    <div className="bg-emerald-500/10 px-5 py-3 rounded-2xl flex flex-col justify-center border border-emerald-500/20 flex-1 shadow-inner relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none"></div>
                                                        <span className="text-[0.65rem] text-emerald-400 font-bold tracking-widest uppercase mb-1">{t.earnedDividends}</span>
                                                        <span className="text-2xl font-black text-emerald-400 leading-none drop-shadow-sm">+${Number(inv.earned_dividend || 0).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                                    {t.liveRoadmap}
                                                </h4>
                                                {inv.project?.stages && inv.project.stages.length > 0 ? (
                                                    <div className="flex items-center gap-1 w-full overflow-hidden">
                                                        {inv.project.stages.map((stage: any, i: number) => {
                                                            const isDone = stage.status === 'completed';
                                                            const isActive = stage.status === 'in_progress';
                                                            return (
                                                                <div key={stage.id} className="flex-1 relative group/stage hover:scale-105 transition-transform z-10 hover:z-20">
                                                                    <div className={`h-2.5 w-full rounded-sm border border-white/5 shadow-inner ${isDone ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : isActive ? 'bg-primary-500 shadow-[0_0_10px_rgba(4,120,87,0.3)]' : 'bg-white/10'}`}></div>
                                                                    {/* Tooltip */}
                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover/stage:opacity-100 transition-opacity pointer-events-none z-30 w-max max-w-[200px] bg-[#030a08] border border-white/10 text-white text-[0.7rem] px-3 py-2 rounded-xl shadow-2xl text-center font-bold whitespace-pre-wrap">
                                                                        {stage.title} <br /> <span className={`text-[0.6rem] uppercase tracking-wider mt-1 block ${isDone ? 'text-emerald-400' : isActive ? 'text-primary-400' : 'text-slate-500'}`}>({stage.status.replace('_', ' ')})</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-slate-400 italic">{t.noTimeline}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
