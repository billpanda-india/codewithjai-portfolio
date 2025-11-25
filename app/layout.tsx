import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { getSiteSettings } from "@/lib/settings";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: 'swap',
  preload: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: settings?.default_seo_title || settings?.title || "CodeWithJai",
    description: settings?.default_seo_description || "Full-stack developer portfolio",
    openGraph: {
      title: settings?.default_seo_title || settings?.title || "CodeWithJai",
      description: settings?.default_seo_description || "Full-stack developer portfolio",
      images: settings?.default_og_image ? [settings.default_og_image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: settings?.default_seo_title || settings?.title || "CodeWithJai",
      description: settings?.default_seo_description || "Full-stack developer portfolio",
      images: settings?.default_og_image ? [settings.default_og_image] : [],
    },
    icons: {
      icon: settings?.favicon || "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://irhsqcvxyovpvquslzki.supabase.co" />
        <link rel="dns-prefetch" href="https://irhsqcvxyovpvquslzki.supabase.co" />
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        {settings?.favicon && (
          <>
            <link rel="icon" href={settings.favicon} type="image/x-icon" />
            <link rel="shortcut icon" href={settings.favicon} type="image/x-icon" />
          </>
        )}
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white relative`}>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
