import type { Metadata } from 'next';
import { FAQAccordion } from '@/components/faq/faq-accordion';

export const metadata: Metadata = {
  title: 'Часті запитання — Baggertrans',
  description:
    'Відповіді на найпоширеніші запитання про оренду будівельної техніки від Baggertrans.',
};

export default function FAQPage() {
  return (
    <div>
      {/* Header */}
      <section className="gradient-navy section-padding" aria-labelledby="faq-heading">
        <div className="container-site">
          <div className="max-w-2xl animate-fade-in">
            <span className="inline-block text-[var(--color-orange-300)] text-xs font-semibold uppercase tracking-widest mb-4">
              Питання та відповіді
            </span>
            <h1
              id="faq-heading"
              className="text-4xl sm:text-5xl font-black text-white tracking-tight"
            >
              Часті запитання
            </h1>
            <p className="mt-5 text-slate-300 text-lg leading-relaxed">
              Відповіді на найпоширеніші запитання про оренду будівельної техніки.
              Не знайшли відповідь? Зв'яжіться з нами.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ content */}
      <section className="section-padding bg-[var(--color-bg)]" aria-labelledby="faq-list-heading">
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            <h2 id="faq-list-heading" className="sr-only">
              Список питань
            </h2>
            <FAQAccordion />

            {/* Still have questions CTA */}
            <div className="mt-12 text-center p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
              <p className="text-lg font-bold text-[var(--color-text)] mb-2">
                Не знайшли відповідь?
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mb-6">
                Зв'яжіться з нашими менеджерами — вони відповідуть на будь-яке запитання.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/contacts"
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text)] hover:border-[var(--color-border-strong)] transition-colors"
                >
                  Написати нам
                </a>
                <a
                  href="tel:+420733777999"
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-bold hover:bg-[var(--color-accent-hover)] transition-colors shadow-[0_4px_14px_0_rgba(244,184,21,0.3)]"
                >
                  +420 733 777 999
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
