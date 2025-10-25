import React from 'react';
import Header from '../components/Header';

export default function Contact(){
  return (
    <div className='min-h-screen bg-white text-brand-ink'>
      <Header />
      <main className='max-w-3xl mx-auto px-4 py-12'>
        <h1 className='text-4xl font-black mb-2'>Contact us</h1>
        <p className='text-brand-ink/70 mb-6'>We'd love to help plan your perfect audio guestbook.</p>
        <form action={`mailto:gday@hotlinememories.au`} method='post' encType='text/plain' className='grid grid-cols-1 gap-4'>
          <input name='name' placeholder='Your name' className='rounded-lg border border-brand-accent/30 p-3' />
          <input name='email' type='email' placeholder='Your email' className='rounded-lg border border-brand-accent/30 p-3' />
          <textarea name='message' rows={6} placeholder='How can we help?' className='rounded-lg border border-brand-accent/30 p-3' />
          <button className='rounded-full px-5 py-2 bg-brand-primary text-white font-semibold w-max hover:bg-brand-secondary'>Send</button>
        </form>
        <div className='mt-6 text-sm text-brand-ink/70'>Prefer email? <a className='underline text-brand-ink' href='mailto:gday@hotlinememories.au'>gday@hotlinememories.au</a></div>
      </main>
    </div>
  );
}