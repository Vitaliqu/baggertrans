'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Truck, ChevronRight, Calendar } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Equipment } from '@/types';
import { CATEGORY_LABELS } from '@/types';

interface EquipmentCardProps {
  equipment: Equipment;
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
  viewMode?: 'grid' | 'list';
}

function StatusDot({ status }: { status: Equipment['status'] }) {
  if (status === 'available') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
        Доступна
      </span>
    );
  }
  if (status === 'rented') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" aria-hidden="true" />
        Орендовано
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" aria-hidden="true" />
      На обслуговуванні
    </span>
  );
}

export function EquipmentCard({ equipment, onFavoriteToggle, isFavorite = false, viewMode = 'grid' }: EquipmentCardProps) {
  const isUnavailable = equipment.status === 'rented' || equipment.status === 'maintenance';
  const firstImage = equipment.images[0];
  const specEntries = Object.entries(equipment.specs).slice(0, 3);

  /* ─── List mode: horizontal compact card ─── */
  if (viewMode === 'list') {
    return (
      <article className="card-hover relative flex flex-row rounded-xl bg-[var(--color-surface)] shadow-sm border border-[var(--color-border)] overflow-hidden">
        {/* Image */}
        <div className="relative w-28 sm:w-36 shrink-0">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={equipment.nameUk || equipment.name}
              fill
              sizes="(max-width: 640px) 112px, 144px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[var(--color-surface-2)] flex items-center justify-center">
              <Truck className="w-10 h-10 text-[var(--color-border-strong)]" />
            </div>
          )}
          {isUnavailable && (
            <div className="absolute inset-0 bg-[var(--color-primary)]/55" />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-3 sm:p-4 gap-1.5 min-w-0">
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base text-[var(--color-text)] leading-snug line-clamp-2">
                {equipment.nameUk || equipment.name}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                {CATEGORY_LABELS[equipment.category]}
              </p>
            </div>
            {onFavoriteToggle && (
              <button
                type="button"
                aria-label={isFavorite ? 'Видалити з обраних' : 'Додати до обраних'}
                onClick={() => onFavoriteToggle(equipment.id)}
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors',
                  'hover:bg-[var(--color-surface-2)]',
                  isFavorite ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'
                )}
              >
                <Heart className="w-3.5 h-3.5" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>

          <div className="flex-1" />

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-[var(--color-accent)]">
                від {formatPrice(equipment.pricePerDay)}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">/день</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Link href={`/catalog/${equipment.id}`}>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs gap-1 whitespace-nowrap">
                  Детальніше <ChevronRight className="w-3 h-3" />
                </Button>
              </Link>
              {!isUnavailable && (
                <Link href={`/booking?equipment=${equipment.id}`}>
                  <Button variant="primary" size="sm" className="h-8 px-3 text-xs gap-1 whitespace-nowrap">
                    <Calendar className="w-3 h-3" />
                    Бронювати
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  /* ─── Grid mode: vertical card ─── */
  return (
    <article className="card-hover group relative flex flex-col rounded-xl bg-[var(--color-surface)] shadow-sm border border-[var(--color-border)] overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[16/9] sm:aspect-[4/3] overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={equipment.nameUk || equipment.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full bg-[var(--color-surface-2)] flex items-center justify-center">
            <Truck className="w-14 h-14 text-[var(--color-border-strong)]" />
          </div>
        )}

        {/* Unavailable overlay */}
        {isUnavailable && (
          <div className="absolute inset-0 bg-[var(--color-primary)]/55 flex items-center justify-center">
            <span className="text-white text-sm font-semibold px-3 py-1.5 rounded-lg bg-black/30 backdrop-blur-sm">
              {equipment.status === 'rented' ? 'Орендовано' : 'На обслуговуванні'}
            </span>
          </div>
        )}

        {/* Favorite */}
        {onFavoriteToggle && (
          <button
            type="button"
            aria-label={isFavorite ? 'Видалити з обраних' : 'Додати до обраних'}
            onClick={() => onFavoriteToggle(equipment.id)}
            className={cn(
              'absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
              'bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm',
              isFavorite ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'
            )}
          >
            <Heart className="w-3.5 h-3.5" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 gap-2.5">
        {/* Status + name */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-bold text-[var(--color-text)] text-sm sm:text-base leading-snug line-clamp-2 flex-1 min-w-0 pr-1">
            {equipment.nameUk || equipment.name}
          </h3>
          <StatusDot status={equipment.status} />
        </div>

        {/* Category */}
        <p className="text-xs text-[var(--color-text-muted)]">
          {CATEGORY_LABELS[equipment.category]}
        </p>

        {/* Spec pills */}
        {specEntries.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {specEntries.map(([key, value]) => (
              <span
                key={key}
                className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
              >
                {key}: {value}
              </span>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-lg sm:text-xl font-bold text-[var(--color-accent)] tabular-nums">
            від {formatPrice(equipment.pricePerDay)}
          </span>
          <span className="text-sm text-[var(--color-text-muted)]">/день</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/catalog/${equipment.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-1">
              Детальніше
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <Link
            href={isUnavailable ? '#' : `/booking?equipment=${equipment.id}`}
            className="flex-1"
            aria-disabled={isUnavailable}
            tabIndex={isUnavailable ? -1 : undefined}
          >
            <Button variant="primary" size="sm" className="w-full gap-1" disabled={isUnavailable}>
              <Calendar className="w-3.5 h-3.5" />
              Бронювати
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
