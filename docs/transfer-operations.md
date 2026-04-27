# UNYT transfer operations

This document is intentionally operational. It does not claim automated transfer execution is live.

## Current production state

- `transfer.unyt.shop` is live and routes to `/de/transfer`.
- Supporters can submit a public wallet address.
- Supporters can verify wallet control with a MetaMask `personal_sign` challenge.
- Admins can review requests, update public status notes, and record execution metadata.
- Real supporter/backer records can be imported when available.
- Actual token transfer execution is still manual / external until chain, contract, signer, and approval policy are finalized.

## Data import format

Admin import accepts JSON:

```json
{
  "records": [
    {
      "supporterEmail": "name@example.com",
      "displayName": "Example Supporter",
      "sourceSystem": "newsletter_export",
      "sourceReference": "backer-123",
      "allocationAmount": 1000,
      "allocationUnit": "UNYT",
      "transferEligibility": "eligible",
      "currentWalletAddress": null,
      "notes": "Optional internal note"
    }
  ]
}
```

Required:

- `supporterEmail`

Recommended:

- `sourceReference`
- `allocationAmount`
- `allocationUnit`
- `transferEligibility`

Allowed `transferEligibility` values:

- `eligible`
- `hold`
- `blocked`

## CSV normalization

When the supporter export arrives as CSV, normalize it locally first:

```bash
node scripts/transfer/normalize-supporter-export.mjs ./supporter-export.csv
```

Default output:

```text
data/transfer-supporters.normalized.json
```

The script recognizes common column names such as `email`, `Email`, `name`, `amount`, `allocation`, `source`, `reference`, `status`, and `wallet`.

## Admin import

1. Sign in at `/app/admin` as an editor.
2. Open the transfer review queue.
3. Paste the normalized JSON into `Supporter data import`.
4. Submit import.

Existing transfer requests are matched by normalized supporter email. Requests that were `needs_support` move to `manual_review` after source data is imported.

## Completion policy

The admin API will not allow a request to be marked `completed` unless a transaction hash is present.

That still does not execute a transfer. It only records the result of a transfer that was executed through the approved operational path.

## Before real execution goes live

Complete these items:

- Confirm chain and token contract address.
- Confirm source wallet / signer model.
- Define who can approve execution.
- Define whether approval is single-person or multi-person.
- Add transaction submission code only after signer policy is final.
- Run a small production-equivalent test transfer.
- Add email notifications for received, matched, ready, completed, and failed states.

## Supabase/Postgres migration

The SQL migration in `supabase/migrations/20260427000000_transfer_workflow.sql` is ready as a database target. Use it when relational querying, operator workflows, and transaction history need to leave the current Netlify Blobs store.
