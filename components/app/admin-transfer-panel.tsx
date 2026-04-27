"use client";

import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Card, SubtleCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/supporter-v1";

type TransferStatus =
  | "received"
  | "manual_review"
  | "needs_support"
  | "matched"
  | "ready_for_confirmation"
  | "completed"
  | "rejected";

type TransferRequestRecord = {
  id: string;
  publicReference: string;
  createdAt: string;
  updatedAt: string;
  supporterEmail: string;
  displayName: string;
  walletAddress: string;
  supportNotes: string;
  status: TransferStatus;
  statusNote: string;
  supporterRecordFound: boolean;
  matchedSupporterId: string | null;
  walletSignatureVerified: boolean;
  walletVerifiedAt: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  adminNotes: string;
};

const statusOptions: { value: TransferStatus; label: string }[] = [
  { value: "received", label: "Received" },
  { value: "manual_review", label: "Manual review" },
  { value: "needs_support", label: "Needs support" },
  { value: "matched", label: "Matched" },
  { value: "ready_for_confirmation", label: "Ready for confirmation" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected / closed" },
];

function shortenWallet(address: string) {
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

function statusTone(status: TransferStatus) {
  if (status === "completed" || status === "matched") {
    return "border-emerald-300/25 bg-emerald-400/10 text-emerald-100";
  }
  if (status === "rejected" || status === "needs_support") {
    return "border-rose-300/25 bg-rose-400/10 text-rose-100";
  }
  if (status === "ready_for_confirmation") {
    return "border-amber-300/25 bg-amber-400/10 text-amber-100";
  }
  return "border-cyan-300/25 bg-cyan-400/10 text-cyan-100";
}

export function AdminTransferPanel() {
  const [transfers, setTransfers] = useState<TransferRequestRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<TransferStatus>("manual_review");
  const [statusNote, setStatusNote] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedTransfer = useMemo(
    () => transfers.find((transfer) => transfer.id === selectedId) || null,
    [selectedId, transfers],
  );

  const loadTransfers = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/transfers", { credentials: "include", cache: "no-store" });
      const payload = (await response.json()) as {
        ok?: boolean;
        transfers?: TransferRequestRecord[];
        message?: string;
      };

      if (!response.ok || !payload.ok) {
        setMessage(payload.message || "Unable to load transfer requests.");
        setTransfers([]);
        return;
      }

      const list = payload.transfers || [];
      setTransfers(list);
      setSelectedId((current) => current || list[0]?.id || null);
    } catch {
      setMessage("Unable to load transfer requests.");
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTransfers();
  }, [loadTransfers]);

  useEffect(() => {
    if (!selectedTransfer) {
      return;
    }

    setStatus(selectedTransfer.status);
    setStatusNote(selectedTransfer.statusNote);
    setAdminNotes(selectedTransfer.adminNotes);
  }, [selectedTransfer]);

  async function saveTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTransfer) {
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/transfers/${encodeURIComponent(selectedTransfer.id)}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, statusNote, adminNotes }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        transfer?: TransferRequestRecord;
        message?: string;
      };

      if (!response.ok || !payload.ok || !payload.transfer) {
        setMessage(payload.message || "Unable to update transfer request.");
        return;
      }

      setTransfers((current) =>
        current
          .map((transfer) => (transfer.id === payload.transfer?.id ? payload.transfer : transfer))
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
      );
      setSelectedId(payload.transfer.id);
      setMessage(payload.message || "Transfer request updated.");
    } catch {
      setMessage("Unable to update transfer request.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Transfer review queue</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Assisted review for transfer.unyt.shop submissions. This queue does not execute transfers.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={() => void loadTransfers()} disabled={loading}>
          {loading ? "Refreshing" : "Refresh"}
        </Button>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-2">
          {transfers.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">
              {message || "No transfer requests yet, or sign in above to load the queue."}
            </p>
          ) : (
            transfers.map((transfer) => (
              <button
                key={transfer.id}
                type="button"
                onClick={() => setSelectedId(transfer.id)}
                className={`w-full rounded-2xl border p-3 text-left ${
                  selectedId === transfer.id
                    ? "border-[#4a9eff]/70 bg-white/10"
                    : "border-white/10 bg-white/5 hover:bg-white/8"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{transfer.publicReference}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{transfer.supporterEmail}</p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusTone(transfer.status)}`}>
                    {transfer.status.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {shortenWallet(transfer.walletAddress)} · {transfer.supporterRecordFound ? "supporter found" : "needs identity check"} ·{" "}
                  {transfer.walletSignatureVerified ? "wallet signed" : "wallet unsigned"}
                </p>
              </button>
            ))
          )}
        </div>

        <div>
          {selectedTransfer ? (
            <form onSubmit={saveTransfer} className="space-y-4">
              <SubtleCard className="p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Selected request</p>
                <p className="mt-2 text-lg font-semibold text-white">{selectedTransfer.publicReference}</p>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <p className="text-[var(--muted)]">
                    Email
                    <span className="mt-1 block font-semibold text-white">{selectedTransfer.supporterEmail}</span>
                  </p>
                  <p className="text-[var(--muted)]">
                    Wallet
                    <span className="mt-1 block font-semibold text-white">{shortenWallet(selectedTransfer.walletAddress)}</span>
                  </p>
                  <p className="text-[var(--muted)]">
                    Matched supporter
                    <span className="mt-1 block font-semibold text-white">
                      {selectedTransfer.matchedSupporterId || "Not matched yet"}
                    </span>
                  </p>
                  <p className="text-[var(--muted)]">
                    Wallet proof
                    <span className="mt-1 block font-semibold text-white">
                      {selectedTransfer.walletSignatureVerified ? "Signature verified" : "No signature yet"}
                    </span>
                  </p>
                  <p className="text-[var(--muted)]">
                    Updated
                    <span className="mt-1 block font-semibold text-white">{formatDateTime(selectedTransfer.updatedAt)}</span>
                  </p>
                </div>
                {selectedTransfer.supportNotes ? (
                  <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{selectedTransfer.supportNotes}</p>
                ) : null}
              </SubtleCard>

              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Status</span>
                <div className="select-wrap">
                  <select value={status} onChange={(event) => setStatus(event.target.value as TransferStatus)}>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <svg className="select-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </label>
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Public status note</span>
                <textarea
                  value={statusNote}
                  onChange={(event) => setStatusNote(event.target.value)}
                  rows={3}
                  className="w-full rounded-[10px] border border-white/12 bg-white/6 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Internal admin notes</span>
                <textarea
                  value={adminNotes}
                  onChange={(event) => setAdminNotes(event.target.value)}
                  rows={4}
                  className="w-full rounded-[10px] border border-white/12 bg-white/6 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                />
              </label>
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? "Saving" : "Save transfer status"}
              </Button>
            </form>
          ) : (
            <p className="text-sm text-[var(--muted)]">Select a transfer request.</p>
          )}
        </div>
      </div>

      {message ? <p className="mt-4 text-sm text-[var(--muted)]">{message}</p> : null}
    </Card>
  );
}
