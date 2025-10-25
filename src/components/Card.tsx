import React from 'react';
type Props = { className?: string; children: React.ReactNode; };
export default function Card({ className = '', children }: Props){
  return <div className={`rounded-2xl bg-white shadow-sm ${className}`}>{children}</div>;
}