import React, { useEffect } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

const phones = [
  { color: 'Crème', key: 'creme', image: '/images/cream-phone.jpg' },
  { color: 'Rouge', key: 'rouge', image: '/images/red-phone.jpg' },
  { color: 'Jaune', key: 'jaune', image: '/images/yellow-phone.jpg' },
  { color: 'Rose', key: 'rose', image: '/images/pink-phone.jpg' },
  { color: 'Bleu', key: 'bleu', image: '/images/blue-phone.jpg' },
];

export default function Home() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.js-reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className="min-h-screen text-brand-ink bg-white">
      <Header />

      {/* HERO */}
      <section className="relative min-h-[60vh]">
        {/* Background image (PNG) */}
        <img
          src="/images/couple-using-phone.png"
          alt="Newlywed couple using the audio guestbook"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Warm gradient overlay (semi-transparent) */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/70 via-transparent to-brand-accent/10 pointer-events-none" />
        {/* Foreground content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 md:py-36 text-center">
          <h1 className="text-white drop-shadow text-5xl md:text-6xl font-extrabold leading-tight">
            Retro Audio Guestbooks
            <br />
            <span className="text-brand-accent">for unforgettable weddings</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-white/90 text-lg">
            Let your favourite people pick up the handset and leave stories you'll replay forever.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/booking">
              <button className="rounded-full px-5 py-2 text-sm font-bold bg-brand-primary text-white hover:bg-brand-secondary">
                Check availability
              </button>
            </Link>
            <a href="#phones">
              <button className="rounded-full px-5 py-2 text-sm font-bold border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white">
                See the phones
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* FEATURE BAR */}
      <section className="py-8 bg-brand-primary">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div className="text-white font-extrabold text-lg sm:text-xl">Free AU Delivery*</div>
          <div className="text-white font-extrabold text-lg sm:text-xl">Easy Setup</div>
          <div className="text-white font-extrabold text-lg sm:text-xl">Crystal-Clear Audio</div>
          <div className="text-white font-extrabold text-lg sm:text-xl">Custom Greeting</div>
        </div>
      </section>

      {/* PHONES GRID */}
      <section id="phones" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-4xl font-black">Choose your colour</h2>
            <Link to="/booking">
              <button className="rounded-full px-5 py-2 text-sm font-bold bg-brand-primary text-white hover:bg-brand-secondary">
                Book yours
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {phones.map((p) => (
              <Card key={p.key} className="p-4">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-brand-accent/20">
                  <img src={p.image} alt={p.color} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <h3 className="text-2xl font-semibold text-brand-primary">{p.color}</h3>
                  <Link to="/booking">
                    <button className="rounded-full px-4 py-2 text-sm font-bold border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white">
                      Enquire
                    </button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-brand-ink">
        <div className="max-w-6xl mx-auto px-4 text-white">
          <h2 className="text-4xl font-black mb-8">How it works</h2>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { t: 'Book your date', d: 'Pick a colour and secure your phone with a deposit.' },
              { t: 'We deliver', d: 'Your phone arrives prepped with your custom greeting.' },
              { t: 'Replay forever', d: 'We master the audio and send you the full set.' },
            ].map((s, i) => (
              <li key={i} className="rounded-2xl p-6 border bg-brand-secondary/20 border-brand-secondary/30">
                <div className="text-5xl font-black text-brand-accent">{i + 1}</div>
                <div className="mt-3 text-xl font-semibold">{s.t}</div>
                <p className="mt-2 text-sm opacity-90">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PACKAGES & PRICING */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-2 text-brand-ink">Packages & Pricing</h2>
          <p className="text-brand-ink/70 mb-8">Two simple packages, one unforgettable experience.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Standard Package */}
            <div className="rounded-2xl bg-white shadow-lg p-8 border border-brand-accent/40">
              <h3 className="text-2xl font-bold text-brand-primary mb-2">Standard</h3>
              <p className="text-brand-ink/80 mb-4">Full-day hire for your celebration</p>
              <p className="text-5xl font-extrabold text-brand-ink mb-4">$325</p>
              <ul className="text-left text-brand-ink/80 space-y-2 mb-6">
                <li>✔ All-day hire</li>
                <li>✔ Custom greeting message</li>
                <li>✔ Free AU-wide shipping</li>
                <li>✔ Digital audio download</li>
              </ul>
              <a href="/booking" className="inline-block rounded-full px-6 py-2 bg-brand-primary text-white font-semibold hover:bg-brand-secondary">
                Book Standard
              </a>
            </div>

            {/* Deluxe Package */}
            <div className="rounded-2xl bg-white shadow-lg p-8 border-4 border-brand-primary">
              <h3 className="text-2xl font-bold text-brand-primary mb-2">Deluxe</h3>
              <p className="text-brand-ink/80 mb-4">Premium experience with exclusive extras</p>
              <p className="text-5xl font-extrabold text-brand-primary mb-4">$525</p>
              <ul className="text-left text-brand-ink/80 space-y-2 mb-6">
                <li>✔ All-day hire</li>
                <li>✔ USB with mastered audio</li>
                <li>✔ Express delivery</li>
                <li>✔ Custom engraving option</li>
              </ul>
              <a href="/booking" className="inline-block rounded-full px-6 py-2 bg-brand-primary text-white font-semibold hover:bg-brand-secondary">
                Book Deluxe
              </a>
            </div>

          
          <div className="mx-auto w-1/3 border-t border-brand-accent/30 mt-10 mb-6 js-reveal reveal"></div>
          <p className="text-sm italic text-brand-ink/60 js-reveal reveal">
            *All prices include GST. Delivery times may vary slightly based on your event date and location.*
          </p>

      </div>
    </div>
  </section>

      {/* BOOK NOW CTA BAR */}
      <section className="bg-brand-primary py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-white text-2xl font-extrabold">Ready to reserve your date?</h3>
            <p className="text-white/90">Lock in your colour and package in under two minutes.</p>
          </div>
          <a href="/booking" className="inline-block rounded-full px-6 py-3 bg-white text-brand-ink font-bold hover:bg-brand-accent/20">
            Book now
          </a>
        </div>
      </section>

      <footer className="border-t py-10 text-center text-sm border-brand-accent/30">
        © {new Date().getFullYear()} Hotline Memories · Contact: <a className="underline text-brand-ink" href="mailto:gday@hotlinememories.au">gday@hotlinememories.au</a>
      </footer>
    </div>
  );
}
