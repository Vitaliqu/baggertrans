import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const COLOR_MAP = {
  blue: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-100',
    icon: 'text-green-600',
  },
  orange: {
    bg: 'bg-orange-100',
    icon: 'text-orange-600',
  },
  navy: {
    bg: 'bg-slate-100',
    icon: 'text-slate-700',
  },
} as const;

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'navy';
  className?: string;
}

export function StatCard({ title, value, icon: Icon, color, className }: StatCardProps) {
  const colors = COLOR_MAP[color];

  return (
    <div
      className={cn(
        'bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 flex items-center gap-4 shadow-sm',
        className
      )}
    >
      <div className={cn('flex items-center justify-center w-12 h-12 rounded-xl shrink-0', colors.bg)}>
        <Icon size={22} className={colors.icon} />
      </div>
      <div className="min-w-0">
        <p className="text-[var(--color-text-muted)] text-xs font-medium uppercase tracking-wide truncate">
          {title}
        </p>
        <p className="text-[var(--color-text)] text-2xl font-bold leading-tight mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}
