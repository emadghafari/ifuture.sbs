"use client";

import React, { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
    // We use a small delay trick to re-trigger the CSS animation on route changes
    const [key, setKey] = useState(0);

    useEffect(() => {
        setKey((prev) => prev + 1);
    }, [children]);

    return (
        <div key={key} className="animate-page-enter flex flex-col min-h-screen w-full">
            {children}
        </div>
    );
}
