"use client";
import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export const Team = ({ members, teamInfo }: { members: any[]; teamInfo?: any }) => {
    const { language } = useLanguage();

    // Fallback if API hasn't loaded
    const defaultInfo = {
        title: language === 'ar' ? 'فريق العمل' : 'The Team',
        subtitle: language === 'ar' ? 'فريق من المطورين والمبتكرين لبناء تطورك الرقمي.' : 'Backed by industry experts to power your digital evolution.'
    };

    const info = teamInfo || defaultInfo;

    return (
        <section className="py-32 bg-[#030a08] relative border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-[3rem] sm:text-[4rem] font-bold text-white tracking-tight mb-6 leading-[1.1]">{info.title}</h2>
                    <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">
                        {info.subtitle}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
                    {members.map((member, idx) => (
                        <div key={member.id} className="group bg-[#06120e] border border-white/5 rounded-3xl p-8 flex flex-col items-center gap-6 hover:border-primary-500/30 hover:bg-[#0a1b15] transition-all duration-300 transform hover:-translate-y-2 overflow-hidden relative w-full sm:w-64">

                            <div className="w-32 h-32 rounded-full bg-[#11241d] border-4 border-white/5 flex items-center justify-center font-bold text-3xl relative z-10 overflow-hidden shadow-2xl group-hover:border-primary-500/30 transition-colors">
                                {member.photo ? (
                                    <img src={(process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs') + member.photo} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    idx === 0 ? '💻' : idx === 1 ? '🎯' : '📈'
                                )}
                            </div>

                            <div className="text-center relative z-10">
                                <h3 className="text-lg font-bold text-white tracking-wide mb-1">{member.name}</h3>
                                <p className="text-xs font-medium text-primary-400 uppercase tracking-widest">{member.role}</p>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export const About = ({ about }: { about?: any }) => {
    const { language } = useLanguage();

    const defaultAbout = {
        tagline: language === 'ar' ? 'شبكة متصلة بالكامل' : 'Fully Connected Network',
        title_1: language === 'ar' ? 'ما وراء الحدود.' : 'Beyond boundaries.',
        title_2: language === 'ar' ? 'نحو المستقبل.' : 'Into the future.',
        description: language === 'ar' ? 'حلول رقمية ذكية وأنظمة قابلة للتوسع' : 'Deploy smarter routing, seamless integrations, and ultimate optimisation globally.',
        cta: language === 'ar' ? 'ابدأ رحلتك' : 'Start Your Journey',
    };

    const a = about || defaultAbout;

    return (
        <section id="about" className="py-32 bg-[#030a08] relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Darker CTA Box */}
                <div className="bg-[#050f0c] border border-white/10 rounded-[2.5rem] p-12 lg:p-24 overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                    {/* Glowing Accent Ring inside */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-900/10 rounded-full blur-[80px] pointer-events-none"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none"></div>

                    <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-400 text-xs font-bold uppercase tracking-widest mb-8">
                            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                            {a.tagline}
                        </div>

                        <h2 className="text-[3rem] sm:text-[4.5rem] font-bold tracking-tight mb-8 leading-[1.1] text-white">
                            {a.title_1} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-slate-500">{a.title_2}</span>
                        </h2>

                        <p className="text-lg text-slate-400 font-medium mb-12 max-w-xl">
                            {a.description}
                        </p>

                        <a href="#contact" className="group relative inline-flex items-center gap-3 px-8 py-4 font-bold text-white transition-all bg-primary-600 rounded-full hover:bg-primary-500 shadow-[0_0_30px_rgba(4,120,87,0.3)] hover:shadow-[0_0_40px_rgba(4,120,87,0.5)] overflow-hidden transform hover:scale-105">
                            <span className="relative z-10">{a.cta}</span>
                            <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
