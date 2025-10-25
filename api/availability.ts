import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminClient } from './_supabase';
import { addDays } from './_dates';

type ColourKey = 'creme'|'rouge'|'jaune'|'rose'|'bleu';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { date, colour } = req.query as { date?: string, colour?: ColourKey };
    if (!date) return res.status(400).json({ error: 'Missing date=YYYY-MM-DD' });

    const supa = getAdminClient();

    // 1) Count active phones by colour (inventory capacity)
    let { data: phones, error: pErr } = await supa.from('phones').select('code, colour, active').eq('active', true);
    if (pErr) throw pErr;

    // Group capacity by colour
    const capacity: Record<ColourKey, string[]> = { creme:[], rouge:[], jaune:[], rose:[], bleu:[] };
    (phones||[]).forEach((ph:any)=>{ if (capacity[ph.colour as ColourKey]) capacity[ph.colour as ColourKey].push(ph.code); });

    // 2) Get holds/confirmed bookings within buffer window
    let { data: bookings, error: bErr } = await supa
      .from('bookings')
      .select('phone_code, colour, status')
      .gte('wedding_date', addDays(date, -Number(process.env.BOOKING_BUFFER_DAYS_BEFORE||'2')))
      .lte('wedding_date', addDays(date,  Number(process.env.BOOKING_BUFFER_DAYS_AFTER||'2')))
      .in('status', ['hold','confirmed']);
    if (bErr) throw bErr;

    const used: Record<ColourKey, string[]> = { creme:[], rouge:[], jaune:[], rose:[], bleu:[] };
    (bookings||[]).forEach((b:any)=>{
      const c = b.colour as ColourKey;
      if (b.phone_code) used[c].push(b.phone_code);
    });

    // Determine available codes by colour (subtract used from capacity)
    const availableByColour: Record<ColourKey, string[]> = { creme:[], rouge:[], jaune:[], rose:[], bleu:[] };
    (Object.keys(capacity) as ColourKey[]).forEach(c => {
      const allCodes = capacity[c];
      const reserved = new Set(used[c]);
      availableByColour[c] = allCodes.filter(code => !reserved.has(code));
    });

    if (colour) {
      return res.json({
        date,
        colour,
        capacity: capacity[colour].length,
        booked: used[colour].length,
        available: availableByColour[colour].length,
        availableCodes: availableByColour[colour]
      });
    }

    return res.json({
      date,
      capacity: Object.fromEntries(Object.entries(capacity).map(([k,v])=>[k, v.length])),
      booked: Object.fromEntries((Object.keys(used) as ColourKey[]).map(k=>[k, used[k].length])),
      available: Object.fromEntries((Object.keys(availableByColour) as ColourKey[]).map(k=>[k, availableByColour[k].length])),
      availableCodes: availableByColour
    });
  } catch (err:any) {
    if (process.env.SUPABASE_URL) {
      return res.status(500).json({ error: err.message || String(err) });
    }
    return res.status(501).json({ error: 'Availability backend not configured. Provide SUPABASE_URL and SUPABASE_SERVICE_ROLE env vars.' });
  }
}
