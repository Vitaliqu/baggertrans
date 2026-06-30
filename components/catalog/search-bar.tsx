'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
}

const SORT_OPTIONS = [
  { value: '', label: 'Сортувати' },
  { value: 'price_asc', label: 'Ціна: від низької' },
  { value: 'price_desc', label: 'Ціна: від високої' },
  { value: 'name_asc', label: 'Назва: A → Я' },
  { value: 'name_desc', label: 'Назва: Я → A' },
];

export function SearchBar({ value, onChange, sort, onSortChange }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {/* Search input */}
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Пошук техніки..."
          className={cn(
            'w-full h-10 pl-9 pr-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]',
            'text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent',
            'transition-all duration-150'
          )}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Очистити пошук"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sort select */}
      <div className="relative shrink-0">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className={cn(
            'h-10 pl-3 pr-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]',
            'text-sm text-[var(--color-text)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent',
            'transition-all duration-150 cursor-pointer appearance-none',
            'w-full sm:w-48'
          )}
          aria-label="Сортування"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
