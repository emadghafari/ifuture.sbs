import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InvestButton from './InvestButton';

async function getProjectBySlug(slug: string) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        const res = await fetch(`${apiUrl}/api/public/projects/${slug}`, {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data;
    } catch (e) {
        return null;
    }
}

async function getSiteSettings(lang: string) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        const res = await fetch(`${apiUrl}/api/public/home?lang=${lang}`, {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.site;
    } catch (e) {
        return null;
    }
}

export default async function ProjectDetailsPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const project = await getProjectBySlug(params.slug);
    const site = await getSiteSettings('ar'); // Base site settings for Navbar/Footer

    if (!project) {
        return (
            <div className="bg-[#030a08] min-h-screen flex flex-col items-center justify-center text-white">
                <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
                <Link href="/projects" className="text-primary-400 hover:text-white transition-colors">Return to Campaigns</Link>
            </div>
        );
    }

    const percentFunded = Math.min((project.current_amount / project.target_amount) * 100, 100);
    const remaining = Math.max(project.target_amount - project.current_amount, 0);

    return (
        <main className="bg-[#030a08] min-h-screen text-white font-sans selection:bg-primary-500/30 relative">
            <Navbar site={site} />

            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-900/10 rounded-full blur-[150px] pointer-events-none"></div>

            <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-32 relative z-10 w-full overflow-hidden">

                {/* Back Link */}
                <Link href="/projects" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary-400 mb-8 transition-colors group">
                    <svg className="w-5 h-5 mr-2 rtl:hidden group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    <svg className="w-5 h-5 ml-2 ltr:hidden group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    Back to Campaigns
                </Link>

                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Left Column: Image and Details */}
                    <div className="w-full lg:w-2/3">
                        <div className="relative w-full h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 group mb-12">
                            {project.image ? (
                                <img src={`${process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs'}${project.image}`} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#0a1b15]">
                                    <span className="text-6xl opacity-30">🚀</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030a08] via-[#030a08]/40 to-transparent"></div>

                            <div className="absolute bottom-8 left-8 rtl:right-8 rtl:left-auto flex gap-3">
                                <span className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md border border-white/10 ${project.status === 'funding' ? 'bg-amber-500/20 text-amber-300' :
                                    project.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                                        'bg-primary-500/20 text-primary-300'
                                    }`}>
                                    {project.status.replace('_', ' ')}
                                </span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-8">
                            {project.title}
                        </h1>

                        <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed mb-16 whitespace-pre-wrap selection:bg-primary-500/30">
                            {project.description}
                        </div>

                        {/* Project Timeline Stages */}
                        {project.stages && project.stages.length > 0 && (
                            <div className="mt-16 bg-[#06120e] p-8 md:p-12 rounded-[3rem] border border-white/5">
                                <h3 className="text-2xl font-bold mb-10 flex items-center gap-3">
                                    <span className="w-2 h-8 rounded-full bg-primary-500"></span>
                                    Development Timeline
                                </h3>
                                <div className="space-y-8">
                                    {project.stages.sort((a: any, b: any) => a.order_index - b.order_index).map((stage: any, idx: number) => (
                                        <div key={stage.id} className="relative pl-10 rtl:pr-10 rtl:pl-0 border-l-2 rtl:border-r-2 rtl:border-l-0 border-white/10 pb-8 last:pb-0">
                                            <div className={`absolute left-[-10px] rtl:right-[-10px] top-1 w-5 h-5 rounded-full border-4 border-[#030a08] shadow-lg ${stage.status === 'completed' ? 'bg-emerald-500 shadow-emerald-500/50' : stage.status === 'in_progress' ? 'bg-primary-500 shadow-primary-500/50' : 'bg-slate-600'}`}></div>
                                            <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                                                {stage.title}
                                                <span className={`text-[0.65rem] font-bold uppercase px-3 py-1 rounded-full border ${stage.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : stage.status === 'in_progress' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 'bg-white/5 text-slate-400 border-white/10'}`}>
                                                    {stage.status.replace('_', ' ')}
                                                </span>
                                            </h4>
                                            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">{stage.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Funding Widget */}
                    <div className="w-full lg:w-1/3 sticky top-32">
                        <div className="bg-[#06120e] rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 pointer-events-none transition-colors duration-500"></div>

                            <div className="mb-4">
                                <span className="block text-[2.5rem] font-extrabold tracking-tight text-white mb-2 leading-none">
                                    ${Number(project.current_amount).toLocaleString()}
                                </span>
                                <span className="text-slate-500 font-medium">Raised of <span className="text-primary-400 font-bold">${Number(project.target_amount).toLocaleString()}</span> goal</span>
                            </div>

                            <div className="w-full bg-[#030a08] rounded-full h-3 overflow-hidden border border-white/5 mb-4 mt-6">
                                <div
                                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-primary-500 h-full rounded-full relative"
                                    style={{ width: `${percentFunded}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 w-full h-full banner-shine"></div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-sm font-bold border-b border-white/5 pb-8 mb-8">
                                <span className="text-white bg-white/5 px-4 py-2 rounded-xl">{Math.round(percentFunded)}% Funded</span>
                                <span className="text-slate-400"> ${Number(remaining).toLocaleString()} Remaining</span>
                            </div>

                            <div className="flex items-center gap-5 mb-8 bg-[#0a1b15] p-5 rounded-[2rem] border border-white/5">
                                <div className="w-14 h-14 rounded-full bg-primary-500/20 flex flex-col items-center justify-center border border-primary-500/30">
                                    <span className="text-primary-400 font-bold leading-none">{project.investments_count || 0}</span>
                                    <svg className="w-3.5 h-3.5 text-slate-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                                </div>
                                <div>
                                    <span className="block text-xl font-bold text-white leading-tight">Total Backers</span>
                                </div>
                            </div>

                            {/* Call to Action Buttons */}
                            <div className="space-y-4">
                                {project.status === 'funding' && remaining > 0 && (
                                    <InvestButton slug={project.slug} />
                                )}

                                {project.url && (
                                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-3 p-4 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-colors border border-white/5 group/link hover:-translate-y-1">
                                        <span>Visit Official Website</span>
                                        <svg className="w-4 h-4 text-primary-500 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </article>

            <Footer site={site} />
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
        </main>
    );
}
