import React from 'react';
import Header from '../components/Header';

export default function FAQ(){
  const faqs = [
    { q: 'What is an audio guestbook?', a: 'A retro phone that records voice messages from your guests throughout your event.' },
    { q: 'How do we receive the audio?', a: 'We master and deliver a digital download link. Deluxe packages include USB as well.' },
    { q: 'Do you deliver Australia-wide?', a: 'Yes — shipping and return labels are included. In-person pickup available in select areas.' },
    { q: 'Can we record a custom greeting?', a: "Absolutely! Send us a script or audio and we'll preload it before shipping." },
    { q: 'What if the wedding is on a weekend?', a: 'Weekends are popular. Book early — we often have spare units, so still enquire.' }
  ];
  return (
    <div className='min-h-screen bg-white text-brand-ink'>
      <Header />
      <main className='max-w-4xl mx-auto px-4 py-12'>
        <h1 className='text-4xl font-black mb-6'>FAQ</h1>
        <ul className='space-y-4'>
          {faqs.map((f,i)=>(
            <li key={i} className='bg-white rounded-2xl p-5 border border-brand-accent/30'>
              <div className='font-semibold text-lg'>{f.q}</div>
              <div className='text-brand-ink/80 mt-1'>{f.a}</div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}