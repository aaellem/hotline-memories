import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminClient } from './_supabase';
import { requireAdmin } from './_admin';
import { addDays } from './_dates';

type ColourKey = 'creme'|'rouge'|'jaune'|'rose'|'bleu';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    requireAdmin(req);
    const supa = getAdminClient();
    const { date } = req.query as { date?: string };
    if (!date) return res.status(400).json({ error: 'Missing ?date=YYYY-MM-DD' });

    const before = Number(process.env.BOOKING_BUFFER_DAYS_BEFORE || '2');
    const after = Number(process.env.BOOKING_BUFFER_DAYS_AFTER || '2');
    const start = addDays(date, -before);
    const end = addDays(date, after);

    const { data: phones, error: perr } = await supa.from('phones').select('*').eq('active', true).order('colour', { ascending: true });
    if (perr) throw perr;
    const { data: bookings, error: berr } = await supa.from('bookings')
      .select('phone_code, colour, status, wedding_date')
      .gte('wedding_date', start).lte('wedding_date', end)
      .in('status', ['hold','confirmed']);
    if (berr) throw berr;

    const byCode: Record<string, any> = {};
    (phones||[]).forEach((p:any)=> byCode[p.code] = { ...p, conflicts: [] as string[] });
    (bookings||[]).forEach((b:any)=> {
      if (b.phone_code && byCode[b.phone_code]) byCode[b.phone_code].conflicts.push(b.wedding_date);
    });

    const grouped: Record<ColourKey, any[]> = { creme:[], rouge:[], jaune:[], rose:[], bleu:[] };
    Object.values(byCode).forEach((p:any) => grouped[p.colour as ColourKey].push(p));

    return res.json({ window: { start, end }, phones: grouped });
  } catch (err:any) {
    return res.status(err.status || 500).json({ error: err.message || String(err) });
  }
}
