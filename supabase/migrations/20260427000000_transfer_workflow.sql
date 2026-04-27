create type transfer_request_status as enum (
  'received',
  'manual_review',
  'needs_support',
  'matched',
  'ready_for_confirmation',
  'completed',
  'rejected'
);

create type transfer_eligibility as enum (
  'eligible',
  'hold',
  'blocked'
);

create table transfer_source_supporters (
  id uuid primary key default gen_random_uuid(),
  imported_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  supporter_email text not null unique,
  display_name text not null default '',
  source_system text not null default 'supporter_export',
  source_reference text not null default '',
  allocation_amount numeric,
  allocation_unit text not null default 'UNYT',
  transfer_eligibility transfer_eligibility not null default 'eligible',
  current_wallet_address text,
  notes text not null default ''
);

create index transfer_source_supporters_email_idx
  on transfer_source_supporters (lower(supporter_email));

create table transfer_requests (
  id uuid primary key default gen_random_uuid(),
  public_reference text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  supporter_email text not null,
  display_name text not null default '',
  wallet_address text not null,
  support_notes text not null default '',
  status transfer_request_status not null default 'received',
  status_note text not null default '',
  supporter_record_found boolean not null default false,
  matched_supporter_id text,
  source_supporter_record_id uuid references transfer_source_supporters(id),
  source_reference text,
  allocation_amount numeric,
  allocation_unit text,
  transfer_eligibility text not null default 'unknown',
  wallet_signature_verified boolean not null default false,
  wallet_verified_at timestamptz,
  reviewed_by text,
  reviewed_at timestamptz,
  admin_notes text not null default '',
  prepared_at timestamptz,
  completed_at timestamptz,
  execution_network text,
  token_contract_address text,
  transaction_hash text,
  constraint transfer_completed_requires_tx
    check (status <> 'completed' or transaction_hash is not null)
);

create index transfer_requests_email_idx
  on transfer_requests (lower(supporter_email));

create index transfer_requests_status_idx
  on transfer_requests (status, updated_at desc);

create unique index transfer_requests_email_wallet_idx
  on transfer_requests (lower(supporter_email), lower(wallet_address));

create table transfer_wallet_challenges (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz,
  supporter_email text not null,
  wallet_address text not null,
  message text not null
);

create index transfer_wallet_challenges_lookup_idx
  on transfer_wallet_challenges (supporter_email, wallet_address, expires_at desc);

create table transfer_audit_log (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  admin_email text not null,
  admin_role text not null,
  action text not null,
  target_email text,
  reason text not null default '',
  details text not null default ''
);

create index transfer_audit_log_occurred_at_idx
  on transfer_audit_log (occurred_at desc);

comment on table transfer_source_supporters is 'Imported authoritative supporter/backer records used to match transfer requests.';
comment on table transfer_requests is 'Assisted UNYT transfer requests. Actual token transfer execution is not implied by a row existing.';
comment on column transfer_requests.transaction_hash is 'Required only after an approved transfer has actually been executed.';
