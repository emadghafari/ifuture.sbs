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
        <About about={data.about} />

        {/* Platform Features / More Explanation Section */}
        <section className="py-24 bg-[#050f0c] border-t border-white/5 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(4,120,87,0.15)_0%,transparent_70%)] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">{language === 'ar' ? 'منصة متكاملة تجمع بين الاستثمار والتكنولوجيا' : language === 'he' ? 'פלטפורמה משולבת של השקעות וטכנולוגיה' : 'An Integrated Platform Combining Investment and Technology'}</h2>
              <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">{language === 'ar' ? 'نحن لا نقدم مجرد فرص استثمارية، بل نبني أنظمة برمجية متطورة تدير هذه الاستثمارات بدقة وتضمن لك شفافية كاملة في تتبع أرباحك وإدارة محافظك بكل أمان وموثوقية، مدعومة ببنية تحتية قوية وأدوات تحليل متقدمة.' : language === 'he' ? 'אנו לא רק מציעים הזדמנויות השקעה, אלא בונים מערכות תוכנה מתקדמות המנהלות השקעות אלו בדיוק רב, מבטיחות שקיפות מלאה במעקב אחר הרווחים שלך וניהול התיקים שלך בביטחון, בגיבוי תשתית חזקה וכלים אנליטיים.' : 'We don’t just offer investment opportunities; we engineer advanced software systems that manage these investments with precision, ensuring complete transparency in tracking your profits and managing your portfolios securely, backed by a robust infrastructure and advanced analytics.'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="bg-[#091512] border border-white/5 p-8 rounded-[2rem] hover:border-primary-500/30 hover:bg-[#0a1b15] transition-all duration-300 shadow-xl group">
                <div className="w-14 h-14 bg-primary-900/30 text-primary-400 rounded-2xl flex items-center justify-center mb-6 border border-primary-500/20 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{language === 'ar' ? 'أمان تام وتشفير عالي' : language === 'he' ? 'אבטחה והצפנה ברמה גבוהה' : 'Complete Security'}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{language === 'ar' ? 'نحمي بياناتك واستثماراتك بأحدث بروتوكولات الأمان العالمية والتشفير المتقدم (KYC).' : language === 'he' ? 'אנו מגנים על הנתונים וההשקעות שלך עם פרוטוקולי האבטחה העדכניים וההצפנה המתקדמת (KYC).' : 'Protecting your data and investments with the latest global security protocols and advanced encryption (KYC).'}</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#091512] border border-white/5 p-8 rounded-[2rem] hover:border-primary-500/30 hover:bg-[#0a1b15] transition-all duration-300 shadow-xl group">
                <div className="w-14 h-14 bg-gold-900/30 text-gold-400 rounded-2xl flex items-center justify-center mb-6 border border-gold-500/20 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{language === 'ar' ? 'عوائد استثمارية مجزية' : language === 'he' ? 'תשואות השקעה מתגמלות' : 'Rewarding Returns'}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{language === 'ar' ? 'مشاريع تقنية مبتكرة سريعة النمو תضمن تحقيق هوامش ربح ممتازة وتوزيعات أرباح منتظمة.' : language === 'he' ? 'פרויקטים טכנולוגיים חדשניים בצמיחה מהירה המבטיחים שולי רווח מצוינים וחלוקת רווחים קבועה.' : 'Innovative rapid-growth tech projects that ensure excellent profit margins and regular dividend distributions.'}</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#091512] border border-white/5 p-8 rounded-[2rem] hover:border-primary-500/30 hover:bg-[#0a1b15] transition-all duration-300 shadow-xl group">
                <div className="w-14 h-14 bg-blue-900/30 text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{language === 'ar' ? 'شفافية وتقارير فورية' : language === 'he' ? 'שקיפות ודוחות מיידיים' : 'Transparent Analytics'}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{language === 'ar' ? 'لوحة تحكم ذكية شخصية تتيح لك رؤية أداء كل استثماراتك وإيراداتك بشكل لحظي وشفاف.' : language === 'he' ? 'לוח בקרה אישי חכם המאפשר לך לראות את ביצועי כל ההשקעות וההכנסות שלך בזמן אמת ובשקיפות.' : 'A smart personal dashboard allowing you to strictly monitor your investment performance and revenues in real-time.'}</p>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#091512] border border-white/5 p-8 rounded-[2rem] hover:border-primary-500/30 hover:bg-[#0a1b15] transition-all duration-300 shadow-xl group">
                <div className="w-14 h-14 bg-purple-900/30 text-purple-400 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{language === 'ar' ? 'عقود ذكية مُلزمة' : language === 'he' ? 'חוזים חכמים מחייבים' : 'Legally Binding Contracts'}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{language === 'ar' ? 'يتم توثيق الاستثمارات بعقود قانونية إلكترونية رسمية (موقعة E-Sign) تحفظ حقوق جميع الأطراف.' : language === 'he' ? 'ההשקעות מתועדות בחוזים אלקטרוניים רשמיים (חתימה אלקטרונית) המגנים על כל הצדדים.' : 'Investments are documented with official electronic legal contracts (E-Sign) to protect everyone’s rights.'}</p>
              </div>
            </div>
          </div>
        </section>

        <ProductsGrid products={data.products} />
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
