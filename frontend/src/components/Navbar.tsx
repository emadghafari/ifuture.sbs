"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

const Navbar = ({ site }: { site?: any }) => {
    const { language, setLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'ar', name: 'العربية' },
        { code: 'he', name: 'עברית' },
        { code: 'en', name: 'English' },
    ] as const;

    return (
        <div className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-6 flex justify-center pointer-events-none">

            {/* The Floating Pill Navbar */}
            <nav className="w-full max-w-6xl bg-[#091512]/60 backdrop-blur-2xl border border-white/5 rounded-full px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto flex justify-between items-center">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    {site?.logo ? (
                        <div className="relative w-9 h-9">
                            <Image src={(process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs') + site.logo} alt="Logo" fill className="object-contain" />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-gold-400 flex items-center justify-center p-0.5">
                            <div className="w-full h-full bg-[#030a08] rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-gold-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    )}
                    <span className="text-xl font-bold text-white tracking-tight group-hover:text-gold-400 transition-colors">
                        {site?.name || 'iFuture Hub'}
                    </span>
                </Link>

                {/* Centered Links */}
                <div className="hidden md:flex items-center gap-8 md:gap-10">
                    <Link href="#home" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{t('nav_home')}</Link>
                    <Link href="#products" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{t('nav_products')}</Link>
                    <Link href="#about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{t('nav_about')}</Link>
                    <Link href="#contact" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{t('nav_contact')}</Link>
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <div className="relative group">
                        <button className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            <span>{language.toUpperCase()}</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <div className="absolute right-0 rtl:left-0 mt-2 w-32 bg-[#0d1f1c] rounded-2xl shadow-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.code)}
                                    className={`w-full text-center px-4 py-3 hover:bg-white/5 transition-colors text-sm font-medium ${language === lang.code ? 'text-gold-400' : 'text-slate-300'}`}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/portal/login" className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/20 font-semibold text-sm transition-all flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                            {t('nav_login')}
                        </Link>
                        <Link href="#contact" className="px-6 py-2.5 rounded-full bg-primary-600 hover:bg-primary-500 text-white shadow-[0_0_20px_rgba(4,120,87,0.4)] font-semibold text-sm transition-all transform hover:scale-105 border border-primary-400/30">
                            {language === 'ar' ? 'ابدأ الآن' : language === 'he' ? 'התחל' : 'Get Started'}
                        </Link>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-20 left-4 right-4 bg-[#091512]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-2xl pointer-events-auto md:hidden">
                    <div className="flex flex-col space-y-4">
                        <Link href="#home" className="text-white font-medium text-lg" onClick={() => setIsOpen(false)}>{t('nav_home')}</Link>
                        <Link href="#products" className="text-white font-medium text-lg" onClick={() => setIsOpen(false)}>{t('nav_products')}</Link>
                        <Link href="#about" className="text-white font-medium text-lg" onClick={() => setIsOpen(false)}>{t('nav_about')}</Link>
                        <Link href="#contact" className="text-white font-medium text-lg" onClick={() => setIsOpen(false)}>{t('nav_contact')}</Link>
                        <Link href="/portal/login" className="text-gold-400 font-medium text-lg" onClick={() => setIsOpen(false)}>{t('nav_login')}</Link>

                        <div className="flex gap-2 pt-4 border-t border-white/10">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => { setLanguage(lang.code); setIsOpen(false); }}
                                    className={`flex-1 py-2 rounded-xl text-sm font-medium ${language === lang.code ? 'bg-primary-600 text-white' : 'bg-white/5 text-slate-300'}`}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
