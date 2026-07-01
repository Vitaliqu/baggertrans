'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Calendar, Clock } from 'lucide-react';
import type { Equipment } from '@/types';

/* ─── Placeholder cards shown when Firestore returns nothing ─── */
interface PlaceholderItem {
  id: string;
  nameUk: string;
  year: string;
  motohours: string;
  image: string;
}

const placeholders: PlaceholderItem[] = [
  {
    id: 'p1',
    nameUk: 'Volvo ECR235',
    year: '2017 р.',
    motohours: '4 500',
    image: 'https://loremflickr.com/640/480/excavator,volvo?lock=101',
  },
  {
    id: 'p2',
    nameUk: 'Mercedes Actros 3345',
    year: '2016 р.',
    motohours: '380 000',
    image: 'https://loremflickr.com/640/480/dumptruck,mercedes?lock=102',
  },
  {
    id: 'p3',
    nameUk: 'Manitou MRT 2540',
    year: '2009 р.',
    motohours: '6 200',
    image: 'https://loremflickr.com/640/480/telehandler,forklift?lock=103',
  },
  {
    id: 'p4',
    nameUk: 'Hitachi ZX33U',
    year: '2018 р.',
    motohours: '2 100',
    image: 'https://loremflickr.com/640/480/miniexcavator?lock=104',
  },
  {
    id: 'p5',
    nameUk: 'BMP8500',
    year: '2019 р.',
    motohours: '1 800',
    image: 'https://loremflickr.com/640/480/roadroller,compactor?lock=105',
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

function EquipmentMeta({ year, motohours }: { year: string; motohours: string }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
        <Calendar size={13} className="shrink-0 text-[var(--color-accent)]" />
        {year}
      </p>
      <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
        <Clock size={13} className="shrink-0 text-[var(--color-accent)]" />
        мотогодини: {motohours}
      </p>
    </div>
  );
}

function DetailsButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="mt-auto inline-flex items-center justify-center h-10 w-full text-xs font-bold uppercase tracking-wider rounded-md bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent-hover)] active:scale-[0.98] transition-all duration-150 shadow-[0_2px_10px_0_rgba(244,184,21,0.3)]"
    >
      Детальніше
    </Link>
  );
}

/* ─── Real equipment card ─── */
function EquipmentItemCard({ item, index }: { item: Equipment; index: number }) {
  const image = item.images?.[0];
  const year = item.specs?.['Рік випуску'] ?? item.specs?.['Рік'] ?? '—';
  const motohours = item.specs?.['Мотогодини'] ?? '—';

  return (
    <motion.article
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={cardVariants}
      className="card-hover group bg-[var(--color-surface)] rounded-xl overflow-hidden border border-[var(--color-border)] shadow-sm flex flex-col"
    >
      <div className="relative h-44 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={item.nameUk || item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-[var(--color-surface-2)] flex items-center justify-center">
            <Truck className="w-12 h-12 text-[var(--color-border-strong)]" />
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-sm font-bold text-[var(--color-text)] leading-snug mb-3 line-clamp-2">
          {item.nameUk || item.name}
        </h3>
        <EquipmentMeta year={year} motohours={motohours} />
        <DetailsButton href={`/catalog/${item.id}`} />
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
      <div className="relative h-44 overflow-hidden">
        <Image
          src={item.image}
          alt={item.nameUk}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-sm font-bold text-[var(--color-text)] leading-snug mb-3 line-clamp-2">
          {item.nameUk}
        </h3>
        <EquipmentMeta year={item.year} motohours={item.motohours} />
        <DetailsButton href="/catalog" />
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
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 md:mb-12"
        >
          <h2
            id="popular-equipment-heading"
            className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--color-text)] border-b-2 border-[var(--color-accent)] pb-2 inline-block w-fit"
          >
            Наша техніка
          </h2>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 h-11 px-5 text-xs font-bold uppercase tracking-wider rounded-md border border-[var(--color-border-strong)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors shrink-0 w-fit"
          >
            Переглянути всю техніку
            <ArrowRight size={15} />
          </Link>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-6">
          {hasRealData
            ? equipment.map((item, i) => (
                <EquipmentItemCard key={item.id} item={item} index={i} />
              ))
            : placeholders.map((item, i) => (
                <PlaceholderCard key={item.id} item={item} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}
