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

const ProductsGrid = ({ products }: ProductsGridProps) => {
    const { language } = useLanguage();

    return (
        <section id="products" className="py-32 bg-[#030a08] relative">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-[3rem] sm:text-[4rem] font-bold text-white tracking-tight leading-[1.1] mb-6">
                        {language === 'ar' ? 'اكتشف أنظمتنا' : language === 'he' ? 'גלה את המערכות שלנו' : 'Discover Our Systems'}
                    </h2>
                    <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">
                        {language === 'ar' ? 'حلول بُنيت من الأساس لمنحك التحكم الكامل والقوة الكافية للنمو.' :
                            language === 'he' ? 'פתרונות שנבנו מהיסוד לתת לך שליטה מלאה וכוח מספיק לצמוח.' :
                                'Solutions built from the ground up to give you total control and power to grow.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, idx) => (
                        <div key={product.id} className="group relative bg-[#06120e] rounded-3xl border border-white/5 overflow-hidden hover:border-primary-500/30 transition-colors duration-500 h-full flex flex-col">

                            {/* Inner Glow built-in */}
                            <div className="absolute inset-0 bg-gradient-to-b from-primary-500/0 via-primary-500/0 to-primary-500/5 group-hover:to-primary-500/10 pointer-events-none transition-colors duration-500"></div>

                            {/* Optional Banner Image */}
                            {product.image && (
                                <div className="w-full h-56 overflow-hidden relative z-10 border-b border-white/5">
                                    <img src={(process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs') + product.image} alt={product.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#06120e] to-transparent"></div>
                                </div>
                            )}

                            <div className={`p-8 flex flex-col flex-grow relative z-10 ${product.image ? 'pt-4' : ''}`}>
                                {/* Icon/Image Placeholder Area directly injected if no image */}
                                {!product.image && (
                                    <div className="w-16 h-16 rounded-2xl bg-[#0a1b15] border border-white/5 flex items-center justify-center mb-8 shadow-inner relative z-10 group-hover:scale-110 transition-transform duration-500">
                                        <span className="text-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                                            {idx === 0 ? '⚡' : idx === 1 ? '🛍️' : idx === 2 ? '🌐' : idx === 3 ? '🛡️' : idx === 4 ? '📊' : '🚀'}
                                        </span>
                                    </div>
                                )}

                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{product.title}</h3>
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="mt-10">
                                    <a
                                        href={product.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-bold text-primary-400 hover:text-gold-400 transition-colors group/link"
                                    >
                                        <span>{language === 'ar' ? 'اطلع المزيد' : language === 'he' ? 'קרא עוד' : 'Learn more'}</span>
                                        <svg className="w-4 h-4 group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </a>
                                </div>
                            </div>

                            {/* Corner Accent Glow */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/20 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductsGrid;
