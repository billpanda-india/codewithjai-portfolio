import { getSiteSettings, getNavigation, getFooter, getSiteLinks } from "@/lib/supabase/queries";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteLinksStructuredData from "@/components/SiteLinksStructuredData";
import ChatWidget from "@/components/ChatWidget";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, navigation, footer, siteLinks] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
    getFooter(),
    getSiteLinks(),
  ]);

  return (
    <>
      <SiteLinksStructuredData 
        siteUrl={process.env.NEXT_PUBLIC_SITE_URL || "https://codewithjai.com"}
        siteName={settings?.website_name || settings?.title || "CodeWithJai"}
        links={siteLinks}
      />
      <Navbar navigation={navigation} siteName={settings?.title || "CodeWithJai"} logo={settings?.logo} />
      <main className="relative">{children}</main>
      <Footer footer={footer} siteName={settings?.title || "CodeWithJai"} logo={settings?.logo} />
      <ChatWidget />
    </>
  );
}
