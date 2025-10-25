-- Phones inventory (each physical unit)
create table if not exists phones (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,           -- e.g., HM-ROUGE-01
  colour text not null check (colour in ('creme','rouge','jaune','rose','bleu')),
  active boolean not null default true
);

-- Bookings table
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  wedding_date date not null,
  colour text not null check (colour in ('creme','rouge','jaune','rose','bleu')),
  package text not null check (package in ('standard','deluxe')),
  phone_code text,                      -- Assigned unit
  status text not null check (status in ('hold','confirmed','released','cancelled')) default 'hold',
  stripe_session_id text,
  amount_cents integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_bookings_date on bookings (wedding_date);
create index if not exists idx_bookings_colour on bookings (colour);
create index if not exists idx_bookings_status on bookings (status);

-- Simple trigger to update updated_at
create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;
drop trigger if exists trg_bookings_touch on bookings;
create trigger trg_bookings_touch before update on bookings for each row execute procedure touch_updated_at();

-- Example seed (remove in prod):
-- insert into phones (code, colour) values
-- ('HM-CREME-01','creme'),('HM-ROUGE-01','rouge'),('HM-JAUNE-01','jaune'),('HM-ROSE-01','rose'),('HM-BLEU-01','bleu');
