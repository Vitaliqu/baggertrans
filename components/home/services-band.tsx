'use client';

import { Handshake, KeyRound, Wrench, Truck, ShieldCheck, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    icon: Handshake,
    title: 'Продаж',
    description: 'Підбір та продаж спецтехніки з Європи',
  },
  {
    icon: KeyRound,
    title: 'Оренда',
    description: 'Широкий вибір техніки в оренду',
  },
  {
    icon: Wrench,
    title: 'Сервіс',
    description: 'Технічне обслуговування та ремонт',
  },
  {
    icon: Truck,
    title: 'Доставка',
    description: 'Доставка техніки по Закарпаттю',
  },
  {
    icon: ShieldCheck,
    title: 'Гарантія',
    description: 'Гарантія на всю техніку',
  },
];

export function ServicesBand() {
  return (
    <section id="services" className="relative" aria-label="Наші послуги">
      <div className="container-site">
        <div className="rounded-2xl bg-[#1c1d20] border border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 max-sm:divide-y max-sm:divide-white/10 overflow-hidden">
          {services.map(({ icon: Icon, title, description }, i) => {
            const isLast = i === services.length - 1;
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.06 }}
                className={cn(
                  'flex flex-col items-center text-center gap-3 px-5 py-7 sm:py-8',
                  'lg:border-l lg:border-white/10 lg:first:border-l-0',
                  isLast && 'sm:col-span-2 lg:col-span-1',
                )}
              >
                <Icon size={30} strokeWidth={1.75} className="text-[var(--color-accent)]" aria-hidden="true" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-white">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[11rem]">{description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
