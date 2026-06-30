import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, title, subtitle, centered = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col',
        centered && 'items-center text-center',
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'mb-3 block h-1 w-12 rounded-full bg-[var(--color-accent,#ea580c)]',
          centered && 'mx-auto'
        )}
        aria-hidden="true"
      />
      <h2 className="text-2xl font-bold text-[var(--color-text,#0f172a)] sm:text-3xl leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-3 text-base text-[var(--color-text-muted,#64748b)] leading-relaxed',
            centered ? 'max-w-2xl' : 'max-w-xl'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
);

SectionHeader.displayName = 'SectionHeader';

export { SectionHeader };
export type { SectionHeaderProps };
