"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, SubtleCard } from "@/components/ui/card";

type InterestSourcePage = "unytbot.com" | "unyt.exchange";
type InterestIn = "unytbot" | "unyt-exchange" | "both";
type InterestFocus =
  | "early_access"
  | "product_updates"
  | "commercial_use"
  | "partnership"
  | "backer_ecosystem";

type InterestFormLabels = {
  sharedHeadline: string;
  sharedBody: string;
  firstName: string;
  lastName: string;
  email: string;
  companyOptional: string;
  countryRegion: string;
  interestIn: string;
  interestInOptions: {
    unytbot: string;
    unytExchange: string;
    both: string;
  };
  interests: string;
  interestOptions: {
    earlyAccess: string;
    productUpdates: string;
    commercialUse: string;
    partnership: string;
    backerEcosystem: string;
  };
  messageOptional: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
  followUpNote: string;
};

export function InterestForm({
  sourcePage,
  defaultInterestIn,
  formTitle,
  formBody,
  labels,
}: {
  sourcePage: InterestSourcePage;
  defaultInterestIn: InterestIn;
  formTitle: string;
  formBody: string;
  labels: InterestFormLabels;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [countryRegion, setCountryRegion] = useState("");
  const [interestIn, setInterestIn] = useState<InterestIn>(defaultInterestIn);
  const [interestFocus, setInterestFocus] = useState<InterestFocus[]>(["product_updates"]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ ok: boolean; message: string } | null>(null);

  function toggleInterestFocus(value: InterestFocus) {
    setInterestFocus((previous) => {
      if (previous.includes(value)) {
        if (previous.length === 1) {
          return previous;
        }
        return previous.filter((item) => item !== value);
      }
      return [...previous, value];
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch("/api/interest/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourcePage,
          firstName,
          lastName,
          email,
          company,
          countryRegion,
          interestIn,
          interestFocus,
          message,
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !payload.ok) {
        setSubmitResult({
          ok: false,
          message: payload.message || labels.error,
        });
        return;
      }

      setSubmitResult({
        ok: true,
        message: payload.message || labels.success,
      });
      setMessage("");
    } catch {
      setSubmitResult({
        ok: false,
        message: labels.error,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-6 sm:p-7">
      <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{formTitle}</h3>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{formBody}</p>

      <SubtleCard className="mt-5 p-4">
        <p className="text-sm font-semibold text-white">{labels.sharedHeadline}</p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{labels.sharedBody}</p>
      </SubtleCard>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{labels.firstName}</span>
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="min-h-11"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{labels.lastName}</span>
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="min-h-11"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{labels.email}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-11"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{labels.companyOptional}</span>
            <input
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              className="min-h-11"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{labels.countryRegion}</span>
            <input
              type="text"
              value={countryRegion}
              onChange={(event) => setCountryRegion(event.target.value)}
              className="min-h-11"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{labels.interestIn}</span>
            <div className="select-wrap">
              <select
                value={interestIn}
                onChange={(event) => setInterestIn(event.target.value as InterestIn)}
                className="min-h-11"
                required
              >
                <option value="unytbot">{labels.interestInOptions.unytbot}</option>
                <option value="unyt-exchange">{labels.interestInOptions.unytExchange}</option>
                <option value="both">{labels.interestInOptions.both}</option>
              </select>
              <svg className="select-chevron" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="m5 7 5 6 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
          </label>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{labels.interests}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {([
              ["early_access", labels.interestOptions.earlyAccess],
              ["product_updates", labels.interestOptions.productUpdates],
              ["commercial_use", labels.interestOptions.commercialUse],
              ["partnership", labels.interestOptions.partnership],
              ["backer_ecosystem", labels.interestOptions.backerEcosystem],
            ] as const).map(([value, label]) => {
              const checked = interestFocus.includes(value);
              return (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-white/10 bg-white/4 px-3 py-3 text-sm text-white"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleInterestFocus(value)}
                    className="h-4 w-4 accent-[var(--accent)]"
                  />
                  <span>{label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{labels.messageOptional}</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="min-h-28 w-full rounded-[10px] border border-white/12 bg-white/6 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" variant="brand" disabled={isSubmitting}>
            {isSubmitting ? labels.submitting : labels.submit}
          </Button>
          <p className="text-xs leading-5 text-[var(--muted)]">{labels.followUpNote}</p>
        </div>

        {submitResult ? (
          <p className={`text-sm ${submitResult.ok ? "text-[var(--success)]" : "text-[#f97066]"}`}>
            {submitResult.message}
          </p>
        ) : null}
      </form>
    </Card>
  );
}
