"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, SubtleCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCredits, formatDateTime } from "@/lib/supporter-v1";

type WalletAdminRecord = {
  email: string;
  displayName: string;
  supporterId: string;
  walletId: string;
  authState: string;
  availableCredits: number;
  pendingCredits: number;
  allocationAmount: number;
  allocationStatus: string;
  ledgerCount: number;
  followUpTaskCount: number;
  updatedAt: string | null;
};

type AdminRole = "viewer" | "editor";

type AdminAuditLogEntry = {
  id: string;
  occurredAt: string;
  adminEmail: string;
  adminRole: AdminRole;
  action: "login" | "logout" | "wallet_update" | "transfer_intake" | "transfer_update" | "transfer_import";
  targetEmail: string | null;
  reason: string;
  details: string;
};

type AdminWalletState = {
  account: {
    displayName: string;
    email: string;
    supporterId: string;
    walletId: string;
    authState: string;
    authProvider: string;
  };
  walletBalances: {
    availableCredits: number;
    pendingCredits: number;
  };
  allocation: {
    allocationAmount: number;
    allocationStatus: "pending_identity" | "recorded";
    allocationSource: string;
  };
};

export function AdminWalletsPanel() {
  const t = useTranslations("adminPanel");
  const [authLoading, setAuthLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [maxBalanceDeltaPerEdit, setMaxBalanceDeltaPerEdit] = useState<number | null>(null);

  const [loginEmail, setLoginEmail] = useState("admin@unyt.shop");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  const [wallets, setWallets] = useState<WalletAdminRecord[]>([]);
  const [walletsLoading, setWalletsLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<AdminWalletState | null>(null);
  const [walletMessage, setWalletMessage] = useState<string | null>(null);
  const [saveSubmitting, setSaveSubmitting] = useState(false);
  const [formReason, setFormReason] = useState("");
  const [auditLogs, setAuditLogs] = useState<AdminAuditLogEntry[]>([]);

  const [formDisplayName, setFormDisplayName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formAvailableCredits, setFormAvailableCredits] = useState("0");
  const [formPendingCredits, setFormPendingCredits] = useState("0");
  const [formAllocationAmount, setFormAllocationAmount] = useState("0");
  const [formAllocationStatus, setFormAllocationStatus] = useState<"pending_identity" | "recorded">("pending_identity");

  const selectedSummary = useMemo(
    () => wallets.find((wallet) => wallet.email === selectedEmail) || null,
    [selectedEmail, wallets],
  );
  const canEdit = adminRole === "editor";
  const roleLabel = adminRole ? t(`roles.${adminRole}`) : t("roles.unknown");

  function formatAuthStateLabel(authState: string) {
    if (authState === "registered") {
      return t("wallets.authState.registered");
    }
    if (authState === "anonymous") {
      return t("wallets.authState.anonymous");
    }
    return authState;
  }

  function formatAuditAction(action: AdminAuditLogEntry["action"]) {
    if (action === "login") {
      return t("audit.actions.login");
    }
    if (action === "logout") {
      return t("audit.actions.logout");
    }
    if (action === "transfer_intake") {
      return "Transfer intake";
    }
    if (action === "transfer_update") {
      return "Transfer update";
    }
    if (action === "transfer_import") {
      return "Transfer import";
    }
    return t("audit.actions.walletUpdate");
  }

  const checkSession = useCallback(async () => {
    setAuthLoading(true);
    try {
      const response = await fetch("/api/admin/session/me", { credentials: "include", cache: "no-store" });
      const payload = (await response.json()) as {
        authenticated?: boolean;
        email?: string;
        role?: AdminRole | null;
        maxBalanceDeltaPerEdit?: number | null;
      };
      setAuthenticated(Boolean(payload.authenticated));
      setAdminEmail(payload.email || "");
      setAdminRole(payload.role || null);
      setMaxBalanceDeltaPerEdit(
        typeof payload.maxBalanceDeltaPerEdit === "number" ? payload.maxBalanceDeltaPerEdit : null,
      );
    } catch {
      setAuthenticated(false);
      setAdminEmail("");
      setAdminRole(null);
      setMaxBalanceDeltaPerEdit(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const loadAuditLogs = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/audit", { credentials: "include", cache: "no-store" });
      const payload = (await response.json()) as { ok?: boolean; logs?: AdminAuditLogEntry[] };
      if (!response.ok || !payload.ok) {
        setAuditLogs([]);
        return;
      }

      setAuditLogs(payload.logs || []);
    } catch {
      setAuditLogs([]);
    }
  }, []);

  const loadWallets = useCallback(async () => {
    setWalletsLoading(true);
    try {
      const response = await fetch("/api/admin/wallets", { credentials: "include", cache: "no-store" });
      const payload = (await response.json()) as {
        ok?: boolean;
        wallets?: WalletAdminRecord[];
        message?: string;
      };

      if (!response.ok || !payload.ok) {
        setWalletMessage(payload.message || t("messages.unableToLoadWalletList"));
        setWallets([]);
        return;
      }

      const list = payload.wallets || [];
      setWallets(list);
      setSelectedEmail((current) => current || (list[0]?.email ?? null));
    } catch {
      setWalletMessage(t("messages.unableToLoadWalletList"));
      setWallets([]);
    } finally {
      setWalletsLoading(false);
    }
  }, [t]);

  const loadWallet = useCallback(async (email: string) => {
    try {
      const response = await fetch(`/api/admin/wallets/${encodeURIComponent(email)}`, {
        credentials: "include",
        cache: "no-store",
      });
      const payload = (await response.json()) as { ok?: boolean; state?: AdminWalletState; message?: string };
      if (!response.ok || !payload.ok || !payload.state) {
        setWalletMessage(payload.message || t("messages.unableToLoadSelectedWallet"));
        setSelectedWallet(null);
        return;
      }

      const state = payload.state;
      setSelectedWallet(state);
      setFormDisplayName(state.account.displayName);
      setFormEmail(state.account.email);
      setFormAvailableCredits(state.walletBalances.availableCredits.toString());
      setFormPendingCredits(state.walletBalances.pendingCredits.toString());
      setFormAllocationAmount(state.allocation.allocationAmount.toString());
      setFormAllocationStatus(state.allocation.allocationStatus);
      setWalletMessage(null);
    } catch {
      setWalletMessage(t("messages.unableToLoadSelectedWallet"));
      setSelectedWallet(null);
    }
  }, [t]);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!authenticated) {
      return;
    }

    void loadWallets();
    void loadAuditLogs();
  }, [authenticated, loadAuditLogs, loadWallets]);

  useEffect(() => {
    if (!authenticated || !selectedEmail) {
      return;
    }

    void loadWallet(selectedEmail);
  }, [authenticated, loadWallet, selectedEmail]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginSubmitting(true);
    setLoginMessage(null);

    try {
      const response = await fetch("/api/admin/session/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
        email?: string;
        role?: AdminRole;
      };

      if (!response.ok || !payload.ok) {
        setLoginMessage(payload.message || t("messages.loginFailed"));
        return;
      }

      setAuthenticated(true);
      setAdminEmail(payload.email || loginEmail);
      setAdminRole(payload.role || null);
      setLoginPassword("");
      setLoginMessage(payload.message || t("messages.signedIn"));
      await checkSession();
      await loadWallets();
      await loadAuditLogs();
    } catch {
      setLoginMessage(t("messages.unableToSignInNow"));
    } finally {
      setLoginSubmitting(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/session/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setAuthenticated(false);
      setAdminEmail("");
      setAdminRole(null);
      setMaxBalanceDeltaPerEdit(null);
      setWallets([]);
      setSelectedEmail(null);
      setSelectedWallet(null);
      setWalletMessage(null);
      setAuditLogs([]);
      setFormReason("");
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedEmail) {
      return;
    }
    if (adminRole !== "editor") {
      setWalletMessage(t("messages.viewerCannotEditWallets"));
      return;
    }
    if (!formReason.trim()) {
      setWalletMessage(t("messages.reasonRequiredForWalletEdits"));
      return;
    }

    setSaveSubmitting(true);
    setWalletMessage(null);

    try {
      const response = await fetch(`/api/admin/wallets/${encodeURIComponent(selectedEmail)}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: formDisplayName,
          email: formEmail,
          availableCredits: Number(formAvailableCredits),
          pendingCredits: Number(formPendingCredits),
          allocationAmount: Number(formAllocationAmount),
          allocationStatus: formAllocationStatus,
          reason: formReason,
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
        state?: AdminWalletState;
      };

      if (!response.ok || !payload.ok || !payload.state) {
        setWalletMessage(payload.message || t("messages.updateFailed"));
        return;
      }

      setSelectedWallet(payload.state);
      setFormEmail(payload.state.account.email);
      setSelectedEmail(payload.state.account.email);
      setWalletMessage(payload.message || t("messages.walletUpdated"));
      setFormReason("");
      await loadWallets();
      await loadWallet(payload.state.account.email);
      await loadAuditLogs();
    } catch {
      setWalletMessage(t("messages.unableToSaveWalletUpdates"));
    } finally {
      setSaveSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white">{t("auth.checkingSession")}</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">{t("auth.loadingAccess")}</p>
      </Card>
    );
  }

  if (!authenticated) {
    return (
      <Card className="max-w-xl p-6">
        <h2 className="text-xl font-semibold text-white">{t("auth.loginTitle")}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          {t("auth.loginBody")}
        </p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("auth.adminEmail")}</span>
            <input
              type="email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              className="min-h-11"
              placeholder={t("auth.adminEmailPlaceholder")}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("auth.password")}</span>
            <input
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              className="min-h-11"
              placeholder={t("auth.passwordPlaceholder")}
            />
          </label>
          <Button type="submit" className="w-full" disabled={loginSubmitting}>
            {loginSubmitting ? t("auth.signingIn") : t("auth.signInCta")}
          </Button>
        </form>
        {loginMessage ? <p className="mt-4 text-sm text-[var(--muted)]">{loginMessage}</p> : null}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">{t("console.title")}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {t("console.signedInAs", { email: adminEmail, role: roleLabel })}
              {canEdit ? ` ${t("console.editorAccess")}` : ` ${t("console.viewerAccess")}`}
            </p>
            {maxBalanceDeltaPerEdit !== null ? (
              <p className="mt-2 text-xs text-[var(--muted)]">
                {t("console.maxDelta", { amount: maxBalanceDeltaPerEdit.toFixed(2) })}
              </p>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Button href="/api/admin/audit.csv" variant="secondary">
              {t("console.exportCsv")}
            </Button>
            <Button type="button" variant="secondary" onClick={handleLogout}>
              {t("console.signOut")}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.15fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{t("wallets.title")}</h3>
            <Button type="button" variant="ghost" onClick={() => void loadWallets()} disabled={walletsLoading}>
              {walletsLoading ? t("wallets.refreshing") : t("wallets.refresh")}
            </Button>
          </div>

          <div className="mt-4 space-y-2">
            {wallets.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">{t("wallets.empty")}</p>
            ) : (
              wallets.map((wallet) => (
                <button
                  key={wallet.email}
                  type="button"
                  onClick={() => setSelectedEmail(wallet.email)}
                  className={`w-full rounded-2xl border p-3 text-left ${
                    selectedEmail === wallet.email
                      ? "border-[#4a9eff]/70 bg-white/10"
                      : "border-white/10 bg-white/5 hover:bg-white/8"
                  }`}
                >
                  <p className="text-sm font-semibold text-white">{wallet.displayName}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{wallet.email}</p>
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    {t("wallets.availableWithState", {
                      available: formatCredits(wallet.availableCredits),
                      state: formatAuthStateLabel(wallet.authState),
                    })}
                  </p>
                </button>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white">{t("edit.title")}</h3>
          {selectedWallet ? (
            <form onSubmit={handleSave} className="mt-4 space-y-3">
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("edit.displayName")}</span>
                <input
                  type="text"
                  value={formDisplayName}
                  onChange={(event) => setFormDisplayName(event.target.value)}
                  disabled={!canEdit}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("edit.email")}</span>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(event) => setFormEmail(event.target.value)}
                  disabled={!canEdit}
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("edit.availableCredits")}</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formAvailableCredits}
                    onChange={(event) => setFormAvailableCredits(event.target.value)}
                    disabled={!canEdit}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("edit.pendingCredits")}</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formPendingCredits}
                    onChange={(event) => setFormPendingCredits(event.target.value)}
                    disabled={!canEdit}
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("edit.allocationAmount")}</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formAllocationAmount}
                    onChange={(event) => setFormAllocationAmount(event.target.value)}
                    disabled={!canEdit}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("edit.allocationStatus")}</span>
                  <div className="select-wrap">
                    <select
                      value={formAllocationStatus}
                      onChange={(event) =>
                        setFormAllocationStatus(event.target.value as "pending_identity" | "recorded")
                      }
                      disabled={!canEdit}
                    >
                      <option value="pending_identity">{t("edit.pendingIdentity")}</option>
                      <option value="recorded">{t("edit.recorded")}</option>
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
              </div>

              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("edit.reason")}</span>
                <textarea
                  value={formReason}
                  onChange={(event) => setFormReason(event.target.value)}
                  rows={3}
                  placeholder={t("edit.reasonPlaceholder")}
                  disabled={!canEdit}
                  className="w-full rounded-[10px] border border-white/12 bg-white/6 px-4 py-3 text-sm text-white outline-none focus:border-white/30 disabled:opacity-60"
                />
              </label>

              <Button type="submit" className="mt-3 w-full" disabled={saveSubmitting || !canEdit}>
                {saveSubmitting ? t("edit.saving") : t("edit.save")}
              </Button>
              {!canEdit ? (
                <p className="text-xs text-[var(--muted)]">{t("edit.viewerCannotEdit")}</p>
              ) : null}
            </form>
          ) : (
            <p className="mt-4 text-sm text-[var(--muted)]">{t("edit.selectWallet")}</p>
          )}

          {selectedSummary ? (
            <SubtleCard className="mt-4 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("edit.selectedWallet")}</p>
              <p className="mt-2 text-sm text-white">{selectedSummary.supporterId}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{t("edit.walletId", { id: selectedSummary.walletId })}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                {t("edit.ledgerAndTasks", {
                  ledger: selectedSummary.ledgerCount,
                  tasks: selectedSummary.followUpTaskCount,
                })}
              </p>
              {selectedSummary.updatedAt ? (
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {t("edit.lastActivity", { datetime: formatDateTime(selectedSummary.updatedAt) })}
                </p>
              ) : null}
            </SubtleCard>
          ) : null}

          {walletMessage ? <p className="mt-4 text-sm text-[var(--muted)]">{walletMessage}</p> : null}
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white">{t("audit.title")}</h3>
        <div className="mt-4 space-y-2">
          {auditLogs.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">{t("audit.empty")}</p>
          ) : (
            auditLogs.slice(0, 12).map((entry) => (
              <SubtleCard key={entry.id} className="p-3">
                <p className="text-sm text-white">
                  {t("audit.entryLine", {
                    action: formatAuditAction(entry.action),
                    adminEmail: entry.adminEmail,
                    role: t(`roles.${entry.adminRole}`),
                  })}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {entry.targetEmail
                    ? t("audit.targetWithReason", { target: entry.targetEmail, reason: entry.reason })
                    : entry.reason}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">{formatDateTime(entry.occurredAt)}</p>
              </SubtleCard>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
