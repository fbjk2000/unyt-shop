import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Card, SubtleCard } from "@/components/ui/card";

export async function HeroMockup() {
  const t = await getTranslations("heroMockup");

  const quickActions = [
    { label: t("quickActions.topUpCredits"), Icon: ArrowUpIcon },
    { label: t("quickActions.redeemEarnRM"), Icon: TagIcon },
    { label: t("quickActions.viewActivity"), Icon: ListIcon },
    { label: t("quickActions.getSupport"), Icon: ChatIcon },
  ] as const;

  return (
    <Card className="relative overflow-hidden p-4 sm:p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(79,124,255,0.2),_transparent_34%)]" />
      <div className="relative grid gap-4">
        <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/10 bg-[#0c1428] p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-[var(--muted)]">{t("creditBalanceLabel")}</p>
              <BrandLogo variant="mark" className="h-6 w-6 opacity-85" alt="" />
            </div>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white tabular-nums">
              1,240.00
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {t("focus")}
            </p>
            <div className="mt-6 grid grid-cols-[0.9fr_1.1fr] gap-3">
              <SubtleCard className="p-3">
                <p className="text-[11px] font-medium tracking-[0.1em] text-[var(--muted)]">{t("pending")}</p>
                <p className="mt-2 text-base font-semibold text-white tabular-nums">0.00</p>
              </SubtleCard>
              <SubtleCard className="p-3">
                <p className="text-[11px] font-medium tracking-[0.1em] text-[var(--muted)]">{t("available")}</p>
                <p className="mt-2 text-sm font-semibold text-white tabular-nums sm:text-base">1,240.00</p>
              </SubtleCard>
            </div>
          </div>
          <SubtleCard className="p-4">
            <p className="text-sm text-[var(--muted)]">{t("quickActionsTitle")}</p>
            <div className="mt-4 space-y-2">
              {quickActions.map(({ label, Icon }) => (
                <div
                  key={label}
                  className="flex min-h-11 items-center gap-3 rounded-[18px] border border-white/8 bg-white/5 px-4 text-sm text-white"
                >
                  <Icon />
                  {label}
                </div>
              ))}
            </div>
          </SubtleCard>
        </div>
        <div className="grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
          <SubtleCard className="p-4">
            <p className="text-sm text-[var(--muted)]">{t("latestActivityTitle")}</p>
            <div className="mt-4 space-y-3">
              {[
                [t("activity.0.label"), "+500 UNYTs", t("activityStatus.completed")],
                [t("activity.1.label"), "-240 UNYTs", t("activityStatus.completed")],
                [t("activity.2.label"), "+980 UNYTs", t("activityStatus.completed")],
              ].map(([label, amount, status]) => (
                <div key={label} className="rounded-[18px] border border-white/8 bg-black/12 p-3">
                  <p className="text-sm leading-6 text-white break-words">{label}</p>
                  <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <p className="min-w-0 truncate text-xs text-[var(--muted)]">{status}</p>
                    <p className="text-right text-sm font-medium text-white tabular-nums whitespace-nowrap">
                      {amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SubtleCard>
          <SubtleCard className="p-4">
            <p className="text-sm text-[var(--muted)]">{t("redeemableProductsTitle")}</p>
            <div className="mt-4 grid gap-3">
              {[t("products.0"), t("products.1"), t("products.2"), t("products.3"), t("products.4"), t("products.5")].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[18px] border border-white/8 bg-white/5 px-4 py-4 text-sm leading-5 text-white"
                  >
                    <BrandLogo variant="mark" className="mt-0.5 h-4 w-4 shrink-0 opacity-75" alt="" />
                    <span className="min-w-0 break-words">{item}</span>
                  </div>
                ),
              )}
            </div>
          </SubtleCard>
        </div>
      </div>
    </Card>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-[rgba(140,215,255,0.9)]"
    >
      <path
        d="M12 19V5M12 5L6 11M12 5L18 11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-[rgba(140,215,255,0.9)]"
    >
      <path
        d="M20 11L11 20L3 12V4H11L20 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-[rgba(140,215,255,0.9)]"
    >
      <path
        d="M8 7H20M8 12H20M8 17H20M4 7H4.01M4 12H4.01M4 17H4.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-[rgba(140,215,255,0.9)]"
    >
      <path
        d="M4 6.5C4 5.12 5.12 4 6.5 4H17.5C18.88 4 20 5.12 20 6.5V14.5C20 15.88 18.88 17 17.5 17H10L6 20V17H6.5C5.12 17 4 15.88 4 14.5V6.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
