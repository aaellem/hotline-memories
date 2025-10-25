import React from 'react';
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'solid'|'outline'|'ghost' };
export default function Button({ variant='solid', className='', ...props }: Props){
  const base='rounded-full px-5 py-2 text-sm font-bold transition';
  const styles={
    solid:'bg-brand-primary text-white hover:bg-brand-secondary',
    outline:'border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
    ghost:'text-brand-ink hover:text-brand-primary'
  } as const;
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}