import { buildMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, SubtleCard } from "@/components/ui/card";

export const metadata = buildMetadata({
  title: "Swap Preview | UNYT.shop",
  description:
    "Swap is a roadmap preview in supporter v1. Live functionality currently focuses on prepaid credits, visible balance, activity history, and EarnRM redemption.",
  path: "/app/swap",
});

export default async function SwapPage() {
  const t = await getTranslations("pages.swap");

  return (
    <AppShell
      title={t("title")}
      description={t("description")}
    >
      <Card className="p-6 sm:p-7">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">{t("heroTitle")}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
          {t("heroBody")}
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <SubtleCard className="p-4">
            <span className="status-pill-live">{t("liveNowBadge")}</span>
            <p className="mt-2 text-sm text-white">
              {t("liveNowBody")}
            </p>
          </SubtleCard>
          <SubtleCard className="p-4">
            <span className="status-pill-preview">{t("previewBadge")}</span>
            <p className="mt-2 text-sm text-white">
              {t("previewBody")}
            </p>
          </SubtleCard>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href="/app/wallet#top-up">{t("topUpCta")}</Button>
          <Button href="/app/wallet#redeem" variant="secondary">
            {t("redeemCta")}
          </Button>
        </div>
      </Card>
    </AppShell>
  );
}
