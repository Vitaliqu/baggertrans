'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '150+', title: 'одиниць техніки', sub: 'у власному парку' },
  { value: '10+', title: 'років досвіду', sub: 'на ринку України' },
  { value: '500+', title: 'проектів', sub: 'успішно завершено' },
  { value: '2–4', title: 'години — виїзд', sub: 'після підтвердження' },
];

export function Testimonials() {
  return (
    <section
      className="bg-[var(--color-primary)] section-padding"
      aria-labelledby="trust-heading"
    >
      <div className="container-site">

        {/* Stats row */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 pb-16 mb-16 border-b border-white/8"
          aria-label="Ключові показники компанії"
        >
          {stats.map(({ value, title, sub }, i) => (
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}
            >
              <div className="text-4xl sm:text-5xl font-black text-[var(--color-accent)] leading-none tabular-nums mb-2">
                {value}
              </div>
              <div className="text-sm font-semibold text-white mb-0.5">{title}</div>
              <div className="text-xs text-slate-500">{sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Featured client quote */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <span
            className="block w-8 h-px bg-[var(--color-accent)] mb-8"
            aria-hidden="true"
          />
          <blockquote
            id="trust-heading"
            className="text-2xl sm:text-3xl lg:text-[2.25rem] font-semibold text-white leading-[1.35] mb-7"
          >
            &ldquo;Замовляли техніку тричі цього сезону — жодного разу не підвели.
            Екскаватор приїхав о 7 ранку, як і домовлялись.&rdquo;
          </blockquote>
          <cite className="not-italic flex items-center gap-3 text-sm text-slate-400">
            <span className="block w-4 h-px bg-slate-600" aria-hidden="true" />
            Олексій В. — майстер дільниці, ТОВ &laquo;БК Граніт&raquo;, Київ
          </cite>
        </motion.div>

      </div>
    </section>
  );
}
