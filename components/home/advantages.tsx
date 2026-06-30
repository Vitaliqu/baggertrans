'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Truck, Users, Clock, Wrench, BadgePercent, Headphones, ArrowRight, type LucideIcon } from 'lucide-react';

interface Advantage {
  icon: LucideIcon;
  title: string;
  description: string;
}

const advantages: Advantage[] = [
  {
    icon: Truck,
    title: 'Великий парк техніки',
    description: 'Понад 150 одиниць сучасної будівельної техніки різних класів та призначень для будь-яких задач.',
  },
  {
    icon: Users,
    title: 'Досвідчені оператори',
    description: 'Кваліфіковані машиністи з досвідом понад 5 років. Усі мають відповідні допуски та сертифікати.',
  },
  {
    icon: Clock,
    title: 'Швидка подача',
    description: 'Виїзд техніки на об\'єкт за 2–4 години після підтвердження заявки в межах міста.',
  },
  {
    icon: Wrench,
    title: 'Технічне обслуговування',
    description: 'Уся техніка регулярно проходить огляд. Власна ремонтна служба забезпечує мінімальний простій.',
  },
  {
    icon: BadgePercent,
    title: 'Гнучкі тарифи',
    description: 'Погодинна, денна, тижнева та місячна оренда. Знижки для постійних клієнтів та великих об\'єктів.',
  },
  {
    icon: Headphones,
    title: 'Повний супровід',
    description: 'Персональний менеджер та повне документальне оформлення угоди від заявки до закриття.',
  },
];

export function Advantages() {
  return (
    <section
      className="section-padding bg-[var(--color-surface-2)]"
      aria-labelledby="advantages-heading"
    >
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20 items-start">

          {/* Left: sticky statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="lg:sticky lg:top-28"
          >
            <span className="block w-6 h-px bg-[var(--color-accent)] mb-7" aria-hidden="true" />
            <h2
              id="advantages-heading"
              className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-[var(--color-text)] leading-[1.15] tracking-tight mb-5"
            >
              Чому будівельники обирають Baggertrans
            </h2>
            <p className="text-[var(--color-text-muted)] text-base leading-relaxed mb-8 max-w-sm">
              Понад 10 років ми забезпечуємо будівельні компанії надійною технікою — від точкових ремонтів до масштабних інфраструктурних об&apos;єктів.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors focus-visible:outline-none focus-visible:underline"
            >
              Про компанію
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Right: numbered advantage list */}
          <div className="divide-y divide-[var(--color-border)]">
            {advantages.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.05 }}
                className="flex gap-5 py-6 first:pt-0 last:pb-0"
              >
                <span
                  className="text-[11px] font-mono text-[var(--color-text-muted)]/50 w-6 shrink-0 pt-0.5 tabular-nums select-none"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex gap-4 flex-1 min-w-0">
                  <Icon
                    size={17}
                    className="text-[var(--color-accent)] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-1 text-sm sm:text-base">
                      {title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
