'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme="light"
      toastOptions={{
        classNames: {
          toast: 'rounded-lg shadow-lg border border-border',
          title: 'font-semibold text-ink',
          description: 'text-ink/70',
          error: 'bg-red-50 border-red-200',
          success: 'bg-accent-100 border-accent-500',
          loading: 'bg-surface border-navy-800',
          warning: 'bg-orange-50 border-orange-200',
        },
      }}
    />
  );
}
