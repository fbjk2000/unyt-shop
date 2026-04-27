"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  type WalletActionResult,
  useSupporterWallet,
} from "@/components/app/supporter-wallet-provider";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SupporterActivityFeed } from "@/components/app/supporter-activity-feed";
import { Button } from "@/components/ui/button";
import { Card, SubtleCard } from "@/components/ui/card";
import { formatCredits, formatDateTime, formatUsd } from "@/lib/supporter-v1";

export function SupporterWalletDashboard() {
  const t = useTranslations("walletDashboard");
  const {
    state,
    hasLinkedSupporter,
    isLoading,
    registerOrLinkSupporter,
    loginSupporter,
    topUpCredits,
    redeemProduct,
    signOutSupporter,
  } = useSupporterWallet();

  const [topUpAmount, setTopUpAmount] = useState("250");
  const [topUpMethod, setTopUpMethod] = useState("");
  const [topUpResult, setTopUpResult] = useState<WalletActionResult | null>(null);
  const [isTopUpSubmitting, setIsTopUpSubmitting] = useState(false);

  const [redeemUnits, setRedeemUnits] = useState("1");
  const [redeemResult, setRedeemResult] = useState<WalletActionResult | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const [registrationName, setRegistrationName] = useState("");
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [registrationResult, setRegistrationResult] = useState<WalletActionResult | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginResult, setLoginResult] = useState<WalletActionResult | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [signOutResult, setSignOutResult] = useState<WalletActionResult | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!topUpMethod && state.topUpMethods.length > 0) {
      setTopUpMethod(state.topUpMethods[0].id);
    }
  }, [state.topUpMethods, topUpMethod]);

  const liveRedemption = useMemo(
    () => state.redemptionCatalog.find((item) => item.status === "live"),
    [state.redemptionCatalog],
  );

  const plannedRedemptions = useMemo(
    () => state.redemptionCatalog.filter((item) => item.status === "planned"),
    [state.redemptionCatalog],
  );

  const latestLedgerEntry = state.ledger[0];
  const isRegistered = hasLinkedSupporter && state.account.authState === "registered";
  const walletStatusLabel =
    state.account.authState === "registered"
      ? t("status.supporterLinked")
      : state.account.authState === "integration_pending"
        ? t("status.integrationPending")
        : t("status.registrationRequired");

  useEffect(() => {
    if (!isRegistered) {
      return;
    }

    setRegistrationName(state.account.displayName);
    setRegistrationEmail(state.account.email);
    setLoginEmail(state.account.email);
  }, [isRegistered, state.account.displayName, state.account.email]);

  async function handleTopUpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsTopUpSubmitting(true);
    setTopUpResult(null);

    try {
      const amount = Number(topUpAmount);
      const methodId = topUpMethod || state.topUpMethods[0]?.id || "";
      const result = await topUpCredits({ usdAmount: amount, methodId });
      setTopUpResult(result);
    } finally {
      setIsTopUpSubmitting(false);
    }
  }

  async function handleRedeemSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!liveRedemption) {
      setRedeemResult({ ok: false, message: t("redeem.noLiveProductConfigured") });
      return;
    }

    setIsRedeeming(true);
    setRedeemResult(null);
    try {
      const units = Number(redeemUnits);
      const result = await redeemProduct({ productId: liveRedemption.id, units });
      setRedeemResult(result);
    } finally {
      setIsRedeeming(false);
    }
  }

  async function handleRegistrationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsRegistering(true);
    setRegistrationResult(null);
    setLoginResult(null);
    setSignOutResult(null);

    try {
      const result = await registerOrLinkSupporter({
        displayName: registrationName,
        email: registrationEmail,
      });
      setRegistrationResult(result);
    } finally {
      setIsRegistering(false);
    }
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoggingIn(true);
    setLoginResult(null);
    setRegistrationResult(null);
    setSignOutResult(null);

    try {
      const result = await loginSupporter({ email: loginEmail });
      setLoginResult(result);
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    setSignOutResult(null);
    setLoginResult(null);
    setRegistrationResult(null);

    try {
      const result = await signOutSupporter();
      setSignOutResult(result);
    } finally {
      setIsSigningOut(false);
    }
  }

  if (isLoading) {
    return (
      <Card className="p-6 sm:p-7">
        <h2 className="text-xl font-semibold text-white">{t("loading.title")}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          {t("loading.body")}
        </p>
      </Card>
    );
  }

  return (
    <>
      {!isRegistered ? (
        <Card id="register" className="p-6 sm:p-7">
          <h2 className="text-xl font-semibold text-white">{t("access.title")}</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            {t("access.body")}
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <SubtleCard className="p-4">
              <h3 className="text-sm font-semibold text-white">{t("access.createAccount")}</h3>
              <form onSubmit={handleRegistrationSubmit} className="mt-4 space-y-4">
                <label className="block space-y-2">
                  <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                    {t("access.supporterName")}
                  </span>
                  <input
                    type="text"
                    value={registrationName}
                    onChange={(event) => setRegistrationName(event.target.value)}
                    className="min-h-11"
                    placeholder={t("access.yourName")}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                    {t("access.supporterEmail")}
                  </span>
                  <input
                    type="email"
                    value={registrationEmail}
                    onChange={(event) => setRegistrationEmail(event.target.value)}
                    className="min-h-11"
                    placeholder={t("access.emailPlaceholder")}
                  />
                </label>

                <Button type="submit" variant="accent" className="w-full" disabled={isRegistering}>
                  {isRegistering ? t("access.creatingAccount") : t("access.createOrLink")}
                </Button>
              </form>
            </SubtleCard>

            <SubtleCard className="p-4">
              <h3 className="text-sm font-semibold text-white">{t("access.signIn")}</h3>
              <form onSubmit={handleLoginSubmit} className="mt-4 space-y-4">
                <label className="block space-y-2">
                  <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                    {t("access.supporterEmail")}
                  </span>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    className="min-h-11"
                    placeholder={t("access.emailPlaceholder")}
                  />
                </label>

                <Button type="submit" variant="secondary" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? t("access.signingIn") : t("access.signInExisting")}
                </Button>
              </form>
            </SubtleCard>
          </div>

          {registrationResult ? (
            <p
              className={`mt-4 text-sm ${registrationResult.ok ? "text-[var(--success)]" : "text-[#f97066]"}`}
            >
              {registrationResult.message}
            </p>
          ) : null}

          {loginResult ? (
            <p className={`mt-2 text-sm ${loginResult.ok ? "text-[var(--success)]" : "text-[#f97066]"}`}>
              {loginResult.message}
            </p>
          ) : null}

          {signOutResult ? (
            <p className={`mt-2 text-sm ${signOutResult.ok ? "text-[var(--success)]" : "text-[#f97066]"}`}>
              {signOutResult.message}
            </p>
          ) : null}

          <SubtleCard className="mt-6 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("access.allocationPending")}</p>
            <p className="mt-2 text-sm text-white">{formatCredits(state.allocation.allocationAmount)}</p>
            <p className="mt-2 text-xs text-[var(--muted)]">{t("source", { source: state.allocation.allocationSource })}</p>
          </SubtleCard>
        </Card>
      ) : null}

      <Card className="overflow-hidden p-6 sm:p-8">
        <div className="brand-pattern-overlay absolute inset-0 opacity-[0.08]" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            {t("hero.walletLabel")}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h2 className="text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
              {formatCredits(state.walletBalances.availableCredits)}
            </h2>
            <span className={isRegistered ? "status-pill-live" : "status-pill-preview"}>
              {isRegistered ? t("badges.liveNow") : t("badges.registrationRequired")}
            </span>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            {isRegistered
              ? t("hero.registeredBody")
              : t("hero.unregisteredBody")}
          </p>
        </div>

        <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SubtleCard className="p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("hero.recordedBalance")}</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {formatCredits(state.walletBalances.availableCredits)}
            </p>
          </SubtleCard>
          <SubtleCard className="p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("hero.pending")}</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {formatCredits(state.walletBalances.pendingCredits)}
            </p>
          </SubtleCard>
          <SubtleCard className="p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("hero.walletStatus")}</p>
            <p className="mt-2 text-sm font-semibold text-white">{walletStatusLabel}</p>
            <p className="mt-2 text-xs text-[var(--muted)]">{state.account.email}</p>
          </SubtleCard>
          <SubtleCard className="p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("hero.latestActivity")}</p>
            <p className="mt-2 text-sm font-semibold text-white">
              {latestLedgerEntry ? latestLedgerEntry.title : t("hero.noActivity")}
            </p>
            {latestLedgerEntry ? (
              <p className="mt-2 text-xs text-[var(--muted)]">
                {formatDateTime(latestLedgerEntry.occurredAt)}
              </p>
            ) : null}
          </SubtleCard>
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">{t("scope.title")}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {t("scope.body")}
            </p>
          </div>
          <BrandLogo variant="mark" className="h-6 w-6 opacity-85" alt="" />
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          <SubtleCard className="p-4">
            <span className="status-pill-live">{t("badges.liveNow")}</span>
            <div className="mt-3 space-y-2">
              {state.liveNow.map((item) => (
                <p key={item} className="text-sm text-white">
                  {item}
                </p>
              ))}
            </div>
          </SubtleCard>
          <SubtleCard className="p-4">
            <span className="status-pill-preview">{t("badges.comingNext")}</span>
            <div className="mt-3 space-y-2">
              {state.previewOnly.map((item) => (
                <p key={item} className="text-sm text-white">
                  {item}
                </p>
              ))}
            </div>
          </SubtleCard>
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">{t("transferStatus.title")}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              {t("transferStatus.body")}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <Button href="/transfer#vorbereiten" variant="secondary">
              {t("transferStatus.prepareCta")}
            </Button>
            <Button href="/transfer#vorbereiten" variant="accent">
              {t("transferStatus.statusCta")}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card id="top-up" className="p-6">
          <h2 className="text-xl font-semibold text-white">{t("topUp.title")}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {t("topUp.body")}
          </p>

          {isRegistered ? (
            <form onSubmit={handleTopUpSubmit} className="mt-6 space-y-4">
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("topUp.amountUsd")}</span>
                <input
                  type="number"
                  min={state.walletLimits.minTopUpUsd}
                  max={state.walletLimits.maxTopUpUsd}
                  step="1"
                  value={topUpAmount}
                  onChange={(event) => setTopUpAmount(event.target.value)}
                  className="min-h-11"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("topUp.method")}</span>
                <div className="select-wrap">
                  <select
                    value={topUpMethod}
                    onChange={(event) => setTopUpMethod(event.target.value)}
                    className="min-h-11"
                  >
                    {state.topUpMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.label} {method.status === "planned" ? t("plannedSuffix") : ""}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="select-chevron"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </label>

              <Button type="submit" variant="accent" className="w-full" disabled={isTopUpSubmitting}>
                {isTopUpSubmitting ? t("topUp.processing") : t("topUp.addCredits")}
              </Button>

              <p className="text-xs leading-5 text-[var(--muted)]">
                {t("topUp.limits", {
                  min: formatUsd(state.walletLimits.minTopUpUsd),
                  max: formatUsd(state.walletLimits.maxTopUpUsd),
                })}
              </p>
            </form>
          ) : (
            <SubtleCard className="mt-6 p-4">
              <p className="text-sm text-white">{t("topUp.registrationRequired")}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                {t("topUp.registrationBody")}
              </p>
              <Button href="#register" variant="secondary" className="mt-4 w-full">
                {t("access.title")}
              </Button>
            </SubtleCard>
          )}

          {topUpResult ? (
            <p className={`mt-4 text-sm ${topUpResult.ok ? "text-[var(--success)]" : "text-[#f97066]"}`}>
              {topUpResult.message}
            </p>
          ) : null}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white">{t("accountStatus.title")}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {t("accountStatus.body")}
          </p>

          <div className="mt-6 space-y-3">
            <SubtleCard className="p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("accountStatus.session")}</p>
              <p className="mt-2 text-sm font-semibold text-white">{walletStatusLabel}</p>
            </SubtleCard>
            <SubtleCard className="p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("accountStatus.allocationStatus")}</p>
              <p className="mt-2 text-sm text-white">{state.allocation.allocationStatus}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">{state.allocation.allocationSource}</p>
            </SubtleCard>
            <SubtleCard className="p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("accountStatus.account")}</p>
              <p className="mt-2 text-sm text-white">{state.account.displayName}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">{state.account.email}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">{t("supporterId", { id: state.account.supporterId })}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{t("walletId", { id: state.account.walletId })}</p>
            </SubtleCard>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="mt-6 w-full"
            disabled={!isRegistered || isSigningOut}
            onClick={handleSignOut}
          >
            {isSigningOut ? t("access.signingOut") : t("access.signOutSession")}
          </Button>

          {signOutResult ? (
            <p className={`mt-4 text-sm ${signOutResult.ok ? "text-[var(--success)]" : "text-[#f97066]"}`}>
              {signOutResult.message}
            </p>
          ) : null}
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card id="redeem" className="p-6">
          <h2 className="text-xl font-semibold text-white">{t("redeem.title")}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {t("redeem.body")}
          </p>

          {isRegistered ? (
            <>
              {liveRedemption ? (
                <form onSubmit={handleRedeemSubmit} className="mt-6 space-y-4">
                  <SubtleCard className="p-4">
                    <p className="text-sm font-semibold text-white">{liveRedemption.name}</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">{liveRedemption.detail}</p>
                    <p className="mt-2 text-sm text-white">
                      {t("redeem.unitPrice", {
                        credits: formatCredits(liveRedemption.unitCredits),
                        unit: liveRedemption.unitName,
                      })}
                    </p>
                  </SubtleCard>

                  <label className="block space-y-2">
                    <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                      {t("redeem.unitsToRedeem")}
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={redeemUnits}
                      onChange={(event) => setRedeemUnits(event.target.value)}
                      className="min-h-11"
                    />
                  </label>

                  <Button type="submit" className="w-full" disabled={isRedeeming}>
                    {isRedeeming ? t("redeem.redeeming") : t("redeem.cta")}
                  </Button>
                </form>
              ) : (
                <p className="mt-6 text-sm text-[#f97066]">{t("redeem.noLiveProductConfigured")}</p>
              )}
            </>
          ) : (
            <SubtleCard className="mt-6 p-4">
              <p className="text-sm text-white">{t("redeem.registrationRequired")}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                {t("redeem.registrationBody")}
              </p>
              <Button href="#register" variant="secondary" className="mt-4 w-full">
                {t("access.title")}
              </Button>
            </SubtleCard>
          )}

          {redeemResult ? (
            <p className={`mt-4 text-sm ${redeemResult.ok ? "text-[var(--success)]" : "text-[#f97066]"}`}>
              {redeemResult.message}
            </p>
          ) : null}

          {plannedRedemptions.length > 0 ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("redeem.plannedNextRoutes")}</p>
              {plannedRedemptions.map((item) => (
                <SubtleCard key={item.id} className="p-4">
                  <p className="text-sm text-white">{item.name}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{item.detail}</p>
                </SubtleCard>
              ))}
            </div>
          ) : null}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white">{t("followUpTasks.title")}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{t("followUpTasks.body")}</p>
          <div className="mt-6 space-y-3">
            {state.followUpTasks.length === 0 ? (
              <SubtleCard className="p-4">
                <p className="text-sm text-white">{t("followUpTasks.empty")}</p>
              </SubtleCard>
            ) : (
              state.followUpTasks.slice(0, 5).map((task) => (
                <SubtleCard key={task.id} className="p-4">
                  <p className="text-sm font-semibold text-white">{task.title}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">{task.detail}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                    {t("followUpTasks.statusDue", { status: task.status, due: formatDateTime(task.dueAt) })}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                    {t("followUpTasks.routedVia", {
                      system: task.externalSystem === "earnrm" ? "EarnRM" : t("followUpTasks.internalQueue"),
                    })}
                </p>
              </SubtleCard>
            ))
            )}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white">{t("recentActivity.title")}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {t("recentActivity.body")}
        </p>
        <div className="mt-6">
          <SupporterActivityFeed limit={6} />
        </div>
      </Card>
    </>
  );
}
