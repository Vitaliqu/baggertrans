'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EquipmentGalleryProps {
  images: string[];
  alt: string;
}

export function EquipmentGallery({ images, alt }: EquipmentGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[16/10] rounded-xl gradient-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-white/40">
          <Truck className="w-20 h-20" />
          <span className="text-sm font-medium">Фото відсутнє</span>
        </div>
      </div>
    );
  }

  function prev() {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }

  function next() {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[var(--color-surface-2,#f1f5f9)] group">
        <Image
          src={images[activeIndex]}
          alt={`${alt} — фото ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover transition-opacity duration-300"
          priority={activeIndex === 0}
        />

        {/* Navigation arrows (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Попереднє фото"
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full',
                'bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center',
                'text-[var(--color-text)] hover:bg-white transition-all duration-150',
                'opacity-0 group-hover:opacity-100'
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Наступне фото"
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full',
                'bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center',
                'text-[var(--color-text)] hover:bg-white transition-all duration-150',
                'opacity-0 group-hover:opacity-100'
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
          role="tablist"
          aria-label="Фото техніки"
        >
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Фото ${i + 1}`}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-150',
                i === activeIndex
                  ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30'
                  : 'border-transparent hover:border-[var(--color-border-strong,#cbd5e1)] opacity-70 hover:opacity-100'
              )}
            >
              <Image
                src={src}
                alt={`${alt} — мініатюра ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
