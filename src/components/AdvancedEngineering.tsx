"use client";
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

export const AdvancedEngineering = () => {
    const { language } = useLanguage();

    const text = {
        badge: language === 'ar' ? 'هندسة متقدمة' : language === 'he' ? 'הנדסה מתקדמת' : 'ADVANCED ENGINEERING',
        titlePart1: language === 'ar' ? 'تتجاوز الحدود.' : language === 'he' ? 'מעבר לגבולות.' : 'Beyond boundaries.',
        titlePart2: language === 'ar' ? 'نحو المستقبل.' : language === 'he' ? 'אל תוך העתיד.' : 'Into the future.',
        description: language === 'ar'
            ? 'نحن أكثر من مجرد مزود لخدمة برمجية (SaaS). نحن شريكك التقني، نهندس لك برمجيات مخصصة لحل أعقد التحديات. بداية من إطلاق النماذج الأولية (MVPs) للشركات الناشئة وصولاً للأنظمة المترابطة المعقدة للمؤسسات.'
            : language === 'he'
                ? 'אנו יותר מסתם ספק SaaS. אנו השותף הטכני שלך, מהנדסים תוכנה מותאמת אישית לפתרון אתגרים מורכבים. החל מהשקת MVPs מהירים לסטארטאפים ועד לארכיטקטורה של מערכות אקולוגיות משולבות לארגונים.'
                : 'We are more than a SaaS provider. We are your technical partner, engineering custom software to solve complex challenges. From launching dynamic MVPs for startups to architecting interconnected enterprise ecosystems.',
        button: language === 'ar' ? 'ناقش فكرتك' : language === 'he' ? 'דון ברעיון שלך' : 'Discuss Your Idea'
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="py-24 bg-[#050f0c] relative flex justify-center px-4 sm:px-6"
        >
            <div className="max-w-[1200px] w-full rounded-[2.5rem] border border-white/5 bg-[#030806] p-12 md:p-24 text-center relative overflow-hidden flex flex-col items-center">

                {/* Subtle Background Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40 mix-blend-screen pointer-events-none fade-edges"></div>

                {/* Badge */}
                <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/20 bg-primary-900/10 text-primary-400 text-[0.65rem] md:text-xs font-bold tracking-widest uppercase mb-10 shadow-[0_0_15px_rgba(4,120,87,0.15)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div>
                    {text.badge}
                </div>

                {/* Main Heading */}
                <h2 className="relative z-10 text-[clamp(2.5rem,5vw,4.5rem)] font-bold text-white tracking-tight leading-[1.1] mb-8">
                    {text.titlePart1} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">{text.titlePart2}</span>
                </h2>

                {/* Description */}
                <p className="relative z-10 text-slate-400 text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-medium mb-12">
                    {text.description}
                </p>

                {/* CTA Button */}
                <a href="#contact" className="relative z-10 group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-primary-600 text-white font-bold text-sm hover:bg-primary-500 transition-all duration-300 shadow-[0_10px_30px_rgba(4,120,87,0.3)] hover:shadow-[0_15px_40px_rgba(4,120,87,0.5)] transform hover:-translate-y-1">
                    {text.button}
                    <svg className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
            </div>

            <style jsx>{`
                .fade-edges {
                    mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
                    -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
                }
            `}</style>
        </motion.section>
    );
};
