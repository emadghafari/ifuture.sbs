"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { fetchHomeData } from '@/utils/api';

export default function ContactPage() {
    const { language } = useLanguage();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const homeData = await fetchHomeData(language);
                setData(homeData);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [language]);

    if (loading || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#030a08]">
            <Navbar site={data.site} />
            <div className="animate-page-enter pt-32 min-h-[70vh] flex flex-col justify-center">
                <ContactForm site={data.site} />
            </div>
            <Footer site={data.site} />
        </main>
    );
}
