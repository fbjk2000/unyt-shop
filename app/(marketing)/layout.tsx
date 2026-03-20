import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { MobileBottomActionBar } from "@/components/marketing/mobile-bottom-action-bar";
import { Footer } from "@/components/layout/footer";
import { MarketingHeader } from "@/components/layout/marketing-header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <AnnouncementBar />
      <MarketingHeader />
      <main id="main-content">{children}</main>
      <Footer />
      <MobileBottomActionBar />
    </>
  );
}
