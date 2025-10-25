import React from 'react';
import Header from '../components/Header';

const BUSINESS_NAME = 'Hotline Memories';
const CONTACT_EMAIL = 'gday@hotlinememories.au';

type PackageKey = 'standard' | 'deluxe';
type ColourKey = 'creme' | 'rouge' | 'jaune' | 'rose' | 'bleu';

const BASE_PRICE: Record<PackageKey, number> = {
  standard: 325,
  deluxe: 525
};

const COLOUR_LABEL: Record<ColourKey, string> = {
  creme: 'Crème',
  rouge: 'Rouge',
  jaune: 'Jaune',
  rose: 'Rose',
  bleu: 'Bleu'
};

export default function Booking(){
  const [form, setForm] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    colour: 'creme' as ColourKey,
    pkg: 'standard' as PackageKey,
    notes: '',
    addUSB: false,
    addExtraDay: false,
    addExpress: false,
    agree: false,
  });

  const [checking, setChecking] = React.useState(false);
  const [available, setAvailable] = React.useState<null | boolean>(null);
  const [error, setError] = React.useState<string | null>(null);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm({ ...form, [k]: v });
  }

  // Disable past dates
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;

  // Price calculation
  const base = BASE_PRICE[form.pkg];
  const addons = (form.addUSB ? 30 : 0) + (form.addExtraDay ? 100 : 0) + (form.addExpress ? 25 : 0);
  const total = base + addons;
  const depositDue = 50; // due today

  async function checkAvailability() {
    setChecking(true); setError(null);
    // Fake check: mark available unless it's a past date
    await new Promise(r => setTimeout(r, 500));
    const isPast = form.date ? new Date(form.date).getTime() < new Date(minDate).getTime() : true;
    if (isPast) { setAvailable(false); setError('Please pick a future date.'); }
    else { setAvailable(true); }
    setChecking(false);
  }

  function validEmail(v: string){ return /.+@.+\..+/.test(v); }
  const formValid = form.firstName && form.lastName && validEmail(form.email) && form.phone && form.date && form.agree;

  function startStripeCheckout(){
    if(!formValid){ setError('Please fill all required fields and accept the terms.'); return; }
    const params = new URLSearchParams({
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      phone: form.phone,
      date: form.date,
      colour: form.colour,
      package: form.pkg,
      total: String(total)
    });
    // NOTE: Replace this with your real Checkout Session URL later
    window.location.href = `https://checkout.stripe.dev/preview?${params.toString()}`;
  }

  return (
    <div className="min-h-screen bg-white text-brand-ink">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <a href="/" className="inline-flex items-center gap-2 text-sm underline">← Back to Home</a>
        <h1 className="text-4xl font-black mt-4">Book your phone</h1>
        <p className="text-brand-ink/70 mt-1">Secure your date with a small deposit. We'll confirm details within 24 hours.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Form column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium">First name *</label>
                <input className="mt-1 w-full rounded-lg border border-brand-accent/40 p-2" value={form.firstName} onChange={e=>update('firstName', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Last name *</label>
                <input className="mt-1 w-full rounded-lg border border-brand-accent/40 p-2" value={form.lastName} onChange={e=>update('lastName', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Email *</label>
                <input type="email" className="mt-1 w-full rounded-lg border border-brand-accent/40 p-2" value={form.email} onChange={e=>update('email', e.target.value)} />
                {!validEmail(form.email) && form.email && <div className="text-xs text-red-600 mt-1">Please enter a valid email.</div>}
              </div>
              <div>
                <label className="text-sm font-medium">Phone *</label>
                <input className="mt-1 w-full rounded-lg border border-brand-accent/40 p-2" value={form.phone} onChange={e=>update('phone', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Wedding date *</label>
                <input type="date" min={minDate} className="mt-1 w-full rounded-lg border border-brand-accent/40 p-2" value={form.date} onChange={e=>update('date', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Colour</label>
                <select className="mt-1 w-full rounded-lg border border-brand-accent/40 p-2" value={form.colour} onChange={e=>update('colour', e.target.value as ColourKey)}>
                  <option value="creme">Crème</option>
                  <option value="rouge">Rouge</option>
                  <option value="jaune">Jaune</option>
                  <option value="rose">Rose</option>
                  <option value="bleu">Bleu</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Package</label>
                <select className="mt-1 w-full rounded-lg border border-brand-accent/40 p-2" value={form.pkg} onChange={e=>update('pkg', e.target.value as PackageKey)}>
                  <option value="standard">Standard — ${BASE_PRICE.standard}</option>
                  <option value="deluxe">Deluxe — ${BASE_PRICE.deluxe}</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea rows={4} className="mt-1 w-full rounded-lg border border-brand-accent/40 p-2" value={form.notes} onChange={e=>update('notes', e.target.value)} />
              </div>
            </div>

            {/* Add-ons */}
            <div className="rounded-2xl bg-white shadow-sm p-5 border border-brand-accent/30">
              <div className="font-semibold mb-3">Add-ons</div>
              <label className="flex items-center gap-3 py-1">
                <input type="checkbox" checked={form.addUSB} onChange={e=>update('addUSB', e.target.checked)} />
                <span>USB with mastered audio <span className="text-brand-ink/70">(+ $30)</span></span>
              </label>
              <label className="flex items-center gap-3 py-1">
                <input type="checkbox" checked={form.addExtraDay} onChange={e=>update('addExtraDay', e.target.checked)} />
                <span>Extra day hire <span className="text-brand-ink/70">(+ $100)</span></span>
              </label>
              <label className="flex items-center gap-3 py-1">
                <input type="checkbox" checked={form.addExpress} onChange={e=>update('addExpress', e.target.checked)} />
                <span>Express shipping <span className="text-brand-ink/70">(+ $25)</span></span>
              </label>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 mt-2">
              <input type="checkbox" checked={form.agree} onChange={e=>update('agree', e.target.checked)} />
              <span className="text-sm">I agree to the <a href="#" className="underline">booking terms</a> and understand the deposit is refundable if unavailable.</span>
            </label>

            <div className="flex gap-3 mt-4">
              <button onClick={checkAvailability} className="rounded-full px-5 py-2 text-sm font-bold border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white" disabled={checking}>
                {checking ? 'Checking...' : 'Check availability'}
              </button>
              <button onClick={startStripeCheckout} className="rounded-full px-5 py-2 text-sm font-bold bg-brand-primary text-white hover:bg-brand-secondary" disabled={!formValid}>
                Pay $50 deposit with Stripe
              </button>
            </div>

            {error && <div className="mt-3 text-sm text-white bg-red-500 p-3 rounded-lg">{error}</div>}
            {available !== null && (
              <div className="mt-3 text-sm">{available ? <span className="text-green-700">Good news — that date looks available!</span> : <span className="text-red-700">That date isn't available. Try another date and we'll do our best.</span>}</div>
            )}
          </div>

          {/* Summary column */}
          <aside className="space-y-4">
            <div className="rounded-2xl bg-white shadow-lg p-5 border border-brand-accent/40">
              <div className="text-lg font-bold mb-2">Summary</div>
              <div className="text-sm">
                <div className="flex justify-between py-1"><span>Package</span><span className="font-semibold capitalize">{form.pkg}</span></div>
                <div className="flex justify-between py-1"><span>Colour</span><span className="font-semibold">{COLOUR_LABEL[form.colour]}</span></div>
                <div className="flex justify-between py-1"><span>Base price</span><span>${base}</span></div>
                {form.addUSB && <div className="flex justify-between py-1"><span>USB</span><span>+ $30</span></div>}
                {form.addExtraDay && <div className="flex justify-between py-1"><span>Extra day</span><span>+ $100</span></div>}
                {form.addExpress && <div className="flex justify-between py-1"><span>Express shipping</span><span>+ $25</span></div>}
                <div className="border-t border-brand-accent/30 my-2" />
                <div className="flex justify-between py-1 text-lg font-extrabold"><span>Total</span><span>${total}</span></div>
                <div className="flex justify-between py-1"><span>Due today (deposit)</span><span className="font-semibold">${depositDue}</span></div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-brand-accent/30 text-sm text-brand-ink/70">
              Prices include GST. Delivery times may vary slightly based on your event date and location. Questions? <a href={`mailto:${CONTACT_EMAIL}`} className="underline">Email us</a>.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
