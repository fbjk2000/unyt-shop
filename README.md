# UNYT.shop

UNYT.shop is the marketing site, supporter wallet shell, admin console, and transfer-support frontend for the UNYT ecosystem. It is built with Next.js App Router, TypeScript, Tailwind CSS, `next-intl`, Framer Motion, and Netlify's Next.js runtime.

Production domains:

- `https://unyt.shop` - main public site and app shell.
- `https://transfer.unyt.shop` - dedicated guided transfer/support subdomain for existing UNYT supporters and backers.

## Setup

Install dependencies:

```bash
npm install
```

Start local development:

```bash
npm run dev
```

Validate before pushing:

```bash
npm run lint
npm run typecheck
npm run build
npm run i18n:check
```

## Deployment

The live site is deployed on Netlify from GitHub:

- Repository: `fbjk2000/unyt-shop`
- Branch: `main`
- Netlify site: `unyt-shop-preview-20260318`
- Build command: `npm run build`
- Publish directory: `.next`
- Runtime: `@netlify/plugin-nextjs`

`transfer.unyt.shop` is served by the same Next.js app and must be configured as a Netlify domain alias/custom domain on the same site. Host-aware middleware redirects:

- `transfer.unyt.shop` -> `/de/transfer`
- `transfer.unyt.shop/de` -> `/de/transfer`
- `transfer.unyt.shop/en` -> `/en/transfer`

## Main Routes

Public marketing routes:

- `/`
- `/transfer`
- `/unytbot`
- `/unyt-exchange`
- `/ecosystem`
- `/how-it-works`
- `/security`
- `/faq`

App routes:

- `/app/wallet`
- `/app/admin`
- `/app/swap`
- `/app/activity`
- `/app/settings`

Transfer routes and APIs:

- `/de/transfer` and `/en/transfer` - public guided transfer page.
- `/api/transfer/intake` - submit public wallet details for assisted review.
- `/api/transfer/status` - lookup transfer status by email and reference.
- `/api/transfer/wallet-challenge` - create a MetaMask signature challenge.
- `/api/transfer/wallet-verify` - verify wallet control with `personal_sign`.
- `/api/admin/transfers` - admin transfer queue.
- `/api/admin/transfers/import-supporters` - import real supporter/backer source records.
- `/api/admin/transfers/[transferId]` - update status and execution metadata.

## Transfer Subdomain

`transfer.unyt.shop` is the official guided transfer destination promised to existing supporters/backers. It is intentionally not a fake automated transfer flow.

Current production state:

- Live: transfer information, MetaMask preparation guidance, public wallet intake, MetaMask signature verification, and transfer reference status lookup.
- Ready for operations: admin review queue, supporter/backer source-data import, email-based matching, status notes, and execution metadata fields.
- Not live: automatic token transfer execution. Admin completion requires a transaction hash, but the app does not submit chain transactions yet.

Operational details are documented in [docs/transfer-operations.md](docs/transfer-operations.md).

Normalize CSV supporter exports before admin import:

```bash
npm run transfer:normalize-supporters -- ./supporter-export.csv
```

The default normalized output is:

```text
data/transfer-supporters.normalized.json
```

## Persistence

Supporter wallet state, sessions, admin sessions, audit logs, transfer requests, transfer wallet challenges, and imported transfer source records share the supporter database shape in `lib/server/supporter-store.ts`.

Storage defaults:

- Local development: file storage at `data/supporter-wallet-db.json`.
- Netlify production: Netlify Blobs store `unyt-shop-supporter-db`, key `supporter-wallet-db.json`.
- File override: set `SUPPORTER_DATA_DIR=/path/to/writable/storage`.
- Driver override: set `SUPPORTER_STORAGE_DRIVER=file` or `SUPPORTER_STORAGE_DRIVER=blobs`.
- Blob store override: set `SUPPORTER_BLOB_STORE=<store-name>`.

The Supabase/Postgres migration in `supabase/migrations/20260427000000_transfer_workflow.sql` is available for a later move from Netlify Blobs to relational transfer operations.

## Admin

Superadmin and editor tools are available under `/app/admin` and `/api/admin/*`.

Required production variable:

- `SUPERADMIN_PASSWORD`

Optional admin variables:

- `SUPERADMIN_EMAIL` - defaults to `admin@unyt.shop`.
- `SUPERADMIN_EDITOR_EMAILS` - comma-separated editor allowlist.
- `SUPERADMIN_VIEWER_EMAILS` - comma-separated viewer allowlist.
- `ADMIN_MAX_BALANCE_DELTA` - default `1000`; max absolute available/pending balance delta per edit.

Admin audit logs can be viewed through the admin UI and exported as CSV via `/api/admin/audit.csv`.

## Integrations

Interest lead capture uses TAKO first and falls back to EarnRM task creation if TAKO is unavailable.

TAKO variables used by `/api/interest/register`:

- `TAKO_LEADS_ENDPOINT`
- `TAKO_API_KEY` - optional when the endpoint requires auth.
- `TAKO_API_KEY_HEADER` - optional, defaults to `x-api-key`.
- `TAKO_SOURCE` - optional, defaults to `unyt-interest`.

EarnRM variables:

- `EARNRM_API_BASE_URL`
- `EARNRM_API_KEY` - preferred; `EARNRM_API_TOKEN` is also accepted.
- `EARNRM_TASKS_ENDPOINT` - optional, defaults to `v1/tasks`.
- `EARNRM_REDEMPTION_ENDPOINT` - optional, defaults to `v1/tasks`.
- `EARNRM_TASK_ASSIGNEE_ID` - optional.
- `EARNRM_TASK_PROJECT_ID` - optional.

Set `EARNRM_API_BASE_URL` to the EarnRM API base, for example `https://earnrm.com/api`, for fallback continuity.

## Localization

The project uses `next-intl` with locale-aware routing and middleware.

- Locales are defined in `i18n/routing.ts` (`en`, `de`).
- Messages are stored in `messages/<locale>.json`.
- Locale route wrappers live under `app/[locale]/...`.
- The header locale switcher is available on marketing and app surfaces.

Localization validation:

```bash
npm run i18n:check
npm run i18n:report-inline-text
npm run i18n:report-untranslated
```

`i18n:check` fails on missing/extra keys, empty values, unresolved TODO markers, and ICU placeholder mismatches. The report commands help find hardcoded UI text and untranslated strings.
