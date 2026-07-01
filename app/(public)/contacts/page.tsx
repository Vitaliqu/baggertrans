import type { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContactFormInline } from '@/components/contacts/contact-form-inline';

export const metadata: Metadata = {
  title: 'Контакти — Baggertrans',
  description:
    "Зв'яжіться з Baggertrans: адреса, телефон, email. Продаж та оренда спецтехніки з Європи в Закарпатській області.",
};

const contactCards = [
  {
    icon: MapPin,
    title: 'Адреса',
    lines: ['Закарпатська область', 'Україна'],
    href: null as string | null,
  },
  {
    icon: Phone,
    title: 'Телефон',
    lines: ['+420 733 777 999', '+420 775 111 555'],
    href: 'tel:+420733777999',
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['info@baggertrans.ua'],
    href: 'mailto:info@baggertrans.ua',
  },
];

const workingHours = [
  { day: "Понеділок — П'ятниця", time: '08:00 — 18:00' },
  { day: 'Субота', time: '09:00 — 15:00' },
  { day: 'Неділя', time: 'Вихідний' },
];

export default function ContactsPage() {
  return (
    <div>
      {/* Header */}
      <section className="gradient-navy section-padding" aria-labelledby="contacts-heading">
        <div className="container-site">
          <div className="max-w-2xl animate-fade-in">
            <span className="inline-block text-[var(--color-orange-300)] text-xs font-semibold uppercase tracking-widest mb-4">
              Зв'язок
            </span>
            <h1
              id="contacts-heading"
              className="text-4xl sm:text-5xl font-black text-white tracking-tight"
            >
              Контакти
            </h1>
            <p className="mt-5 text-slate-300 text-lg leading-relaxed">
              Зв'яжіться з нами будь-яким зручним способом. Ми передзвонимо протягом 15 хвилин у
              робочий час.
            </p>
          </div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="section-padding bg-[var(--color-bg)]" aria-label="Контактна інформація">
        <div className="container-site">
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {contactCards.map(({ icon: Icon, title, lines, href }) => (
              <div
                key={title}
                className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm hover:shadow-md hover:border-[var(--color-border-strong)] transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-[var(--color-accent)]" aria-hidden="true" />
                </div>
                <h2 className="font-bold text-[var(--color-text)] mb-2">{title}</h2>
                {lines.map((line) =>
                  href ? (
                    <a
                      key={line}
                      href={href}
                      className="block text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      {line}
                    </a>
                  ) : (
                    <p key={line} className="text-sm text-[var(--color-text-muted)]">
                      {line}
                    </p>
                  ),
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Working hours + Map */}
            <div className="flex flex-col gap-8">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-[var(--color-accent)]" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--color-text)]">Години роботи</h2>
                </div>

                <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
                  {workingHours.map(({ day, time }, i) => (
                    <div
                      key={day}
                      className={cn(
                        'flex justify-between items-center px-6 py-4',
                        i < workingHours.length - 1 && 'border-b border-[var(--color-border)]',
                      )}
                    >
                      <span className="text-sm font-medium text-[var(--color-text)]">{day}</span>
                      <span
                        className={cn(
                          'text-sm font-semibold',
                          time === 'Вихідний'
                            ? 'text-[var(--color-text-muted)]'
                            : 'text-[var(--color-accent)]',
                        )}
                      >
                        {time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div
                className="rounded-2xl overflow-hidden gradient-navy flex flex-col items-center justify-center py-16 px-8 text-center gap-4"
                aria-label="Карта розташування офісу"
                role="img"
              >
                <div className="w-14 h-14 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center">
                  <MapPin size={26} className="text-[var(--color-accent)]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Знайдіть нас на карті</p>
                  <p className="text-slate-400 text-sm mt-1">Закарпатська область, Україна</p>
                </div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
                >
                  Відкрити в Google Maps
                </a>
              </div>
            </div>

            {/* Contact form */}
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text)] mb-5">Написати нам</h2>
              <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 md:p-8 shadow-sm">
                <ContactFormInline />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
