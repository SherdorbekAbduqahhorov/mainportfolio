import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400',
  secondary:
    'border border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-800',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
  danger: 'bg-rose-600 text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500',
};

export function buttonClasses(variant: ButtonVariant = 'primary', extra = ''): string {
  return [
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium',
    'transition-all duration-200 active:scale-[0.98] hover:-translate-y-px',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30',
    'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0',
    VARIANT_CLASSES[variant],
    extra,
  ].join(' ');
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant };

export function Button({ variant = 'primary', className = '', type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...props} />;
}
