'use client';

import { motion } from 'framer-motion';
import {
  Construction,
  ArrowUpFromLine,
  Truck,
  TruckElectric,
  CircleDot,
  Scissors,
  Tractor,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

interface Direction {
  icon: LucideIcon;
  label: string;
  detail: string;
}

const directions: Direction[] = [
  { icon: Construction, label: 'Екскаватори', detail: 'від 2 до 20 т' },
  { icon: ArrowUpFromLine, label: 'Автовишки', detail: '25 м робоча висота' },
  { icon: Truck, label: 'Самосвали', detail: '' },
  { icon: TruckElectric, label: 'КамАЗи', detail: '' },
  { icon: CircleDot, label: 'Грунтові катки', detail: '' },
  { icon: Scissors, label: 'Ножичні підйомники', detail: '10 м' },
  { icon: Tractor, label: 'Бульдозери', detail: '15 т' },
  { icon: Wrench, label: 'Навісне обладнання', detail: '' },
];

export function Directions() {
  return (
    <section className="section-padding bg-[var(--color-surface-2)]" aria-labelledby="directions-heading">
      <div className="container-site">
        <h2
          id="directions-heading"
          className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--color-text)] text-center mb-12"
        >
          Напрямки техніки
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-4 gap-y-10">
          {directions.map(({ icon: Icon, label, detail }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.05 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-accent-light)]">
                <Icon size={28} strokeWidth={1.75} className="text-[var(--color-accent-hover)]" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text)]">{label}</p>
                {detail && (
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{detail}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
