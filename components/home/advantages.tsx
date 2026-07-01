'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trophy, Truck, Users, MapPin, type LucideIcon } from 'lucide-react';
import volvo2 from "../../app/(public)/volvo2.jpg"
interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
}

const stats: Stat[] = [
  { icon: Trophy, value: '5+', label: 'років досвіду на ринку спецтехніки' },
  { icon: Truck, value: '100+', label: 'одиниць техніки продано та здано в оренду' },
  { icon: Users, value: '100%', label: 'задоволені клієнти індивідуальний підхід' },
  { icon: MapPin, value: '', label: 'Працюємо тільки в Закарпатті' },
];

export function Advantages() {
  return (
    <section
      id="why-us"
      className="relative section-padding bg-[var(--color-primary)] overflow-hidden"
      aria-labelledby="why-us-heading"
    >
      {/* Faint background photo */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={volvo2}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-[var(--color-primary)]/85" />
      </div>

      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-10 lg:gap-16 items-center">

          {/* Left: statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <h2
              id="why-us-heading"
              className="text-2xl sm:text-3xl font-black uppercase leading-tight tracking-tight mb-4"
            >
              <span className="block text-white">Чому обирають</span>
              <span className="block text-[var(--color-accent)]">Baggertrans?</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Ми пропонуємо надійну спецтехніку з Європи за чесними цінами та повним сервісним супроводом.
            </p>
          </motion.div>

          {/* Right: stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}
                className="flex flex-col gap-2.5"
              >
                <Icon size={26} strokeWidth={1.75} className="text-[var(--color-accent)]" aria-hidden="true" />
                {value && (
                  <div className="text-3xl font-black text-white tabular-nums leading-none">{value}</div>
                )}
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-300 leading-snug">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
