"use client";
import React, { useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';

export const PromotionalVideo = () => {
    const { language } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    const text = {
        badge: language === 'ar' ? 'رؤيتنا' : language === 'he' ? 'החזון שלנו' : 'OUR VISION',
        titlePart1: language === 'ar' ? 'الاستثمار الرقمي،' : language === 'he' ? 'השקעה דיגיטלית,' : 'Digital Investment,',
        titlePart2: language === 'ar' ? 'أعيد تصوره.' : language === 'he' ? 'הומצא מחדש.' : 'Reimagined.',
        description: language === 'ar'
            ? 'اكتشف كيف نقوم بهندسة المستقبل. منصتنا تجمع بين الأمان المطلق، والعوائد الموثقة، لتمنحك تجربة استثمارية خالية من التعقيدات، تتحدث لغة الأرقام الصريحة.'
            : language === 'he'
                ? 'גלה כיצד אנו מהנדסים את העתיד. הפלטפורמה שלנו משלבת אבטחה מוחלטת עם תשואות מוכחות, ומעניקה לך חוויית השקעה חלקה שמדברת בשפת המספרים החדים.'
                : 'Discover how we engineer the future. Our platform merges absolute security with proven returns, giving you a seamless investment experience that speaks the language of sharp numbers.'
    };

    return (
        <section ref={containerRef} className="py-32 bg-[#030a08] relative overflow-hidden border-t border-white/5">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(4,120,87,0.03)_0%,transparent_70%)] pointer-events-none"></div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                    {/* Textual Content - Soft & Elegant */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col gap-6 md:pl-8 lg:pl-16 relative z-10 lg:col-span-5"
                    >
                        <div className="inline-flex max-w-max items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/20 bg-primary-900/10 text-primary-400 text-xs font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(4,120,87,0.1)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse"></div>
                            {text.badge}
                        </div>

                        <h2 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] font-medium tracking-tight leading-[1.1] text-white">
                            {text.titlePart1} <br />
                            <span className="text-transparent font-semibold bg-clip-text bg-gradient-to-r from-primary-200 to-primary-600 block mt-2">{text.titlePart2}</span>
                        </h2>

                        <p className="text-lg md:text-xl text-slate-300/80 font-light leading-relaxed max-w-xl">
                            {text.description}
                        </p>
                    </motion.div>

                    {/* Video Player - Glassmorphic & Floating */}
                    <motion.div
                        style={{ y, opacity }}
                        className="relative w-full aspect-video rounded-3xl md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#050f0c] lg:col-span-7"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/10 to-transparent pointer-events-none z-10 mix-blend-overlay"></div>
                        <video
                            src="/promo-video.mp4"
                            className="w-full h-full object-cover scale-[1.05]"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
