import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

type AlertProps = {
  tone: 'error' | 'success';
  children: ReactNode;
};

export function Alert({ tone, children }: AlertProps) {
  const isError = tone === 'error';
  const Icon = isError ? AlertCircle : CheckCircle2;
  const palette = isError
    ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300'
    : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${palette}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
