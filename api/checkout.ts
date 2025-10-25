import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { getAdminClient } from './_supabase';
import { addDays } from './_dates';

const currency = (process.env.BOOKING_CURRENCY || 'aud') as Stripe.Checkout.SessionCreateParams.PaymentIntentData['currency'];
const depositAmount = Number(process.env.DEPOSIT_AMOUNT_CENTS || '5000'); // $100 default

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) return res.status(501).json({ error: 'Stripe not configured. Provide STRIPE_SECRET_KEY.' });
    const stripe = new Stripe(secret, { apiVersion: '2024-06-20' });

    const { name, email, phone, date, colour, pkg, total } = req.body || {};
    if (!name || !email || !date || !colour || !pkg) return res.status(400).json({ error: 'Missing required fields' });

    const supa = getAdminClient();

    // Reserve (hold) a phone: pick first available code for that date/colour
    const { data: inv } = await supa.from('phones').select('code').eq('colour', colour).eq('active', true);
    const { data: booked } = await supa.from('bookings')
      .select('phone_code')
      .gte('wedding_date', addDays(date, -Number(process.env.BOOKING_BUFFER_DAYS_BEFORE||'2')))
      .lte('wedding_date', addDays(date,  Number(process.env.BOOKING_BUFFER_DAYS_AFTER||'2')))
      .in('status', ['hold','confirmed'])
      .eq('colour', colour);
    const reserved = new Set((booked||[]).map((b:any)=>b.phone_code));
    const code = (inv||[]).map((p:any)=>p.code).find((c:string)=>!reserved.has(c));

    if (!code) return res.status(409).json({ error: 'No inventory available for that colour on this date.' });

    // Create a hold booking
    const { data: hold, error: holdErr } = await supa.from('bookings').insert({
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      wedding_date: date,
      colour,
      package: pkg,
      phone_code: code,
      status: 'hold',
      amount_cents: Number(total || depositAmount)
    }).select().single();
    if (holdErr) throw holdErr;

    const successUrl = `${process.env.APP_BASE_URL || 'http://localhost:5173'}/booking?success=1`;
    const cancelUrl  = `${process.env.APP_BASE_URL || 'http://localhost:5173'}/booking?canceled=1`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{
        price_data: {
          currency,
          product_data: { name: `Deposit — ${colour} (${pkg}) — ${date}` },
          unit_amount: depositAmount,
        },
        quantity: 1
      }],
      metadata: {
        booking_id: hold.id,
        colour,
        phone_code: code,
        wedding_date: date,
        package: pkg
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // Save stripe session id
    await supa.from('bookings').update({ stripe_session_id: session.id }).eq('id', hold.id);

    return res.json({ url: session.url });
  } catch (err:any) {
    if (process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: err.message || String(err) });
    }
    return res.status(501).json({ error: 'Checkout backend not configured. Provide STRIPE_* env vars and Supabase.' });
  }
}
