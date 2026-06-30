import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-primary)] text-white',
        orange: 'bg-[var(--color-accent)] text-white',
        green: 'bg-[var(--color-success,#16a34a)] text-white',
        red: 'bg-[var(--color-destructive,#dc2626)] text-white',
        muted: 'bg-[var(--color-border,#e2e8f0)] text-[var(--color-text-muted,#64748b)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  )
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
