import React from 'react';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@/types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' | 'info';
  status?: OrderStatus;
}

export function Badge({ className, variant = 'default', status, children, ...props }: BadgeProps) {
  let computedVariant = variant;

  if (status) {
    switch (status) {
      case 'Pendiente':
        computedVariant = 'warning';
        break;
      case 'Confirmado':
        computedVariant = 'info';
        break;
      case 'Preparando':
        computedVariant = 'secondary';
        break;
      case 'Enviado':
        computedVariant = 'default';
        break;
      case 'Entregado':
        computedVariant = 'success';
        break;
    }
  }

  const variants = {
    default: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    secondary: 'bg-amber-100 text-amber-800 border-amber-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    destructive: 'bg-rose-100 text-rose-800 border-rose-200',
    outline: 'border-slate-300 text-slate-700 bg-white',
    info: 'bg-sky-100 text-sky-800 border-sky-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors',
        variants[computedVariant],
        className
      )}
      {...props}
    >
      {children || status}
    </span>
  );
}
