'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchWithAuth } from '@/utils/api';

export default function InvestButton({ slug }: { slug: string }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
                const res = await fetchWithAuth(`${API_URL}/api/auth/user`);
                if (res.ok) {
                    setIsAuthenticated(true);
                }
            } catch (e) {
                // Not authenticated
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="w-full inline-flex items-center justify-center p-4 bg-primary-600/50 text-white/50 rounded-2xl font-bold animate-pulse">
                Checking Status...
            </div>
        );
    }

    const targetUrl = isAuthenticated ? `/projects/${slug}/fund` : `/portal/login?redirect=/projects/${slug}/fund`;

    return (
        <Link href={targetUrl} className="w-full inline-flex items-center justify-center p-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-500 transition-colors shadow-[0_10px_30px_rgba(4,120,87,0.3)] hover:-translate-y-1">
            Invest in this Campaign
        </Link>
    );
}
