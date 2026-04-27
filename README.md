# UNYT.shop

Premium marketing site and app shell for the UNYT ecosystem, built with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the local dev server:

```bash
npm run dev
```

3. Validate the project:

```bash
npm run lint
npm run typecheck
npm run build
npm run i18n:check
```

## Routes

Public routes:
- `/`
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

## Notes

- Wallet account state is now served by backend routes under `/api/supporter/*`.
- Superadmin tools are available under `/app/admin` and `/api/admin/*`.
- Supporter registration, sign-in, top-up, and redemption actions persist server-side in a JSON store.
  - Local default: `data/supporter-wallet-db.json`
  - Production default: `/tmp/unyt-shop-data/supporter-wallet-db.json`
- Optional storage override: `SUPPORTER_DATA_DIR=/path/to/writable/storage`
- Follow-up tasks are created automatically on registration, top-up, and redemption, and are stored in the wallet state.
- Superadmin credentials (required for admin login):
  - `SUPERADMIN_EMAIL` (optional; defaults to `admin@unyt.shop`)
  - `SUPERADMIN_PASSWORD` (required)
- Admin role split (optional):
  - `SUPERADMIN_EDITOR_EMAILS` (comma-separated)
  - `SUPERADMIN_VIEWER_EMAILS` (comma-separated)
- Edit guardrail:
  - `ADMIN_MAX_BALANCE_DELTA` (default `1000`; max absolute available/pending balance delta per edit)
- TAKO lead capture hooks (used by `/api/interest/register`) are available via environment variables:
  - `TAKO_LEADS_ENDPOINT`
  - `TAKO_API_KEY` (optional when endpoint requires auth)
  - `TAKO_API_KEY_HEADER` (optional, default `x-api-key`)
  - `TAKO_SOURCE` (optional, default `unyt-interest`)
- EarnRM integration hooks are available via environment variables:
  - `EARNRM_API_BASE_URL`
  - `EARNRM_API_KEY` (preferred; also accepted as `EARNRM_API_TOKEN`)
  - `EARNRM_TASKS_ENDPOINT` (optional, defaults to `v1/tasks`)
  - `EARNRM_REDEMPTION_ENDPOINT` (optional, defaults to `v1/tasks`)
  - `EARNRM_TASK_ASSIGNEE_ID` (optional)
  - `EARNRM_TASK_PROJECT_ID` (optional)

Interest lead capture routes to TAKO first and falls back to EarnRM task creation if TAKO is unavailable.
Set `EARNRM_API_BASE_URL` to your EarnRM API base (example: `https://earnrm.com/api`) for fallback continuity.

For durable multi-instance production persistence, connect these APIs to a managed datastore.
Admin audit logs can be exported as CSV via `/api/admin/audit.csv`.

## Localization Prep

- The project now uses `next-intl` with locale-aware routing and middleware.
- Current locale list is defined in `i18n/routing.ts` (`en`, `de`).
- Messages are stored in `messages/<locale>.json`.
- Locale route wrappers live under `app/[locale]/...`.
- Header locale switcher is available on marketing and app surfaces.

Validation commands:

```bash
npm run i18n:check
npm run i18n:report-inline-text
npm run i18n:report-untranslated
```

- `i18n:check` fails on missing/extra keys, empty values, unresolved TODO markers, and ICU placeholder mismatches.
- `i18n:report-inline-text` prints likely hardcoded UI text still embedded in TSX files to help eliminate leftover untranslated copy.
- `i18n:report-untranslated` reports strings in non-base locales that still match the English source exactly, so translation leftovers are measurable before release.
