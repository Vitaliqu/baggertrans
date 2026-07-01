'use client';

import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { EquipmentCategory } from '@/types';
import { CATEGORY_LABELS } from '@/types';

export interface CatalogFilters {
  categories: EquipmentCategory[];
  minPrice: number;
  maxPrice: number;
  onlyAvailable: boolean;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  categories: [],
  minPrice: 0,
  maxPrice: 0,
  onlyAvailable: false,
};

interface FilterSidebarProps {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
  activeCount?: number;
  /** Controlled drawer state. When provided, no internal trigger is rendered on mobile. */
  drawerOpen?: boolean;
  onDrawerOpenChange?: (open: boolean) => void;
}

const ALL_CATEGORIES = Object.entries(CATEGORY_LABELS) as [EquipmentCategory, string][];

function FilterContent({ filters, onChange, onClose }: FilterSidebarProps & { onClose?: () => void }) {
  function toggleCategory(cat: EquipmentCategory) {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: next });
  }

  function handleMinPrice(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    onChange({ ...filters, minPrice: isNaN(val) ? 0 : val });
  }

  function handleMaxPrice(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    onChange({ ...filters, maxPrice: isNaN(val) ? 0 : val });
  }

  function handleReset() {
    onChange(DEFAULT_FILTERS);
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[var(--color-text)]">Фільтри</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити фільтри"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--color-surface-2,#f1f5f9)] text-[var(--color-text-muted)]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wide">
          Категорія
        </h3>
        <div className="flex flex-col gap-2">
          {ALL_CATEGORIES.map(([key, label]) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(key)}
                onChange={() => toggleCategory(key)}
                className="w-4 h-4 rounded border-[var(--color-border)] accent-[var(--color-accent)] cursor-pointer"
              />
              <span className="text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wide">
          Ціна (грн/день)
        </h3>
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <label className="text-xs text-[var(--color-text-muted)] mb-1 block">Від</label>
            <input
              type="number"
              min={0}
              value={filters.minPrice || ''}
              onChange={handleMinPrice}
              placeholder="0"
              className={cn(
                'w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent',
                'placeholder:text-[var(--color-text-muted)]'
              )}
            />
          </div>
          <span className="text-[var(--color-text-muted)] mt-5">—</span>
          <div className="flex-1">
            <label className="text-xs text-[var(--color-text-muted)] mb-1 block">До</label>
            <input
              type="number"
              min={0}
              value={filters.maxPrice || ''}
              onChange={handleMaxPrice}
              placeholder="∞"
              className={cn(
                'w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent',
                'placeholder:text-[var(--color-text-muted)]'
              )}
            />
          </div>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wide">
          Наявність
        </h3>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.onlyAvailable}
            onChange={(e) => onChange({ ...filters, onlyAvailable: e.target.checked })}
            className="w-4 h-4 rounded border-[var(--color-border)] accent-[var(--color-accent)] cursor-pointer"
          />
          <span className="text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
            Тільки доступна
          </span>
        </label>
      </div>

      {/* Reset button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleReset}
        className="w-full mt-auto"
      >
        Скинути фільтри
      </Button>
    </div>
  );
}

export function FilterSidebar({ filters, onChange, activeCount = 0, drawerOpen, onDrawerOpenChange }: FilterSidebarProps) {
  const isControlled = drawerOpen !== undefined;
  const [localOpen, setLocalOpen] = useState(false);

  const open = isControlled ? (drawerOpen ?? false) : localOpen;
  const setOpen = (val: boolean) => {
    if (isControlled) {
      onDrawerOpenChange?.(val);
    } else {
      setLocalOpen(val);
    }
  };

  return (
    <>
      {/* Mobile trigger (uncontrolled mode only — controlled mode provides its own trigger) */}
      {!isControlled && (
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              'inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border text-sm font-medium transition-colors',
              activeCount > 0
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5 text-[var(--color-accent)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Фільтри
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-[10px] font-bold leading-none">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative ml-auto w-full max-w-xs bg-[var(--color-surface)] h-full overflow-y-auto shadow-xl animate-fade-in">
            <FilterContent
              filters={filters}
              onChange={onChange}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <FilterContent filters={filters} onChange={onChange} />
        </div>
      </aside>
    </>
  );
}
