import { buildMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { AppShell } from "@/components/layout/app-shell";
import { SupporterSettingsPanel } from "@/components/app/supporter-settings-panel";

export const metadata = buildMetadata({
  title: "Settings | UNYT.shop",
  description:
    "View supporter account session state, follow-up queue, and wallet account controls.",
  path: "/app/settings",
});

export default async function SettingsPage() {
  const t = await getTranslations("pages.settings");

  return (
    <AppShell
      title={t("title")}
      description={t("description")}
    >
      <SupporterSettingsPanel />
    </AppShell>
  );
}
