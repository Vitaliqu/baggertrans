import * as React from 'react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  color?: string;
}

const SIZE_MAP: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-[3px]',
};

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size = 'md', color, style, ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label="Завантаження"
      className={cn('inline-block animate-spin rounded-full', SIZE_MAP[size], className)}
      style={{
        borderColor: color
          ? `${color}40`
          : 'var(--color-border, #e2e8f0)',
        borderTopColor: color ?? 'var(--color-accent, #ea580c)',
        ...style,
      }}
      {...props}
    />
  )
);

Spinner.displayName = 'Spinner';

export { Spinner };
export type { SpinnerSize, SpinnerProps };
