import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function FeaturedProjects({ projects }: { projects: any[] }) {
    const { language } = useLanguage();

    const translations: any = {
        en: {
            title: 'Featured Campaigns',
            subtitle: 'Invest in the future before it hits the mainland.',
            raised: 'raised',
            goal: 'goal',
            remaining: 'remaining',
            investors: 'investors',
            funding: 'FUNDING',
            in_progress: 'IN PROGRESS',
            completed: 'COMPLETED',
            viewAll: 'View All Campaigns'
        },
        ar: {
            title: 'حملات مميزة',
            subtitle: 'استثمر في المستقبل قبل وصوله للسوق.',
            raised: 'تم جمعه',
            goal: 'الهدف',
            remaining: 'متبقي',
            investors: 'مستثمرون',
            funding: 'جاري التمويل',
            in_progress: 'قيد التطوير',
            completed: 'مكتمل',
            viewAll: 'عرض جميع الحملات'
        },
        he: {
            title: 'קמפיינים נבחרים',
            subtitle: 'השקיעו בעתיד לפני שהוא מגיע לשוק.',
            raised: 'גויס',
            goal: 'יעד',
            remaining: 'נותר',
            investors: 'משקיעים',
            funding: 'בגיוס',
            in_progress: 'בפיתוח',
            completed: 'הושלם',
            viewAll: 'הצג את כל הקמפיינים'
        }
    };
    const t = translations[language] || translations.en;

    if (!projects || projects.length === 0) return null;

    return (
        <section id="campaigns" className="py-32 bg-[#030a08] relative border-t border-white/5">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-[3rem] sm:text-[4rem] font-bold text-white tracking-tight leading-[1.1] mb-6">{t.title}</h2>
                    <p className="text-lg text-slate-400 font-medium">{t.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {projects.map((project: any) => {
                        const percentFunded = Math.min((project.current_amount / project.target_amount) * 100, 100);
                        const remaining = Math.max(project.target_amount - project.current_amount, 0);
                        const statusLabel = t[project.status] || project.status.replace('_', ' ').toUpperCase();

                        return (
                            <Link href={`/projects/${project.slug}`} key={project.id} className="group relative bg-[#06120e] rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-primary-500/30 transition-all duration-500 flex flex-col hover:-translate-y-2 pb-6">

                                {/* Inner Glow built-in */}
                                <div className="absolute inset-0 bg-gradient-to-b from-primary-500/0 via-primary-500/0 to-primary-500/5 group-hover:to-primary-500/10 pointer-events-none transition-colors duration-500"></div>

                                <div className="relative h-64 w-full p-3 pb-0">
                                    <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-white/5">
                                        {project.image ? (
                                            <img src={`${process.env.NEXT_PUBLIC_API_URL}${project.image}`} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-600 bg-[#0a1b15]">
                                                <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#06120e] to-transparent"></div>
                                    </div>

                                    <div className="absolute top-6 right-6 rtl:left-6 rtl:right-auto relative z-10">
                                        <span className={`px-4 py-1.5 text-[0.7rem] uppercase tracking-wider font-bold rounded-full backdrop-blur-md border ${project.status === 'funding' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : project.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-primary-500/20 text-primary-300 border-primary-500/30'}`}>
                                            {statusLabel}
                                        </span>
                                    </div>

                                    {/* Circular Floating Badge for Investors */}
                                    <div className="absolute -bottom-6 left-8 rtl:right-8 rtl:left-auto bg-[#0a1b15] border border-white/10 w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.5)] z-20 group-hover:scale-110 transition-transform duration-500">
                                        <span className="text-primary-400 font-bold text-lg leading-none">{project.investments_count || 0}</span>
                                        <svg className="w-3.5 h-3.5 text-slate-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                                    </div>
                                </div>

                                <div className="px-8 pt-10 pb-2 flex-1 flex flex-col relative z-10">
                                    <h3 className="text-xl font-bold text-white mb-3 tracking-wide line-clamp-1">{project.title}</h3>
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 line-clamp-2 flex-1">{project.description}</p>

                                    <div className="space-y-4 mt-auto">
                                        <div className="flex justify-between items-end text-sm">
                                            <div>
                                                <span className="font-bold text-2xl text-white tracking-widest">${Number(project.current_amount).toLocaleString()}</span>
                                                <span className="text-slate-500 font-medium mx-2">{t.raised}</span>
                                            </div>
                                            <div className="text-primary-400 font-bold">${Number(project.target_amount).toLocaleString()}</div>
                                        </div>

                                        <div className="w-full bg-[#030a08] rounded-full h-2 overflow-hidden border border-white/5">
                                            <div
                                                className="bg-primary-500 h-full rounded-full relative"
                                                style={{ width: `${percentFunded}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 w-full h-full banner-shine"></div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between text-[0.75rem] text-slate-500 font-medium tracking-wide">
                                            <span>{Math.round(percentFunded)}%</span>
                                            <span>${Number(remaining).toLocaleString()} {t.remaining}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Corner Accent Glow */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/20 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-20 text-center relative z-10">
                    <Link href="/projects" className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#0a1b15] text-white rounded-full font-bold hover:bg-primary-600 hover:text-white border border-primary-500/20 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/25">
                        {t.viewAll}
                        <svg className="w-5 h-5 rtl:rotate-180 text-primary-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shine {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(200%); }
                }
                .banner-shine {
                    animation: shine 2s infinite;
                }
            `}} />
        </section>
    );
}
