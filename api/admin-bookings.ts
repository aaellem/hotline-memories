import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminClient } from './_supabase';
import { requireAdmin } from './_admin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    requireAdmin(req);
    const supa = getAdminClient();
    const { from, to } = req.query as { from?: string, to?: string };
    let q = supa.from('bookings').select('*').order('wedding_date', { ascending: true }).limit(500);
    if (from) q = q.gte('wedding_date', from);
    if (to) q = q.lte('wedding_date', to);
    const { data, error } = await q;
    if (error) throw error;
    return res.json({ bookings: data });
  } catch (err:any) {
    return res.status(err.status || 500).json({ error: err.message || String(err) });
  }
}
