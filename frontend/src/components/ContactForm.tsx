"use client";
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const ContactForm = ({ site }: { site?: any }) => {
    const { language, t } = useLanguage();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await import('@/utils/api').then(m => m.postContactMessage({ ...formData, locale: language || 'en' }));
            alert('Message sent successfully!');
            setFormData({ name: '', email: '', phone: '', company: '', message: '' });
        } catch (err) {
            console.error(err);
            alert('Failed to send message. Please try again.');
        }
    };

    const l = language === 'ar' ? {
        title: 'أخبرنا عن مشروعك',
        subtitle: 'فريقنا جاهز لدراسة احتياجاتك وتقديم الحلول الأنسب لنمو أعمالك.',
        name: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'رقم الهاتف',
        company: 'اسم الشركة', message: 'كيف يمكننا مساعدتك؟', submit: 'إرسال الرسالة'
    } : language === 'he' ? {
        title: 'ספר לנו על הפרויקט שלך',
        subtitle: 'הצוות שלנו מוכן ללמוד את הצרכים שלך ולספק את הפתרונות המתאימים ביותר לצמיחת העסק שלך.',
        name: 'שם מלא', email: 'אימייל', phone: 'מספר טלפון',
        company: 'שם חברה', message: 'איך אפשר לעזור?', submit: 'שלח הודעה'
    } : {
        title: 'Tell us about your project',
        subtitle: 'Our team is ready to analyze your needs and provide the best solutions for your business growth.',
        name: 'Full Name', email: 'Email Address', phone: 'Phone Number',
        company: 'Company Name', message: 'How can we help?', submit: 'Send Message'
    };

    return (
        <section id="contact" className="py-32 bg-[#030a08] relative border-t border-white/5">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="text-center mb-16">
                    <h2 className="text-[3rem] sm:text-[4rem] font-bold text-white tracking-tight mb-4 leading-[1.1]">{l.title}</h2>
                    <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">{l.subtitle}</p>
                </div>

                <div className="bg-[#06120e] rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-primary-500/20 relative overflow-hidden">

                    {/* Glowing Accent */}
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary-600/20 blur-[80px] rounded-full pointer-events-none"></div>

                    {/* Dynamic Contact Details Block */}
                    {(site?.email || site?.phone || site?.address) && (
                        <div className="relative z-10 flex flex-wrap gap-8 justify-center items-center mb-10 pb-8 border-b border-white/5">
                            {site?.email && (
                                <div className="flex items-center gap-3 text-slate-300">
                                    <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400">✉️</div>
                                    <a href={`mailto:${site.email}`} className="font-semibold text-sm hover:text-white transition-colors">{site.email}</a>
                                </div>
                            )}
                            {site?.phone && (
                                <div className="flex items-center gap-3 text-slate-300">
                                    <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400">📞</div>
                                    <a href={`tel:${site.phone}`} className="font-semibold text-sm hover:text-white transition-colors" dir="ltr">{site.phone}</a>
                                </div>
                            )}
                            {site?.address && (
                                <div className="flex items-center gap-3 text-slate-300">
                                    <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400">📍</div>
                                    <span className="font-semibold text-sm">{site.address}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">{l.name}</label>
                                <input
                                    type="text" required placeholder="John Doe"
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 font-medium focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">{l.email}</label>
                                <input
                                    type="email" required placeholder="john@example.com"
                                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 font-medium focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">{l.phone}</label>
                                <input
                                    type="tel" placeholder="+1 (555) 000-0000"
                                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 font-medium focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">{l.company}</label>
                                <input
                                    type="text" placeholder="Acme Inc."
                                    value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 font-medium focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">{l.message}</label>
                            <textarea
                                rows={4} required placeholder="We are looking to upgrade our systems..."
                                value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 font-medium focus:bg-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none resize-none"
                            ></textarea>
                        </div>

                        <div className="pt-4 text-center">
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-12 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(4,120,87,0.4)] hover:shadow-[0_0_30px_rgba(4,120,87,0.6)] transition-all transform hover:-translate-y-1"
                            >
                                {l.submit}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
