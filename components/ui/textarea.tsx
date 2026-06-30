import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, placeholder = ' ', ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1 w-full">
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            placeholder={placeholder}
            className={cn(
              'peer block w-full rounded-md border bg-[var(--color-surface,#ffffff)] px-3 pt-6 pb-2 text-sm text-[var(--color-text,#0f172a)] transition-all duration-150 resize-y min-h-[100px]',
              'placeholder-transparent',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent,#ea580c)] focus:border-transparent',
              error
                ? 'border-[var(--color-destructive,#dc2626)]'
                : 'border-[var(--color-border,#e2e8f0)] hover:border-[var(--color-text-muted,#64748b)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />
          {label && (
            <label
              htmlFor={textareaId}
              className={cn(
                'absolute left-3 text-[var(--color-text-muted,#64748b)] pointer-events-none transition-all duration-150',
                'top-3.5 text-sm',
                'peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm',
                'peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[var(--color-accent,#ea580c)]',
                'peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-[10px]'
              )}
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="text-xs text-[var(--color-destructive,#dc2626)]">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-[var(--color-text-muted,#64748b)]">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
