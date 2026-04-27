import { buildMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { AppShell } from "@/components/layout/app-shell";
import { SupporterWalletDashboard } from "@/components/app/supporter-wallet-dashboard";

export const metadata = buildMetadata({
  title: "Wallet | UNYT.shop",
  description:
    "Supporter-facing UNYT wallet with backend registration, account login, funding, recorded allocation, and activity history.",
  path: "/app/wallet",
});

export default async function WalletPage() {
  const t = await getTranslations("pages.wallet");

  return (
    <AppShell
      title={t("title")}
      description={t("description")}
    >
      <SupporterWalletDashboard />
    </AppShell>
  );
}
