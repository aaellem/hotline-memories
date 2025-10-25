import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { getAdminClient } from './_supabase';

export const config = { api: { bodyParser: false } }; // we need raw body

function buffer(req: any) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: any[] = [];
    req.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const secret = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !whSecret) return res.status(501).json({ error: 'Stripe not configured' });

  const stripe = new Stripe(secret, { apiVersion: '2024-06-20' });

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, whSecret);
  } catch (err:any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const supa = getAdminClient();

  // Confirm booking on successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.booking_id;
    if (bookingId) {
      await supa.from('bookings').update({ status: 'confirmed' }).eq('id', bookingId);
    }
  }

  // On expiration or cancel, release holds (optional: handle 'checkout.session.expired')
  if (event.type === 'checkout.session.expired' || event.type === 'payment_intent.canceled') {
    // Ideally we stored booking_id in metadata as above
    const session = event.data.object as any;
    const bookingId = session.metadata?.booking_id;
    if (bookingId) {
      await supa.from('bookings').update({ status: 'released' }).eq('id', bookingId);
    }
  }

  res.json({ received: true });
}
