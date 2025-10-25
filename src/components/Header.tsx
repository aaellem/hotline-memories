import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from './Button';

export default function Header(){
  const linkCls = (isActive:boolean)=>`font-bold text-lg rounded-full px-3 py-1 ${isActive?'text-brand-primary':'text-brand-ink hover:text-brand-primary'}`;
  return (
    <header className='sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-brand-accent/30'>
      <div className='max-w-6xl mx-auto px-4 py-2'>
        <div className='grid grid-cols-3 items-center'>
          <nav className='flex items-center justify-center gap-4'>
            <NavLink to='/' className={({isActive})=>linkCls(isActive)}>Home</NavLink>
            <NavLink to='/faq' className={({isActive})=>linkCls(isActive)}>FAQ</NavLink>
          </nav>
          <div className='flex justify-center'>
            <Link to='/'><img src='/Hotline_Memories_Logo.svg' alt='Hotline Memories' className='w-32 h-32 md:w-36 md:h-36' /></Link>
          </div>
          <nav className='flex items-center justify-center gap-4'>
            <NavLink to='/contact' className={({isActive})=>linkCls(isActive)}>Contact</NavLink>
            <Link to='/booking'><Button className='text-sm font-bold'>Booking</Button></Link>
          </nav>
        </div>
      </div>
    </header>
  );
}