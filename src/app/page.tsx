"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductsGrid from '@/components/ProductsGrid';
import FeaturedProjects from '@/components/FeaturedProjects';
import { About, Team } from '@/components/Segments';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { fetchHomeData } from '@/utils/api';

export default function Home() {
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
    <main className="min-h-screen">
      <Navbar site={data.site} />
      <div className="animate-page-enter">
        <Hero hero={data.hero} />
        <ProductsGrid products={data.products} />
        <FeaturedProjects projects={data.featured_projects} />
        <About about={data.about} />
        <Team members={data.team} teamInfo={data.team_info} />
        <ContactForm site={data.site} />
        <Footer site={data.site} />
      </div>
    </main>
  );
}
