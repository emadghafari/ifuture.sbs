"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const Hero = ({ hero }: { hero?: any }) => {
    const { language } = useLanguage();
    const sectionRef = useRef<HTMLElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!sectionRef.current) return;
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Calculate mouse position relative to center (-1 to 1)
            const x = (clientX / innerWidth) * 2 - 1;
            const y = (clientY / innerHeight) * 2 - 1;

            setMousePos({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Subtle parallax for floating elements
    const parallaxPrimary = {
        transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
        transition: 'transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)'
    };

    const parallaxSecondary = {
        transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
        transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)'
    };

    // Translations based on reference
    const d = {
        badge: language === 'ar' ? 'وكالة تطوير معتمدة' : language === 'he' ? 'סוכנות פיתוח מוסמכת' : 'Certified Development Agency',
        title_1: language === 'ar' ? 'أنظمة تدفع' : language === 'he' ? 'מערכות שמניעות' : 'Websites that Drive',
        title_2: language === 'ar' ? 'نمو أعمالك' : language === 'he' ? 'צמיחה עסקית' : 'Pipeline Growth',
        subtitle: language === 'ar' ? 'اصنع منصة تقود نمو التسويق والمبيعات مع وكالة تفهم احتياجات الشركات والمؤسسات بعمق.' : language === 'he' ? 'צור פלטפורמה שמניעה צמיחה בשיווק ומכירות עם סוכנות שמבינה לעומק את צרכי הארגונים.' : 'Create a website that drives marketing and sales growth with an agency that understands B2B.',
        btn_primary: language === 'ar' ? 'احجز مكالمة' : language === 'he' ? 'הזמן שיחה' : 'Book a Call',
        btn_secondary: language === 'ar' ? 'شاهد أعمالنا' : language === 'he' ? 'צפה בעבודות' : 'See Work'
    };

    return (
        <section ref={sectionRef} id="home" className="relative min-h-[100vh] bg-[#030a08] overflow-hidden flex items-center pt-24 pb-20">
            {/* Background Base Gradients representing the dark canvas with subtle green glow on the left/top */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-br from-primary-900/20 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(4,120,87,0.15)_0%,transparent_60%)] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

                {/* Left Column: Text & CTAs */}
                <div className="flex flex-col items-start text-left rtl:text-right">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-900/20 text-primary-400 text-xs font-semibold tracking-wide mb-8 shadow-[0_0_15px_rgba(4,120,87,0.15)]">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                        </svg>
                        {d.badge}
                    </div>

                    {/* Headline */}
                    <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium text-white tracking-tight leading-[1.05] mb-6">
                        {d.title_1} <br />
                        {d.title_2}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-[#a1a1aa] text-[clamp(1rem,1.5vw,1.1rem)] max-w-lg leading-relaxed mb-10 font-normal">
                        {d.subtitle}
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap items-center gap-6">
                        <a href="#contact" className="px-8 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]">
                            {d.btn_primary}
                        </a>
                        <a href="#portfolio" className="group flex items-center gap-2 text-white font-medium text-sm hover:text-slate-300 transition-colors">
                            {d.btn_secondary}
                            <svg className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Right Column: 3D UI Illustration */}
                <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center pointer-events-none mt-10 lg:mt-0">

                    {/* The Background Dark UI Panel (Sidebar abstraction) */}
                    <div className="absolute right-[-15%] top-1/2 -translate-y-1/2 w-[350px] h-[500px] bg-[#050505] border border-white/5 rounded-2xl shadow-2xl opacity-80 flex flex-col p-6 skew-y-12 rotate-y-[-20deg] perspective-1000">
                        <div className="flex items-center justify-between mb-8 opacity-40 border-b border-white/5 pb-4">
                            <div className="w-20 h-3 bg-white/20 rounded"></div>
                            <div className="flex gap-2"><div className="w-4 h-4 bg-white/20 rounded"></div><div className="w-4 h-4 bg-white/20 rounded"></div></div>
                        </div>
                        <div className="space-y-4 opacity-30">
                            {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded bg-white/20"></div>
                                    <div className="w-full h-2 rounded bg-white/10" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Central Glow representing the Lightning Bolt */}
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-primary-500 rounded-full blur-[100px] opacity-30"></div>

                    {/* Simulated Lightning Jagged Line (SVG) */}
                    <svg className="absolute w-[150px] h-[200px] left-[40%] top-[25%] opacity-90 filter drop-shadow-[0_0_10px_rgba(4,120,87,0.6)]" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={parallaxSecondary}>
                        <path d="M70 10 L45 80 L65 85 L20 180" stroke="url(#paint0_linear)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <defs>
                            <linearGradient id="paint0_linear" x1="45" y1="10" x2="45" y2="180" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#34d399" />
                                <stop offset="1" stopColor="#059669" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Top Floating Glass Card (W Logo) */}
                    <div className="absolute top-[10%] left-[35%] w-32 h-32 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center transform rotate-12" style={parallaxPrimary}>
                        <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-50 mix-blend-overlay"></div>
                        <svg className="w-14 h-14 text-primary-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)] relative z-10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 22h5l5-10 5 10h5L12 2z" />
                        </svg>
                    </div>

                    {/* Bottom Floating Glass Card (Octagon Logo) */}
                    <div className="absolute top-[45%] left-[20%] w-28 h-28 rounded-3xl bg-gradient-to-br from-[#092b1d]/90 to-[#03150e]/90 backdrop-blur-xl border border-primary-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center transform -rotate-6" style={{ ...parallaxSecondary, transitionDelay: '50ms' }}>
                        <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-50 mix-blend-overlay"></div>
                        <svg className="w-12 h-12 text-primary-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)] relative z-10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L22 7v10l-10 5-10-5V7l10-5zm0 2.3L4.5 8.2v7.6L12 19.7l7.5-3.9V8.2L12 4.3z" />
                        </svg>
                    </div>

                    {/* Foreground Transparent Graph Card */}
                    <div className="absolute bottom-[5%] left-[15%] w-[380px] h-[160px] bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-[0_30px_60px_rgba(0,0,0,0.6)]" style={{ ...parallaxPrimary, transitionDelay: '100ms' }}>
                        <div className="flex justify-between text-[10px] text-slate-500 mb-4 font-mono font-medium">
                            <span>Lead volume</span>
                            <div className="flex gap-2"><span>40k</span><span>30k</span><span>20k</span><span>10k</span><span>0</span></div>
                        </div>
                        <div className="flex items-end justify-between h-[80px] gap-2">
                            {[20, 35, 25, 45, 30, 50, 40, 60, 55, 75, 65, 85, 95].map((height, i) => (
                                <div key={i} className={`w-full rounded-t-sm transition-all duration-1000`} style={{ height: `${height}%`, backgroundColor: height > 70 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)' }}></div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Very faint noise overlay across the whole section to match the textured black look */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjEwMCIvPgo8L3N2Zz4=')]"></div>

        </section>
    );
};

export default Hero;
