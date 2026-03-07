import React from 'react';
import Link from 'next/link';
import CampaignsList from '@/components/CampaignsList';

// Fetch projects serverside for better SEO
async function getProjects() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
        const res = await fetch(`${apiUrl}/api/public/projects`, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        return [];
    }
}

export default async function ProjectsPage() {
    // In a real scenario, we might want a strictly public endpoint (`/api/projects`)
    // that omits drafts/deleted records. We will render everything for now.
    const allProjects = await getProjects();
    const projects = allProjects.filter((p: any) => p.status !== 'draft');

    return (
        <div className="bg-[#030a08] min-h-screen relative pt-32 pb-24 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-900/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-[3.5rem] sm:text-[4.5rem] font-bold text-white tracking-tight leading-[1.1] mb-6">Invest in the Future</h1>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed">Discover and support groundbreaking new projects before they hit the mainland. Track timelines and watch your investments grow into reality.</p>
                </div>

                <CampaignsList projects={projects} />
            </div>
        </div>
    );
}
