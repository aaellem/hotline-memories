# Deploying Hotline Memories (v4_15) with Inventory & Stripe

## 1) Create Supabase project
- Create a new project → get **SUPABASE_URL** and **SERVICE ROLE** key
- In SQL editor, run the contents of `schema.sql`
- In `phones` table, insert your units, e.g.:
  - `HM-CREME-01`, `creme`
  - `HM-ROUGE-01`, `rouge`
  - etc.

## 2) Stripe
- Create a Stripe account and get your **secret key** (test mode is fine).
- In Developers → Webhooks, add an endpoint:
  - URL: `https://<your-vercel-domain>/api/stripe-webhook`
  - Events: `checkout.session.completed`, `checkout.session.expired`
- Copy the **signing secret** to `STRIPE_WEBHOOK_SECRET`.

## 3) Vercel
- Import this repo/folder into Vercel
- In **Project → Settings → Environment Variables**, set:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `APP_BASE_URL` (e.g., `https://yourdomain.com`)
  - `BOOKING_CURRENCY` (e.g., `aud`)
  - `DEPOSIT_AMOUNT_CENTS` (e.g., `10000` for $100 deposit)
- Redeploy.

## 4) Local dev
- Create a `.env` from `.env.example` and fill values.
- Run `npm install` then `npm run dev`
- The API routes will be available when deployed on Vercel. For local testing of API routes, use `vercel dev`.

## Flow
1. Booking page calls `/api/availability?date=YYYY-MM-DD&colour=rouge` to get **remaining units** and codes.
2. Checkout `POST /api/checkout`:
   - Creates a **hold** in `bookings` with assigned `phone_code`
   - Creates a Stripe Checkout Session for a **deposit**
   - Redirects the browser to Stripe
3. Webhook `/api/stripe-webhook`:
   - On payment success: mark booking **confirmed**
   - On expiration/cancel: mark booking **released**

This design scales naturally: add more rows to `phones` for each new unit (e.g., `HM-ROUGE-02`), and the availability logic automatically allows multiple bookings per colour per date, up to your inventory.

## Admin Dashboard
- Route: `/admin`
- Enter the **Admin password** (set `ADMIN_PASSWORD` env)
- Pick a date → view:
  - Inventory per colour with conflicts across the buffer window
  - Bookings on the selected date
- API authentication: send `x-admin-key: ADMIN_PASSWORD` header

## Buffer window
- Set env vars: `BOOKING_BUFFER_DAYS_BEFORE=2`, `BOOKING_BUFFER_DAYS_AFTER=2`
- Availability and allocation consider bookings within `date - before` to `date + after`
