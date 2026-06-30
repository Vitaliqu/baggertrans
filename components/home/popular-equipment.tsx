'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Weight } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import type { Equipment, EquipmentCategory } from '@/types';
import { CATEGORY_LABELS } from '@/types';

/* ─── Placeholder cards shown when Firestore returns nothing ─── */
interface PlaceholderItem {
  id: string;
  nameUk: string;
  category: EquipmentCategory;
  keySpec: string;
  pricePerDay: number;
  gradientFrom: string;
  gradientTo: string;
}

const placeholders: PlaceholderItem[] = [
  {
    id: 'p1',
    nameUk: 'Гусеничний екскаватор Komatsu PC210',
    category: 'excavators',
    keySpec: 'Маса: 22 т · Ківш: 1.0 м³',
    pricePerDay: 8500,
    gradientFrom: '#1e293b',
    gradientTo: '#0f2a4a',
  },
  {
    id: 'p2',
    nameUk: 'Самоскид Volvo FM 6×4',
    category: 'dump_trucks',
    keySpec: 'Вантажопідйомність: 20 т · Кузов: 15 м³',
    pricePerDay: 5500,
    gradientFrom: '#1a2e1a',
    gradientTo: '#0f2a20',
  },
  {
    id: 'p3',
    nameUk: 'Телескопічний навантажувач JCB 535-140',
    category: 'telehandlers',
    keySpec: 'Висота підйому: 14 м · Вантажопідйомність: 3.5 т',
    pricePerDay: 6200,
    gradientFrom: '#2a1a0a',
    gradientTo: '#3a2010',
  },
  {
    id: 'p4',
    nameUk: 'Міні-екскаватор Kubota U36',
    category: 'mini_excavators',
    keySpec: 'Маса: 3.6 т · Глибина копання: 3.5 м',
    pricePerDay: 3200,
    gradientFrom: '#1e1a2e',
    gradientTo: '#0f102a',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' as const, delay: i * 0.08 },
  }),
};

/* ─── Real equipment card ─── */
function EquipmentItemCard({ item, index }: { item: Equipment; index: number }) {
  const image = item.images?.[0];
  const specEntries = Object.entries(item.specs ?? {}).slice(0, 2);
  const keySpec = specEntries.map(([k, v]) => `${k}: ${v}`).join(' · ');
  const isUnavailable = item.status === 'rented' || item.status === 'maintenance';

  return (
    <motion.article
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={cardVariants}
      className="card-hover group bg-[var(--color-surface)] rounded-xl overflow-hidden border border-[var(--color-border)] shadow-sm flex flex-col"
    >
      {/* Image area */}
      <div className="relative h-44 overflow-hidden">
        {image ? (
          <>
            <Image
              src={image}
              alt={item.nameUk || item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Bottom gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1e293b] to-[#0f2a4a] flex items-center justify-center">
            <Truck className="w-12 h-12 text-white/20" />
          </div>
        )}

        {/* Category label — top left */}
        <span className="absolute top-3 left-3 text-[10px] font-semibold text-white/80 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded select-none">
          {CATEGORY_LABELS[item.category]}
        </span>

        {/* Unavailable overlay */}
        {isUnavailable && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <span className="text-white text-sm font-semibold px-3 py-1 rounded-lg bg-black/30 backdrop-blur-sm">
              {item.status === 'rented' ? 'Орендовано' : 'На обслуговуванні'}
            </span>
          </div>
        )}

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--color-accent)]" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-sm font-bold text-[var(--color-text)] leading-snug mb-2 line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors duration-150">
          {item.nameUk || item.name}
        </h3>

        {keySpec && (
          <p className="flex items-start gap-1.5 text-xs text-[var(--color-text-muted)] mb-4">
            <Weight size={12} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
            {keySpec}
          </p>
        )}

        <div className="mt-auto">
          <p className="text-xs text-[var(--color-text-muted)] mb-0.5">від</p>
          <p className="text-xl font-black text-[var(--color-text)] leading-none tabular-nums">
            {formatPrice(item.pricePerDay)}
            <span className="text-xs font-medium text-[var(--color-text-muted)] ml-1">/день</span>
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          <Link
            href={`/catalog/${item.id}`}
            className={cn(
              'flex-1 inline-flex items-center justify-center h-9 text-xs font-semibold rounded-md',
              'border-2 border-[var(--color-border)] text-[var(--color-text)] bg-transparent',
              'hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] active:scale-[0.98]',
              'transition-all duration-150',
            )}
          >
            Детальніше
          </Link>
          <Link
            href={isUnavailable ? '#' : `/booking?equipment=${item.id}`}
            aria-disabled={isUnavailable}
            tabIndex={isUnavailable ? -1 : undefined}
            className={cn(
              'flex-1 inline-flex items-center justify-center h-9 text-xs font-semibold rounded-md transition-all duration-150 active:scale-[0.98]',
              isUnavailable
                ? 'bg-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed'
                : 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-[0_2px_10px_0_rgba(234,88,12,0.3)]',
            )}
          >
            Забронювати
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Placeholder card (no Firestore data) ─── */
function PlaceholderCard({ item, index }: { item: PlaceholderItem; index: number }) {
  return (
    <motion.article
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={cardVariants}
      className="card-hover group bg-[var(--color-surface)] rounded-xl overflow-hidden border border-[var(--color-border)] shadow-sm flex flex-col"
    >
      <div
        className="relative h-44 overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${item.gradientFrom} 0%, ${item.gradientTo} 100%)` }}
        role="img"
        aria-label={item.nameUk}
      >
        <span
          className="absolute right-3 bottom-1 text-[88px] font-black leading-none tabular-nums select-none pointer-events-none"
          aria-hidden="true"
          style={{ color: 'rgba(255,255,255,0.05)' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] select-none">
          {CATEGORY_LABELS[item.category]}
        </span>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--color-accent)]/40" />
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-sm font-bold text-[var(--color-text)] leading-snug mb-2 line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors duration-150">
          {item.nameUk}
        </h3>
        <p className="flex items-start gap-1.5 text-xs text-[var(--color-text-muted)] mb-4">
          <Weight size={12} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
          {item.keySpec}
        </p>
        <div className="mt-auto">
          <p className="text-xs text-[var(--color-text-muted)] mb-0.5">від</p>
          <p className="text-xl font-black text-[var(--color-text)] leading-none tabular-nums">
            {formatPrice(item.pricePerDay)}
            <span className="text-xs font-medium text-[var(--color-text-muted)] ml-1">/день</span>
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          <Link
            href="/catalog"
            className={cn(
              'flex-1 inline-flex items-center justify-center h-9 text-xs font-semibold rounded-md',
              'border-2 border-[var(--color-border)] text-[var(--color-text)]',
              'hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] active:scale-[0.98] transition-all duration-150',
            )}
          >
            Детальніше
          </Link>
          <Link
            href="/booking"
            className={cn(
              'flex-1 inline-flex items-center justify-center h-9 text-xs font-semibold rounded-md',
              'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:scale-[0.98]',
              'transition-all duration-150 shadow-[0_2px_10px_0_rgba(234,88,12,0.3)]',
            )}
          >
            Забронювати
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Section ─── */
interface PopularEquipmentProps {
  equipment?: Equipment[];
}

export function PopularEquipment({ equipment = [] }: PopularEquipmentProps) {
  const hasRealData = equipment.length > 0;

  return (
    <section className="section-padding bg-[var(--color-bg)]" aria-labelledby="popular-equipment-heading">
      <div className="container-site">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-12"
        >
          <div>
            <h2
              id="popular-equipment-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)] tracking-tight"
            >
              Популярна техніка
            </h2>
            <p className="mt-2 text-[var(--color-text-muted)] text-base">
              Техніка в наявності — готова до виїзду
            </p>
          </div>
          <Link
            href="/catalog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors shrink-0"
          >
            Весь каталог
            <ArrowRight size={15} />
          </Link>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {hasRealData
            ? equipment.map((item, i) => (
                <EquipmentItemCard key={item.id} item={item} index={i} />
              ))
            : placeholders.map((item, i) => (
                <PlaceholderCard key={item.id} item={item} index={i} />
              ))}
        </div>

        {/* Mobile "view all" CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45 }}
          className="mt-8 flex justify-center sm:hidden"
        >
          <Link
            href="/catalog"
            className={cn(
              'inline-flex items-center gap-2 px-6 h-11 text-sm font-semibold rounded-md',
              'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:scale-[0.98]',
              'transition-all duration-150 shadow-[0_2px_12px_0_rgba(234,88,12,0.35)]',
            )}
          >
            Переглянути весь каталог
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Desktop bottom link */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45 }}
          className="hidden sm:flex mt-10 justify-center"
        >
          <Link
            href="/catalog"
            className={cn(
              'inline-flex items-center gap-2 px-8 h-12 text-sm font-semibold rounded-md',
              'border-2 border-[var(--color-accent)] text-[var(--color-accent)] bg-transparent',
              'hover:bg-[var(--color-accent)] hover:text-white active:scale-[0.98]',
              'transition-all duration-200',
            )}
          >
            Переглянути весь каталог
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
