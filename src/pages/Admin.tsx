import React from 'react';
import Header from '../components/Header';

function ymd(d: Date) { return d.toISOString().slice(0,10); }
const today = ymd(new Date());

export default function Admin(){
  const [key, setKey] = React.useState('');
  const [date, setDate] = React.useState<string>(today);
  const [bookings, setBookings] = React.useState<any[]|null>(null);
  const [phones, setPhones] = React.useState<any|null>(null);
  const [error, setError] = React.useState<string|null>(null);

  async function load(){
    setError(null);
    try {
      const b = await fetch(`/api/admin-bookings?from=${date}&to=${date}`, { headers: { 'x-admin-key': key } });
      const bj = await b.json();
      if (!b.ok) throw new Error(bj?.error || 'Failed to load bookings');

      const p = await fetch(`/api/admin-phones?date=${date}`, { headers: { 'x-admin-key': key } });
      const pj = await p.json();
      if (!p.ok) throw new Error(pj?.error || 'Failed to load phones');

      setBookings(bj.bookings || []);
      setPhones(pj);
    } catch (e:any) {
      setError(e.message);
    }
  }

  return (
    <div className="min-h-screen bg-white text-brand-ink">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black mb-4">Admin — Bookings & Inventory</h1>
        <div className="rounded-2xl border border-brand-accent/30 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium">Admin password</label>
              <input type="password" className="mt-1 w-full rounded-lg border p-2 border-brand-accent/40" value={key} onChange={e=>setKey(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <input type="date" className="mt-1 w-full rounded-lg border p-2 border-brand-accent/40" value={date} onChange={e=>setDate(e.target.value)} />
            </div>
            <div className="flex items-end">
              <button onClick={load} className="rounded-full px-5 py-2 text-sm font-bold bg-brand-primary text-white hover:bg-brand-secondary w-full">Load</button>
            </div>
          </div>
          {error && <div className="text-sm text-white bg-red-500 mt-3 p-2 rounded">{error}</div>}
        </div>

        {/* Phones availability around date */}
        {phones && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-2">Inventory window {phones.window.start} → {phones.window.end}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['creme','rouge','jaune','rose','bleu'].map((c) => (
                <div key={c} className="rounded-2xl border border-brand-accent/30 p-4">
                  <div className="font-semibold capitalize mb-2">{c}</div>
                  <div className="space-y-1">
                    {(phones.phones[c]||[]).map((p:any)=> (
                      <div key={p.code} className="flex justify-between text-sm">
                        <span>{p.code}</span>
                        {p.conflicts.length ? (
                          <span className="text-red-700">Booked: {p.conflicts.join(', ')}</span>
                        ) : (
                          <span className="text-green-700">Available</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bookings list */}
        {bookings && (
          <section>
            <h2 className="text-xl font-bold mb-2">Bookings on {date}</h2>
            <div className="rounded-2xl border border-brand-accent/30 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-brand-accent/10">
                  <tr>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Colour</th>
                    <th className="text-left p-2">Package</th>
                    <th className="text-left p-2">Phone code</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b:any)=> (
                    <tr key={b.id} className="border-t">
                      <td className="p-2">{b.wedding_date}</td>
                      <td className="p-2">{b.customer_name}</td>
                      <td className="p-2">{b.customer_email}</td>
                      <td className="p-2 capitalize">{b.colour}</td>
                      <td className="p-2 capitalize">{b.package}</td>
                      <td className="p-2">{b.phone_code || '-'}</td>
                      <td className="p-2 capitalize">{b.status}</td>
                    </tr>
                  ))}
                  {!bookings.length && (
                    <tr><td className="p-2" colSpan={7}>No bookings for this date.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
