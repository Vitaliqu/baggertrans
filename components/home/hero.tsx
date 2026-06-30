'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/layout/logo';

const proof = [
  { value: '150+', label: 'одиниць техніки' },
  { value: '10 р.', label: 'на ринку' },
  { value: '500+', label: 'проектів' },
];

export function Hero() {
  return (
    <section
      className="relative flex items-center bg-[#080f1d] overflow-hidden"
      style={{ minHeight: 'calc(100dvh - 72px)' }}
      aria-label="Головний банер"
    >
      {/* Right panel: hero photo — desktop only */}
      <div className="absolute inset-y-0 right-0 w-[52%] hidden lg:block" aria-hidden="true">
        <Image
          src="https://loremflickr.com/1600/1000/excavator,construction,machine?lock=77"
          alt=""
          fill
          priority
          sizes="52vw"
          className="object-cover"
        />
        {/* Left-edge fade to merge with content */}
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#080f1d] to-transparent" />
        {/* Bottom scrim */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#080f1d] to-transparent" />
        {/* Top scrim */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#080f1d] to-transparent" />
        {/* Subtle dark overlay */}
        <div className="absolute inset-0 bg-[#080f1d]/20" />
      </div>

      {/* Content column */}
      <div className="container-site relative z-10 py-20 lg:py-28">
        <div className="max-w-[560px]">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="block w-6 h-px bg-[var(--color-accent)]" aria-hidden="true" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--color-accent)] select-none">
              Будівельна техніка · Київ та регіон
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1], delay: 0.07 }}
            className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-black text-white leading-[1.05] tracking-tight mb-5"
          >
            Надійна техніка<br />
            для вашого<br />
            об&apos;єкту
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
            className="text-base sm:text-lg text-slate-400 leading-relaxed mb-10 max-w-md"
          >
            150+ одиниць техніки. Виїзд на об&apos;єкт за 2–4 години.
            <br className="hidden sm:block" />
            Досвідчені оператори з допусками.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.23 }}
            className="flex flex-col sm:flex-row gap-3 mb-12"
          >
            <a
              href="tel:+380671234567"
              className="inline-flex items-center justify-center gap-2.5 h-14 px-7 bg-[var(--color-accent)] text-white font-bold text-[15px] rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors shadow-[0_4px_32px_0_rgba(234,88,12,0.4)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080f1d]"
            >
              <Phone size={18} strokeWidth={2.5} aria-hidden="true" />
              +38 (067) 123-45-67
            </a>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 h-14 px-6 border border-white/15 text-white font-semibold text-sm rounded-lg hover:border-white/35 hover:bg-white/5 transition-colors active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              Переглянути каталог
              <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* Proof strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex items-start gap-8 pt-8 border-t border-white/8"
            aria-label="Ключові показники"
          >
            {proof.map(({ value, label }) => (
              <div key={label}>
                <div className="text-xl font-black text-white tabular-nums leading-none mb-1">{value}</div>
                <div className="text-[11px] text-slate-500 leading-snug">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll line indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </motion.div>
    </section>
  );
}
