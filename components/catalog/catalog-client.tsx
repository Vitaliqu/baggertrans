'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { LayoutGrid, List, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EquipmentCard } from './equipment-card';
import { FilterSidebar, CatalogFilters, DEFAULT_FILTERS } from './filter-sidebar';
import { SearchBar } from './search-bar';
import type { Equipment } from '@/types';

interface CatalogClientProps {
  initialEquipment: Equipment[];
}

type SortKey = '' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
type ViewMode = 'grid' | 'list';

export function CatalogClient({ initialEquipment }: CatalogClientProps) {
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  function handleFavoriteToggle(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const filtered = useMemo(() => {
    let result = [...initialEquipment];

    if (filters.categories.length > 0) {
      result = result.filter((e) => filters.categories.includes(e.category));
    }
    if (filters.minPrice > 0) {
      result = result.filter((e) => e.pricePerDay >= filters.minPrice);
    }
    if (filters.maxPrice > 0) {
      result = result.filter((e) => e.pricePerDay <= filters.maxPrice);
    }
    if (filters.onlyAvailable) {
      result = result.filter((e) => e.status === 'available');
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (e) =>
          (e.nameUk || e.name).toLowerCase().includes(q) ||
          e.name.toLowerCase().includes(q)
      );
    }

    if (sort === 'price_asc') {
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sort === 'name_asc') {
      result.sort((a, b) =>
        (a.nameUk || a.name).localeCompare(b.nameUk || b.name, 'uk')
      );
    } else if (sort === 'name_desc') {
      result.sort((a, b) =>
        (b.nameUk || b.name).localeCompare(a.nameUk || a.name, 'uk')
      );
    }

    return result;
  }, [initialEquipment, filters, search, sort]);

  const activeFilterCount = useMemo(() => {
    return (
      filters.categories.length +
      (filters.minPrice > 0 ? 1 : 0) +
      (filters.maxPrice > 0 ? 1 : 0) +
      (filters.onlyAvailable ? 1 : 0)
    );
  }, [filters]);

  const viewToggleClasses = (active: boolean) =>
    cn(
      'w-8 h-8 rounded-md flex items-center justify-center transition-colors',
      active
        ? 'bg-[var(--color-accent)] text-[var(--color-primary)]'
        : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
    );

  return (
    <div className="container-site py-8 lg:py-12">
      {/* Breadcrumbs */}
      <nav aria-label="Навігація" className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">
          Головна
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[var(--color-text)] font-medium">Каталог техніки</span>
      </nav>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--color-text)] mb-2">
          Каталог техніки
        </h1>
        <p className="text-[var(--color-text-muted)]">
          {filtered.length > 0
            ? `Знайдено ${filtered.length} одиниць${filtered.length !== initialEquipment.length ? ` з ${initialEquipment.length}` : ''}`
            : 'Нічого не знайдено'}
        </p>
      </div>

      {/* Search + sort (full width) */}
      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          sort={sort}
          onSortChange={(v) => setSort(v as SortKey)}
        />
      </div>

      {/* Mobile control bar: filter trigger + view toggle */}
      <div className="lg:hidden flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className={cn(
            'inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border text-sm font-medium transition-colors',
            activeFilterCount > 0
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5 text-[var(--color-accent)]'
              : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Фільтри
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-[10px] font-bold leading-none">
              {activeFilterCount}
            </span>
          )}
        </button>

        <span className="text-sm text-[var(--color-text-muted)] ml-auto">
          {filtered.length} позицій
        </span>

        <button
          type="button"
          onClick={() => setViewMode('grid')}
          aria-label="Сітка"
          className={viewToggleClasses(viewMode === 'grid')}
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setViewMode('list')}
          aria-label="Список"
          className={viewToggleClasses(viewMode === 'list')}
        >
          <List className="w-4 h-4" />
        </button>
      </div>

      {/* Layout: sidebar + grid */}
      <div className="flex gap-6 items-start">
        {/* Filter sidebar (desktop: aside; mobile: controlled drawer) */}
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          activeCount={activeFilterCount}
          drawerOpen={mobileDrawerOpen}
          onDrawerOpenChange={setMobileDrawerOpen}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Desktop: view mode toggle */}
          <div className="hidden lg:flex items-center justify-end gap-2 mb-4">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Сітка"
              className={viewToggleClasses(viewMode === 'grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="Список"
              className={viewToggleClasses(viewMode === 'list')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[var(--color-surface-2,#f1f5f9)] flex items-center justify-center mb-4">
                <LayoutGrid className="w-7 h-7 text-[var(--color-text-muted)]" />
              </div>
              <p className="text-[var(--color-text)] font-medium text-lg mb-1">Нічого не знайдено</p>
              <p className="text-[var(--color-text-muted)] text-sm mb-4">
                Спробуйте змінити фільтри або пошуковий запит
              </p>
              <button
                type="button"
                onClick={() => { setFilters(DEFAULT_FILTERS); setSearch(''); }}
                className="text-sm text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-accent-hover)] transition-colors"
              >
                Скинути всі фільтри
              </button>
            </div>
          ) : (
            <div
              className={cn(
                'animate-fade-in',
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5'
                  : 'flex flex-col gap-3'
              )}
            >
              {filtered.map((equipment) => (
                <EquipmentCard
                  key={equipment.id}
                  equipment={equipment}
                  viewMode={viewMode}
                  onFavoriteToggle={handleFavoriteToggle}
                  isFavorite={favorites.has(equipment.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
