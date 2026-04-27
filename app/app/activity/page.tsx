import { buildMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { AppShell } from "@/components/layout/app-shell";
import { SupporterActivityFeed } from "@/components/app/supporter-activity-feed";
import { Card } from "@/components/ui/card";

export const metadata = buildMetadata({
  title: "Activity | UNYT.shop",
  description:
    "Supporter v1 activity history for allocation, top-ups, redemptions, and account-level supported usage-right events.",
  path: "/app/activity",
});

export default async function ActivityPage() {
  const t = await getTranslations("pages.activity");

  return (
    <AppShell
      title={t("title")}
      description={t("description")}
    >
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white">{t("ledgerTitle")}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {t("ledgerBody")}
        </p>
        <div className="mt-6">
          <SupporterActivityFeed />
        </div>
      </Card>
    </AppShell>
  );
}
