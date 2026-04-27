import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { MobileBottomActionBar } from "@/components/marketing/mobile-bottom-action-bar";
import { Footer } from "@/components/layout/footer";
import { MarketingHeader } from "@/components/layout/marketing-header";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("appShell");

  return (
    <>
      <a href="#main-content" className="skip-link">
        {t("skipToContent")}
      </a>
      <AnnouncementBar />
      <MarketingHeader />
      <main id="main-content">{children}</main>
      <Footer />
      <MobileBottomActionBar />
    </>
  );
}
