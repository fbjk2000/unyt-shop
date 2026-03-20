import { buildMetadata } from "@/lib/metadata";
import { AppShell } from "@/components/layout/app-shell";
import { Card, SubtleCard } from "@/components/ui/card";

export const metadata = buildMetadata({
  title: "Settings | UNYT.shop",
  description:
    "Manage account preferences, support access, and feature visibility settings for the UNYT wallet surface.",
  path: "/app/settings",
});

export default function SettingsPage() {
  return (
    <AppShell
      title="Settings"
      description="Account preferences, support paths, and access settings will live here."
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white">Account and visibility</h2>
          <div className="mt-6 space-y-3">
            {[
              "Default payment preference",
              "Security review reminders",
              "Support contact channel",
            ].map((item) => (
              <SubtleCard key={item} className="p-4">
                <p className="text-sm text-white">{item}</p>
              </SubtleCard>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white">Feature visibility</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Settings should make it obvious which wallet features are available for the
            current account and region, without forcing users into dead ends.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
