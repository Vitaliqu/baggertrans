import * as React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'animate-pulse rounded-md bg-[var(--color-border,#e2e8f0)] relative overflow-hidden',
        'after:absolute after:inset-0 after:translate-x-[-100%]',
        'after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent',
        'after:animate-[shimmer_1.5s_infinite]',
        className
      )}
      style={{
        '--shimmer-animation': 'shimmer 1.5s infinite',
      } as React.CSSProperties}
      {...props}
    />
  )
);
Skeleton.displayName = 'Skeleton';

const SkeletonCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-[var(--color-border,#e2e8f0)] bg-[var(--color-surface,#ffffff)] p-6 shadow-sm',
        className
      )}
      {...props}
    >
      <Skeleton className="h-4 w-3/4 mb-3" />
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-5/6 mb-2" />
      <Skeleton className="h-3 w-2/3 mb-4" />
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>
  )
);
SkeletonCard.displayName = 'SkeletonCard';

interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
}

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ className, lines = 3, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3"
          style={{ width: i === lines - 1 ? '66%' : '100%' }}
        />
      ))}
    </div>
  )
);
SkeletonText.displayName = 'SkeletonText';

export { Skeleton, SkeletonCard, SkeletonText };
