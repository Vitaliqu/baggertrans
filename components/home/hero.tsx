'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Settings, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import volvo from "../../app/(public)/volvo.jpg"
import {ServicesBand} from "@/components/home/services-band";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex flex-col bg-[var(--color-primary)] overflow-hidden -mt-16 sm:-mt-[72px]"
      style={{ minHeight: '100dvh' }}
      aria-label="Головний банер"
    >
      {/* Full-bleed background photo */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={volvo}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/70 to-[var(--color-primary)]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)] via-transparent to-[var(--color-primary)]/40" />
      </div>

      {/* Content column — grows to fill the space above the services band, never overlaps it */}
      <div className="container-site relative z-10 flex-1 flex items-center pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-28">
        <div className="max-w-[600px]">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1], delay: 0.07 }}
            className="text-[2.25rem] sm:text-5xl lg:text-[3.25rem] font-black uppercase leading-[1.1] tracking-tight mb-5"
          >
            <span className="block text-white">Продаж та оренда</span>
            <span className="block text-[var(--color-accent)]">спецтехніки з Європи</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
            className="text-base sm:text-lg text-slate-300 leading-relaxed mb-10 max-w-md"
          >
            Надійна техніка. Перевірена якість.{' '}
            <br className="hidden sm:block" />
            Працюємо тільки в Закарпатті.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.23 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2.5 h-14 px-7 bg-[var(--color-accent)] text-[var(--color-primary)] font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors shadow-[0_4px_32px_0_rgba(244,184,21,0.4)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)]"
            >
              <Settings size={18} strokeWidth={2.5} aria-hidden="true" />
              Переглянути техніку
            </Link>
            <Link
              href="/#services"
              className="inline-flex items-center justify-center gap-2.5 h-14 px-7 border border-white/20 text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:border-white/40 hover:bg-white/5 transition-colors active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <LayoutGrid size={16} aria-hidden="true" />
              Наші послуги
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Services band — sits inside the hero, anchored to its bottom edge */}
      <div className="relative z-10 pb-6 sm:pb-8 lg:pb-10">
        <ServicesBand />
      </div>
    </section>
  );
}
