"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const Hero = ({ hero }: { hero?: any }) => {
    const { t } = useLanguage();
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

    // Apply parallax translation based on mouse position
    const globeMovement = {
        transform: `translate(calc(-50% + ${mousePos.x * 30}px), ${mousePos.y * 30}px)`,
        transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
    };

    return (
        <section ref={sectionRef} id="home" className="relative min-h-[105vh] bg-[#030a08] overflow-hidden flex flex-col items-center justify-center pt-32 pb-24 text-white">

            {/* Massive Glowing Orbit Atmosphere Backgrounds */}
            <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[160vw] max-w-[2000px] h-[160vw] max-h-[2000px] rounded-full border-[1px] border-primary-500/10 pointer-events-none transition-transform duration-700" style={{ transform: `translate(calc(-50% + ${mousePos.x * 10}px), ${mousePos.y * 10}px)` }}></div>
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[130vw] max-w-[1600px] h-[130vw] max-h-[1600px] rounded-full border-[1.5px] border-primary-500/15 pointer-events-none transition-transform duration-700" style={{ transform: `translate(calc(-50% + ${mousePos.x * 15}px), ${mousePos.y * 15}px)` }}></div>

            {/* The Planet/Glow with Parallax */}
            <div
                className="absolute top-[18%] left-1/2 w-[200vw] sm:w-[150vw] md:w-[130vw] lg:w-[110vw] max-w-[1400px] h-[200vw] sm:h-[150vw] md:h-[130vw] lg:h-[110vw] max-h-[1400px] rounded-[100%] bg-gradient-to-b from-[#021810] via-[#020d09] to-[#030a08] shadow-[0_-40px_120px_rgba(4,120,87,0.4)] shadow-[inset_0_80px_150px_rgba(4,120,87,0.3)] pointer-events-none border-t border-primary-400/50"
                style={globeMovement}
            >
                {/* Surface Continents (Simulated with layered radial patterns) */}
                <div
                    className="absolute inset-0 rounded-[100%] opacity-40 pointer-events-none mix-blend-screen"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 70% 30%, rgba(212,175,55,0.8) 1px, transparent 1.5px),
                            radial-gradient(circle at 60% 40%, rgba(4,120,87,0.8) 1.5px, transparent 2px),
                            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px, 35px 35px, 15px 15px',
                        maskImage: 'radial-gradient(ellipse at 75% 25%, black 10%, transparent 60%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at 75% 25%, black 10%, transparent 60%)'
                    }}
                ></div>

                {/* Secondary Continent Cluster */}
                <div
                    className="absolute inset-0 rounded-[100%] opacity-20 pointer-events-none mix-blend-screen"
                    style={{
                        backgroundImage: `radial-gradient(circle at 30% 50%, rgba(4,120,87,0.6) 1.5px, transparent 2px)`,
                        backgroundSize: '25px 25px',
                        maskImage: 'radial-gradient(ellipse at 25% 45%, black 5%, transparent 40%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at 25% 45%, black 5%, transparent 40%)'
                    }}
                ></div>

                {/* Overall Planet Grid/Dust */}
                <div className="absolute inset-0 rounded-[100%] opacity-10 bg-[radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[length:50px_50px] pointer-events-none" style={{ maskImage: 'radial-gradient(circle at 50% 20%, black, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle at 50% 20%, black, transparent 70%)' }}></div>
            </div>

            {/* Glowing Accent Arc (Atmosphere Rim) */}
            <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[200vw] sm:w-[150vw] md:w-[130vw] lg:w-[110vw] max-w-[1400px] h-40 bg-primary-500/30 blur-[60px] rounded-[100%] pointer-events-none transition-transform duration-700" style={{ transform: `translate(calc(-50% + ${mousePos.x * 25}px), ${mousePos.y * 25}px)` }}></div>

            {/* Content Container - Positioned over the globe */}
            <div className="relative z-10 w-full max-w-[90vw] md:max-w-3xl lg:max-w-4xl mx-auto px-4 text-center mt-8 md:mt-12">
                <h1 className="text-[clamp(2.5rem,6.5vw,5.5rem)] font-bold text-white tracking-tight leading-[1.1] sm:leading-[1.05] mb-6 px-2 sm:px-8">
                    {t('hero.h1')}
                </h1>

                <p className="text-[clamp(1rem,1.8vw,1.25rem)] text-slate-400 max-w-[85vw] md:max-w-[70vw] lg:max-w-2xl mx-auto font-medium mb-12 px-4 leading-relaxed">
                    {t('hero.subtitle')}
                </p>

                <div className="flex justify-center flex-wrap gap-4">
                    <a href="#products" className="group flex items-center bg-white text-black rounded-full p-1.5 pr-6 pl-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all">
                        <span className="bg-black text-white px-5 py-3 rounded-full font-bold text-sm tracking-wide mr-4 rtl:ml-4 rtl:mr-0 group-hover:bg-[#111] transition-colors">
                            {t('hero.cta_explore')}
                        </span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                    <a href="/portal/login" className="group flex items-center bg-transparent border border-white/20 text-white rounded-full px-8 py-4 hover:bg-white/10 transition-all font-bold text-sm tracking-wide">
                        {t('hero.cta_investor')}
                    </a>
                </div>
            </div>

            {/* Bottom Stats Row matching reference */}
            <div className="absolute bottom-10 left-0 right-0 w-full max-w-5xl mx-auto px-6 z-20">
                <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8 mt-12 text-center divide-x divide-white/10 rtl:divide-x-reverse">
                    {[
                        { val: t('stats.val1'), lbl: t('stats.lbl1') },
                        { val: t('stats.val2'), lbl: t('stats.lbl2') },
                        { val: t('stats.val3'), lbl: t('stats.lbl3') }
                    ].map((stat, idx) => (
                        <div key={idx}>
                            <p className="text-xl sm:text-2xl font-bold text-white mb-1">{stat.val}</p>
                            <p className="text-sm text-slate-500 font-medium">{stat.lbl}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background sweeping lights */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-900/10 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary-900/10 to-transparent pointer-events-none"></div>
        </section>
    );
};

export default Hero;
