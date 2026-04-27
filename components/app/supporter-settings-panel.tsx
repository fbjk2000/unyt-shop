"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSupporterWallet } from "@/components/app/supporter-wallet-provider";
import { Card, SubtleCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/supporter-v1";

export function SupporterSettingsPanel() {
  const t = useTranslations("settingsPanel");
  const { state, signOutSupporter } = useSupporterWallet();
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    setResultMessage(null);
    try {
      const result = await signOutSupporter();
      setResultMessage(result.message);
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white">{t("accountProfileTitle")}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          {t("accountProfileBody")}
        </p>
        <div className="mt-6 space-y-3">
          <SubtleCard className="p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("accountLabel")}</p>
            <p className="mt-2 text-sm font-semibold text-white">{state.account.displayName}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{state.account.email}</p>
          </SubtleCard>
          <SubtleCard className="p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("sessionStateLabel")}</p>
            <p className="mt-2 text-sm text-white">{state.account.authProvider}</p>
            <p className="mt-2 text-xs text-[var(--muted)]">{t("supporterId", { id: state.account.supporterId })}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{t("walletId", { id: state.account.walletId })}</p>
          </SubtleCard>
          <SubtleCard className="p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("allocationRecordLabel")}</p>
            <p className="mt-2 text-sm text-white">{state.allocation.allocationStatus}</p>
            <p className="mt-2 text-xs text-[var(--muted)]">{state.allocation.allocationSource}</p>
          </SubtleCard>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="mt-6 w-full"
          onClick={handleSignOut}
          disabled={isSigningOut || state.account.authState !== "registered"}
        >
          {isSigningOut ? t("signingOut") : t("signOut")}
        </Button>
        {resultMessage ? <p className="mt-3 text-sm text-[var(--muted)]">{resultMessage}</p> : null}
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white">{t("followUpTitle")}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          {t("followUpBody")}
        </p>
        <div className="mt-6 space-y-3">
          {state.followUpTasks.length === 0 ? (
            <SubtleCard className="p-4">
              <p className="text-sm text-white">{t("noTasks")}</p>
            </SubtleCard>
          ) : (
            state.followUpTasks.map((task) => (
              <SubtleCard key={task.id} className="p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{task.sourceEvent}</p>
                <p className="mt-2 text-sm text-white">{task.title}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">{task.detail}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  {t("taskStatusDue", { status: task.status, due: formatDateTime(task.dueAt) })}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {t("routing", { system: task.externalSystem === "earnrm" ? "EarnRM" : t("internal") })}
                </p>
              </SubtleCard>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
