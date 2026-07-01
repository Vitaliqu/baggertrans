import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent-hover,#d9a20e)] active:scale-[0.98]',
        secondary:
          'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover,#232427)] active:scale-[0.98]',
        outline:
          'border-2 border-[var(--color-border)] text-[var(--color-text)] bg-transparent hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] active:scale-[0.98]',
        ghost:
          'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface-2,#f1f5f9)] active:scale-[0.98]',
      },
      size: {
        sm: 'h-8 px-3 text-sm rounded-md',
        md: 'h-10 px-5 text-sm rounded-md',
        lg: 'h-12 px-7 text-base rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, style, ...props }, ref) => {
    const isDisabled = disabled || loading;

    const shadowStyle =
      variant === 'primary'
        ? { boxShadow: '0 4px 14px 0 rgba(244,184,21,0.35)', ...style }
        : style;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(buttonVariants({ variant, size }), className)}
        style={shadowStyle}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
