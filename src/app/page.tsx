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
    <main className="min-h-screen bg-[#030a08] text-white">
      <Navbar site={data.site} />
      <div className="animate-page-enter">
        <Hero hero={data.hero} />

        {/* How to Invest Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">{language === 'ar' ? 'كيف يعمل الاستثمار؟' : language === 'he' ? 'איך עובדת ההשקעה?' : 'How Investment Works?'}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">{language === 'ar' ? 'خطوات بسيطة وآمنة للبدء في بناء محفظتك الاستثمارية الذكية وإدارة مشاريعك المستقبلية.' : language === 'he' ? 'צעדים פשוטים ובטוחים להתחיל לבנות את תיק ההשקעות החכם שלך ולנהל את הפרויקטים העתידיים שלך.' : 'Simple and secure steps to start building your smart investment portfolio and managing future projects.'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary-900/0 via-gold-500/30 to-primary-900/0 -translate-y-1/2 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 bg-[#091512]/60 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] text-center hover:bg-[#0a1b15]/80 transition-all duration-300 shadow-xl group">
              <div className="w-16 h-16 mx-auto bg-primary-900/30 text-gold-400 rounded-full flex items-center justify-center text-2xl font-bold mb-6 border border-gold-500/20 group-hover:scale-110 group-hover:bg-primary-500/20 group-hover:border-gold-400/50 transition-all duration-500 shadow-[0_0_15px_rgba(250,204,21,0.1)]">1</div>
              <h3 className="text-xl font-bold text-white mb-3">{language === 'ar' ? 'سجل حسابك' : language === 'he' ? 'רשום את חשבונך' : 'Register Account'}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{language === 'ar' ? 'أنشئ حسابك الاستثماري الخاص بخطوات بسيطة مع نظام التوثيق الآمن وحماية البيانات.' : language === 'he' ? 'צור את חשבון ההשקעה הפרטי שלך בצעדים פשוטים עם מערכת אימות בטוחה והגנת נתונים.' : 'Create your secure private investment account in minutes with our protected KYC verification systems.'}</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 bg-[#091512]/60 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] text-center hover:bg-[#0a1b15]/80 transition-all duration-300 shadow-xl group md:-translate-y-4">
              <div className="w-16 h-16 mx-auto bg-primary-900/30 text-gold-400 rounded-full flex items-center justify-center text-2xl font-bold mb-6 border border-gold-500/20 group-hover:scale-110 group-hover:bg-primary-500/20 group-hover:border-gold-400/50 transition-all duration-500 shadow-[0_0_15px_rgba(250,204,21,0.1)]">2</div>
              <h3 className="text-xl font-bold text-white mb-3">{language === 'ar' ? 'اختر مشروعك المفضل' : language === 'he' ? 'בחר פרויקט מועדף' : 'Choose Your Project'}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{language === 'ar' ? 'تصفح باقة المشاريع الاستثمارية المربحة واقرأ التقارير المالية لتقرر الوجهة الأنسب لأموالك.' : language === 'he' ? 'עיין בחבילת פרויקטי ההשקעה הרווחיים וקרא דוחות פיננסיים כדי להחליט על היעד המתאים ביותר.' : 'Scroll through our curated campaigns, scrutinize the financials, and discover the project that matches your vision.'}</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 bg-[#091512]/60 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] text-center hover:bg-[#0a1b15]/80 transition-all duration-300 shadow-xl group">
              <div className="w-16 h-16 mx-auto bg-primary-900/30 text-gold-400 rounded-full flex items-center justify-center text-2xl font-bold mb-6 border border-gold-500/20 group-hover:scale-110 group-hover:bg-primary-500/20 group-hover:border-gold-400/50 transition-all duration-500 shadow-[0_0_15px_rgba(250,204,21,0.1)]">3</div>
              <h3 className="text-xl font-bold text-white mb-3">{language === 'ar' ? 'وقع العقد واجني الأرباح' : language === 'he' ? 'חתום על חוזה והרווח' : 'E-Sign & Earning'}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{language === 'ar' ? 'حدد قيمة أسهمك وقم بتوقيع عقدك القانوني إلكترونياً من مكانك، ثم تابع نمو أرباحك لحظة بلحظة.' : language === 'he' ? 'קבע את ערך מניותיך וחתום על החוזה המשפטי שלך אלקטרונית מכל מקום, ואז עקוב אחר צמיחת הרווחים שלך.' : 'Specify your equity, securely E-Sign the legally binding investment contract, and unlock access to the revenue dashboard.'}</p>
            </div>
          </div>
        </section>

        <Footer site={data.site} />
      </div>
    </main>
  );
}
