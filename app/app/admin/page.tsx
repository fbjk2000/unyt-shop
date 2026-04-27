import { buildMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { AppShell } from "@/components/layout/app-shell";
import { AdminWalletsPanel } from "@/components/app/admin-wallets-panel";
import { AdminTransferPanel } from "@/components/app/admin-transfer-panel";

export const metadata = buildMetadata({
  title: "Admin | UNYT.shop",
  description:
    "Superadmin surface for viewing all supporter wallets and editing account profile or non-crypto balance records.",
  path: "/app/admin",
});

export default async function AdminPage() {
  const t = await getTranslations("pages.admin");

  return (
    <AppShell
      title={t("title")}
      description={t("description")}
    >
      <div className="space-y-6">
        <AdminWalletsPanel />
        <AdminTransferPanel />
      </div>
    </AppShell>
  );
}
