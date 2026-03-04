"use client";
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface Product {
    id: number;
    slug: string;
    url: string;
    image: string;
    title: string;
    description: string;
}

interface ProductsGridProps {
    products: Product[];
}

const ProductsGrid = ({ products }: { products?: any[] }) => {
    const { t } = useLanguage();

    const staticProducts = [
        {
            titleKey: 'products.card_title',
            descKey: 'products.card_desc',
            iconType: 'qr',
            colorRef: 'group-hover:text-primary-400 group-hover:bg-primary-500/20'
        },
        {
            titleKey: 'products.crm_title',
            descKey: 'products.crm_desc',
            iconType: 'crm',
            colorRef: 'group-hover:text-indigo-400 group-hover:bg-indigo-500/20'
        },
        {
            titleKey: 'products.school_title',
            descKey: 'products.school_desc',
            iconType: 'school',
            colorRef: 'group-hover:text-amber-400 group-hover:bg-amber-500/20'
        },
        {
            titleKey: 'products.gym_title',
            descKey: 'products.gym_desc',
            iconType: 'gym',
            colorRef: 'group-hover:text-emerald-400 group-hover:bg-emerald-500/20'
        }
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'qr': return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>;
            case 'crm': return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
            case 'school': return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>;
            case 'gym': return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
            default: return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
        }
    };

    return (
        <section id="products" className="py-32 bg-[#030a08] relative -mt-10 rounded-t-[3rem] sm:rounded-t-[4rem] z-20 border-t border-white/5">
            {/* Glowing Background Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-900/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-[3rem] sm:text-[4.5rem] font-extrabold text-white tracking-tight mb-6 leading-[1.1]">{t('footer.platforms_title')}</h2>
                    <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
                        {t('hero.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                    {staticProducts.map((item, idx) => (
                        <div key={idx} className="group relative bg-[#06120e] border border-white/5 rounded-[2.5rem] p-8 hover:bg-[#081711] transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col h-full">

                            {/* Card Hover Gradient Banner */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-white/10 text-slate-500 bg-white/5 ${item.colorRef} transition-colors duration-500`}>
                                {getIcon(item.iconType)}
                            </div>

                            <h3 className="text-2xl font-bold text-white tracking-wide mb-4 relative z-10">
                                {t(item.titleKey)}
                            </h3>

                            <p className="text-slate-400 font-medium leading-relaxed mb-8 flex-grow relative z-10">
                                {t(item.descKey)}
                            </p>

                            <div className="pt-6 border-t border-white/5 mt-auto flex items-center justify-between text-sm font-bold text-slate-300 group-hover:text-primary-400 transition-colors relative z-10">
                                <span>{t('hero.cta_explore')}</span>
                                <svg className="w-5 h-5 rtl:rotate-180 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductsGrid;
