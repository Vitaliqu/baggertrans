'use client';

import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastState {
  open: boolean;
  message: string;
  description?: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (options: Omit<ToastState, 'open'>) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-[var(--color-success,#16a34a)] shrink-0" />,
  error: <AlertCircle size={18} className="text-[var(--color-destructive,#dc2626)] shrink-0" />,
  info: <Info size={18} className="text-[var(--color-accent,#ea580c)] shrink-0" />,
  warning: <AlertTriangle size={18} className="text-amber-500 shrink-0" />,
};

const BORDER_COLORS: Record<ToastType, string> = {
  success: 'border-l-[var(--color-success,#16a34a)]',
  error: 'border-l-[var(--color-destructive,#dc2626)]',
  info: 'border-l-[var(--color-accent,#ea580c)]',
  warning: 'border-l-amber-500',
};

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = React.useState<ToastState>({
    open: false,
    message: '',
    type: 'info',
  });

  const toast = React.useCallback((options: Omit<ToastState, 'open'>) => {
    setState({ ...options, open: false });
    // micro-delay so Radix picks up re-open
    requestAnimationFrame(() => {
      setState((prev) => ({ ...prev, open: true }));
    });
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider swipeDirection="right" duration={4000}>
        {children}
        <Toast
          open={state.open}
          onOpenChange={(open) => setState((prev) => ({ ...prev, open }))}
          message={state.message}
          description={state.description}
          type={state.type}
        />
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)] outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
};

interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  description?: string;
  type?: ToastType;
}

const Toast: React.FC<ToastProps> = ({
  open,
  onOpenChange,
  message,
  description,
  type = 'info',
}) => (
  <ToastPrimitive.Root
    open={open}
    onOpenChange={onOpenChange}
    className={cn(
      'flex items-start gap-3 rounded-lg border border-[var(--color-border,#e2e8f0)] border-l-4 bg-[var(--color-surface,#ffffff)] px-4 py-3 shadow-lg',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[swipe=end]:animate-out data-[state=closed]:fade-out-80',
      'data-[state=open]:slide-in-from-bottom-2',
      'data-[state=closed]:slide-out-to-right-full',
      'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
      'data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out]',
      BORDER_COLORS[type]
    )}
  >
    {ICONS[type]}
    <div className="flex-1 min-w-0">
      <ToastPrimitive.Title className="text-sm font-semibold text-[var(--color-text,#0f172a)] leading-snug">
        {message}
      </ToastPrimitive.Title>
      {description && (
        <ToastPrimitive.Description className="mt-0.5 text-xs text-[var(--color-text-muted,#64748b)]">
          {description}
        </ToastPrimitive.Description>
      )}
    </div>
    <ToastPrimitive.Close className="shrink-0 rounded p-0.5 text-[var(--color-text-muted,#64748b)] hover:text-[var(--color-text,#0f172a)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent,#ea580c)]">
      <X size={14} />
    </ToastPrimitive.Close>
  </ToastPrimitive.Root>
);

const useToast = (): ToastContextValue => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
};

export { ToastProvider, Toast, useToast };
export type { ToastType, ToastState };
