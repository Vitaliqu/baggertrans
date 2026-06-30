import type { Metadata } from 'next';
import Link from 'next/link';
import { Wrench, Home, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 — Сторінку не знайдено | Baggertrans',
};

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* Hero */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}
      >
        {/* Icon + decorative 404 */}
        <div className="relative mb-8 select-none">
          <span
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-[130px] font-black leading-none pointer-events-none whitespace-nowrap"
            aria-hidden="true"
            style={{
              background: 'linear-gradient(135deg, rgba(234,88,12,0.18) 0%, rgba(249,115,22,0.06) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </span>
          <div className="relative z-10 w-24 h-24 rounded-2xl bg-[var(--color-accent)]/20 flex items-center justify-center rotate-6 mx-auto mt-10">
            <Wrench
              size={44}
              className="text-[var(--color-accent)] -rotate-6"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Text */}
        <p className="text-[var(--color-accent)] text-xs font-semibold uppercase tracking-widest mb-4 animate-fade-in">
          Помилка 404
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-5 animate-fade-in delay-100">
          404 — Сторінку не знайдено
        </h1>
        <p className="text-slate-300 text-base sm:text-lg max-w-md mx-auto leading-relaxed mb-3 animate-fade-in delay-200">
          Схоже, ця сторінка поїхала на будівельний майданчик і ще не повернулась.
        </p>
        <p className="text-slate-400 text-sm max-w-sm mx-auto mb-10 animate-fade-in delay-300">
          Перевірте правильність адреси або скористайтесь навігацією нижче, щоб знайти потрібний розділ.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-400">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-[var(--color-accent)] text-white text-sm font-bold hover:bg-[var(--color-accent-hover)] active:scale-[0.98] transition-all shadow-[0_4px_20px_0_rgba(234,88,12,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Home size={16} aria-hidden="true" />
            На головну
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Переглянути каталог
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-[var(--color-navy-950)] border-t border-white/5 py-5 px-4">
        <div className="container-site flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <p>Baggertrans — оренда будівельної техніки по всій Україні</p>
          <nav aria-label="Додаткові посилання" className="flex items-center gap-5">
            <Link
              href="/catalog"
              className="hover:text-[var(--color-accent)] transition-colors"
            >
              Каталог
            </Link>
            <Link
              href="/booking"
              className="hover:text-[var(--color-accent)] transition-colors"
            >
              Бронювання
            </Link>
            <Link
              href="/contacts"
              className="hover:text-[var(--color-accent)] transition-colors"
            >
              Контакти
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
