"use client";

import { type FormEvent, useState } from "react";

type PublicTransferStatus = {
  publicReference: string;
  createdAt: string;
  updatedAt: string;
  supporterEmail: string;
  walletAddress: string;
  status: string;
  statusNote: string;
  supporterRecordFound: boolean;
  matchedSupporterId: string | null;
  walletSignatureVerified: boolean;
  walletVerifiedAt: string | null;
};

type TransferApiResponse = {
  ok?: boolean;
  message?: string;
  transfer?: PublicTransferStatus;
  challenge?: {
    challengeId: string;
    expiresAt: string;
    message: string;
  };
};

type EthereumProvider = {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
};

function shortenWallet(address: string) {
  if (address.length <= 14) {
    return address;
  }

  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    received: "Empfangen",
    manual_review: "Manuelle Prüfung",
    needs_support: "Support nötig",
    matched: "Vorgemerkt",
    ready_for_confirmation: "Bereit für Bestätigung",
    completed: "Abgeschlossen",
    rejected: "Geschlossen",
  };

  return labels[status] || status;
}

function ResultCard({ transfer }: { transfer: PublicTransferStatus }) {
  return (
    <div className="rounded-xl border border-emerald-300/20 bg-emerald-400/8 p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100">Transferstatus</p>
      <p className="mt-3 text-xl font-semibold tracking-[-0.025em] text-white">{transfer.publicReference}</p>
      <div className="mt-4 grid gap-3 text-sm text-white/72 sm:grid-cols-2">
        <p>
          <span className="block text-[var(--muted)]">Status</span>
          <span className="font-semibold text-white">{statusLabel(transfer.status)}</span>
        </p>
        <p>
          <span className="block text-[var(--muted)]">Wallet</span>
          <span className="font-semibold text-white">{shortenWallet(transfer.walletAddress)}</span>
        </p>
      </div>
      <p className="mt-4 text-sm leading-6 text-white/72">{transfer.statusNote}</p>
      <p className="mt-3 text-xs leading-5 text-white/55">
        Supporter-Datensatz: {transfer.supporterRecordFound ? "gefunden" : "noch zu klären"}
        {transfer.matchedSupporterId ? ` · ${transfer.matchedSupporterId}` : ""}
      </p>
      <p className="mt-1 text-xs leading-5 text-white/55">
        Wallet-Signatur: {transfer.walletSignatureVerified ? "bestätigt" : "noch nicht bestätigt"}
      </p>
    </div>
  );
}

export function TransferIntake() {
  const [displayName, setDisplayName] = useState("");
  const [supporterEmail, setSupporterEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [supportNotes, setSupportNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [walletActionSubmitting, setWalletActionSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [transfer, setTransfer] = useState<PublicTransferStatus | null>(null);

  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupReference, setLookupReference] = useState("");
  const [lookupSubmitting, setLookupSubmitting] = useState(false);
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);
  const [lookupTransfer, setLookupTransfer] = useState<PublicTransferStatus | null>(null);

  async function submitTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setTransfer(null);

    try {
      const response = await fetch("/api/transfer/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          supporterEmail,
          walletAddress,
          supportNotes,
          consent,
        }),
      });
      const payload = (await response.json()) as TransferApiResponse;

      if (!response.ok || !payload.ok || !payload.transfer) {
        setMessage(payload.message || "Die Anfrage konnte nicht gespeichert werden.");
        return;
      }

      setTransfer(payload.transfer);
      setLookupEmail(payload.transfer.supporterEmail);
      setLookupReference(payload.transfer.publicReference);
      setMessage(payload.message || "Transferanfrage wurde erfasst.");
    } catch {
      setMessage("Die Anfrage konnte gerade nicht gespeichert werden.");
    } finally {
      setSubmitting(false);
    }
  }

  async function fillWalletFromMetaMask() {
    setWalletActionSubmitting(true);
    setMessage(null);
    try {
      const provider = (window as unknown as { ethereum?: EthereumProvider }).ethereum;
      if (!provider) {
        setMessage("MetaMask wurde nicht gefunden. Bitte installieren oder öffnen Sie MetaMask im Browser.");
        return;
      }

      const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
      const account = accounts[0];
      if (!account) {
        setMessage("Es wurde keine Wallet-Adresse aus MetaMask zurückgegeben.");
        return;
      }

      setWalletAddress(account);
    } catch {
      setMessage("MetaMask konnte gerade nicht verbunden werden.");
    } finally {
      setWalletActionSubmitting(false);
    }
  }

  async function verifyWalletSignature() {
    setWalletActionSubmitting(true);
    setMessage(null);
    setTransfer(null);

    try {
      const provider = (window as unknown as { ethereum?: EthereumProvider }).ethereum;
      if (!provider) {
        setMessage("MetaMask wurde nicht gefunden. Bitte installieren oder öffnen Sie MetaMask im Browser.");
        return;
      }

      const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
      const account = accounts[0];
      if (!account) {
        setMessage("Es wurde keine Wallet-Adresse aus MetaMask zurückgegeben.");
        return;
      }

      const normalizedWallet = walletAddress || account;
      setWalletAddress(normalizedWallet);

      const challengeResponse = await fetch("/api/transfer/wallet-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supporterEmail,
          walletAddress: normalizedWallet,
        }),
      });
      const challengePayload = (await challengeResponse.json()) as TransferApiResponse;
      if (!challengeResponse.ok || !challengePayload.ok || !challengePayload.challenge) {
        setMessage(challengePayload.message || "Wallet-Challenge konnte nicht erstellt werden.");
        return;
      }

      const signature = (await provider.request({
        method: "personal_sign",
        params: [challengePayload.challenge.message, normalizedWallet],
      })) as string;

      const verifyResponse = await fetch("/api/transfer/wallet-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: challengePayload.challenge.challengeId,
          signature,
        }),
      });
      const verifyPayload = (await verifyResponse.json()) as TransferApiResponse;
      if (!verifyResponse.ok || !verifyPayload.ok || !verifyPayload.transfer) {
        setMessage(verifyPayload.message || "Wallet-Signatur konnte nicht geprüft werden.");
        return;
      }

      setTransfer(verifyPayload.transfer);
      setLookupEmail(verifyPayload.transfer.supporterEmail);
      setLookupReference(verifyPayload.transfer.publicReference);
      setMessage(verifyPayload.message || "Wallet-Adresse wurde bestätigt.");
    } catch {
      setMessage("Wallet-Signatur wurde abgebrochen oder konnte nicht geprüft werden.");
    } finally {
      setWalletActionSubmitting(false);
    }
  }

  async function lookupStatus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLookupSubmitting(true);
    setLookupMessage(null);
    setLookupTransfer(null);

    try {
      const response = await fetch("/api/transfer/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supporterEmail: lookupEmail,
          publicReference: lookupReference,
        }),
      });
      const payload = (await response.json()) as TransferApiResponse;

      if (!response.ok || !payload.ok || !payload.transfer) {
        setLookupMessage(payload.message || "Der Status konnte nicht geladen werden.");
        return;
      }

      setLookupTransfer(payload.transfer);
    } catch {
      setLookupMessage("Der Status konnte gerade nicht geladen werden.");
    } finally {
      setLookupSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-xl border border-white/10 bg-[#101827] p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Assistierte Zuordnung</p>
        <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">
          Wallet-Adresse zur Prüfung einreichen
        </h3>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Diese Anfrage löst noch keine Übertragung aus. Sie gibt dem Support-Team die nötigen Daten, um Supporter-Datensatz
          und öffentliche Wallet-Adresse kontrolliert vorzubereiten.
        </p>

        <form onSubmit={submitTransfer} className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Name optional</span>
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Vor- und Nachname"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Supporter-E-Mail</span>
            <input
              type="email"
              value={supporterEmail}
              onChange={(event) => setSupporterEmail(event.target.value)}
              placeholder="name@example.com"
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Öffentliche Wallet-Adresse</span>
            <input
              type="text"
              value={walletAddress}
              onChange={(event) => setWalletAddress(event.target.value)}
              placeholder="0x..."
              required
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={fillWalletFromMetaMask}
              disabled={walletActionSubmitting}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/18 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-55"
            >
              MetaMask-Adresse übernehmen
            </button>
            <button
              type="button"
              onClick={verifyWalletSignature}
              disabled={walletActionSubmitting}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-cyan-200/20 bg-cyan-300/8 px-4 py-2.5 text-sm font-semibold text-cyan-50 hover:bg-cyan-300/14 disabled:cursor-not-allowed disabled:opacity-55"
            >
              Adresse per Signatur bestätigen
            </button>
          </div>
          <p className="text-xs leading-5 text-[var(--muted)]">
            Die Signatur bestätigt nur, dass Sie die Wallet-Adresse kontrollieren. Sie löst keinen Transfer aus
            und erteilt keine Freigabe zum Ausgeben von Token.
          </p>
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Hinweis optional</span>
            <textarea
              value={supportNotes}
              onChange={(event) => setSupportNotes(event.target.value)}
              rows={4}
              placeholder="Nur organisatorische Hinweise. Keine 12 Wörter, keine privaten Schlüssel, keine Passwörter."
              className="w-full rounded-lg border border-white/12 bg-white/6 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
            />
          </label>
          <label className="flex gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/72">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0"
              required
            />
            <span>
              Ich bestätige, dass diese Angaben zur Transferprüfung verwendet werden dürfen und dass ich keine Recovery
              Phrase, privaten Schlüssel oder Passwörter übermittle.
            </span>
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-[#4a9eff] px-4 py-2.5 text-sm font-semibold text-white shadow-none hover:bg-[#6aafff] disabled:cursor-not-allowed disabled:opacity-55"
          >
            {submitting ? "Wird gespeichert..." : "Zur Prüfung einreichen"}
          </button>
        </form>
        {message ? <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{message}</p> : null}
        {transfer ? <div className="mt-5"><ResultCard transfer={transfer} /></div> : null}
      </div>

      <div className="rounded-xl border border-white/10 bg-[#101827] p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Status abrufen</p>
        <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">Transferreferenz prüfen</h3>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Nach dem Einreichen erhalten Sie eine Referenznummer. Damit können Sie hier den aktuellen Bearbeitungsstand
          abrufen.
        </p>
        <form onSubmit={lookupStatus} className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Supporter-E-Mail</span>
            <input
              type="email"
              value={lookupEmail}
              onChange={(event) => setLookupEmail(event.target.value)}
              placeholder="name@example.com"
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Referenznummer</span>
            <input
              type="text"
              value={lookupReference}
              onChange={(event) => setLookupReference(event.target.value)}
              placeholder="UNYT-TX-..."
              required
            />
          </label>
          <button
            type="submit"
            disabled={lookupSubmitting}
            className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-white/18 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {lookupSubmitting ? "Status wird geladen..." : "Status ansehen"}
          </button>
        </form>
        {lookupMessage ? <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{lookupMessage}</p> : null}
        {lookupTransfer ? <div className="mt-5"><ResultCard transfer={lookupTransfer} /></div> : null}
      </div>
    </div>
  );
}
