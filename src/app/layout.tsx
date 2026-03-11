import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export async function generateMetadata(): Promise<Metadata> {
  const defaultMeta = {
    title: "iFuture SBS - Smart Digital Solutions",
    description: "iFuture SBS provides smart digital solutions for business platforms and services.",
  };

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ifuture.sbs';
    const res = await fetch(`${API_URL}/api/public/seo?lang=en`, { next: { revalidate: 60 } });
    if (!res.ok) return defaultMeta;

    const data = await res.json();
    return {
      title: data.title || defaultMeta.title,
      description: data.description || defaultMeta.description,
      keywords: data.keywords || "tech, software",
      openGraph: {
        title: data.title || defaultMeta.title,
        description: data.description || defaultMeta.description,
        images: data.og_image ? [API_URL + data.og_image] : [],
      },
      icons: {
        icon: data.favicon ? API_URL + data.favicon : '/favicon.ico',
      }
    };
  } catch (err) {
    return defaultMeta;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased font-sans bg-[#030a08] text-white overflow-x-hidden`} suppressHydrationWarning>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
