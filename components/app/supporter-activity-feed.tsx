"use client";

import { useTranslations } from "next-intl";
import { useSupporterWallet } from "@/components/app/supporter-wallet-provider";
import { formatCreditsValue, formatDateTime, formatUsd } from "@/lib/supporter-v1";
import { SubtleCard } from "@/components/ui/card";

type SupporterActivityFeedProps = {
  limit?: number;
};

const statusTone: Record<string, string> = {
  completed: "text-[var(--success)]",
  pending: "text-[var(--brand-amber)]",
  failed: "text-[#f97066]",
};

export function SupporterActivityFeed({ limit }: SupporterActivityFeedProps) {
  const t = useTranslations("supporterActivity");
  const { state } = useSupporterWallet();
  const entries = typeof limit === "number" ? state.ledger.slice(0, limit) : state.ledger;

  if (entries.length === 0) {
    return <p className="text-sm text-[var(--muted)]">{t("empty")}</p>;
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const amountPrefix = entry.creditsDelta >= 0 ? "+" : "-";
        const statusClass = statusTone[entry.status] ?? "text-[var(--muted)]";
        const typeLabel = t(entry.type === "top_up" ? "top_up" : entry.type);

        return (
          <SubtleCard key={entry.id} className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{entry.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  {typeLabel} • {formatDateTime(entry.occurredAt)}
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">{entry.note}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm font-semibold text-white">
                  {amountPrefix}
                  {formatCreditsValue(Math.abs(entry.creditsDelta))} UNYTs
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">{formatUsd(entry.usdAmount)}</p>
                <p className={`mt-2 text-xs uppercase tracking-[0.16em] ${statusClass}`}>
                  {entry.status}
                </p>
              </div>
            </div>
          </SubtleCard>
        );
      })}
    </div>
  );
}
