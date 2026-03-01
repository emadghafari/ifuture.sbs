"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'he' | 'en';

interface LanguageContextType {
    language: Language;
    direction: 'rtl' | 'ltr';
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && ['ar', 'he', 'en'].includes(savedLang)) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
        document.documentElement.dir = (lang === 'ar' || lang === 'he') ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    };

    useEffect(() => {
        document.documentElement.dir = (language === 'ar' || language === 'he') ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    const direction = (language === 'ar' || language === 'he') ? 'rtl' : 'ltr';

    const translations: Record<Language, Record<string, string>> = {
        ar: { 'nav_home': 'الرئيسية', 'nav_products': 'المنتجات', 'nav_about': 'عن الشركة', 'nav_contact': 'اتصل بنا', 'nav_admin': 'لوحة التحكم', 'nav_login': 'دخول المستثمرين', 'footer_about': 'من نحن', 'footer_partners': 'شركاؤنا', 'footer_sales': 'اتصل بالمبيعات', 'footer_portal': 'بوابة الإدارة', 'footer_privacy': 'سياسة الخصوصية', 'footer_terms': 'شروط الخدمة', 'footer_cookies': 'إرشادات ملفات تعريف الارتباط', 'footer_platforms_title_fallback': 'المنصات', 'footer_company_title_fallback': 'الشركة' },
        he: { 'nav_home': 'דף הבית', 'nav_products': 'מוצרים', 'nav_about': 'אודות', 'nav_contact': 'צור קשר', 'nav_admin': 'ניהול', 'nav_login': 'כניסת משקיעים', 'footer_about': 'אודותינו', 'footer_partners': 'שותפים', 'footer_sales': 'צור קשר עם המכירות', 'footer_portal': 'פורטל ניהול', 'footer_privacy': 'מדיניות פרטיות', 'footer_terms': 'תנאי שירות', 'footer_cookies': 'הנחיות עוגיות', 'footer_platforms_title_fallback': 'פלטפורמות', 'footer_company_title_fallback': 'חברה' },
        en: { 'nav_home': 'Home', 'nav_products': 'Products', 'nav_about': 'About', 'nav_contact': 'Contact Us', 'nav_admin': 'Admin', 'nav_login': 'Investor Login', 'footer_about': 'About Us', 'footer_partners': 'Partners', 'footer_sales': 'Contact Sales', 'footer_portal': 'Admin Portal', 'footer_privacy': 'Privacy Policy', 'footer_terms': 'Terms of Service', 'footer_cookies': 'Cookie Guidelines', 'footer_platforms_title_fallback': 'PLATFORMS', 'footer_company_title_fallback': 'COMPANY' },
    };

    const t = (key: string) => translations[language][key] || key;

    return (
        <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};
