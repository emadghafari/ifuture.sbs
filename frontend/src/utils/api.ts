const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs/api';

export const fetchHomeData = async (lang: string) => {
    const response = await fetch(`${API_URL}/public/home?lang=${lang}`, {
        cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch data');
    return response.json();
};

export const postContactMessage = async (data: any) => {
    const response = await fetch(`${API_URL}/public/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to send message');
    }
    return response.json();
};

const getCookie = (name: string) => {
    if (typeof document === 'undefined') return '';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
    return '';
};

export const adminFetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');
    if (options.method && options.method !== 'GET') {
        const token = getCookie('XSRF-TOKEN');
        if (token) headers.set('X-XSRF-TOKEN', token);
    }

    return fetch(url, {
        ...options,
        headers,
        credentials: 'include', // vital for Sanctum
    });
};

export const fetchWithAuth = adminFetch;
