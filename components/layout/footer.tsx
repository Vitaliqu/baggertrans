import Link from 'next/link';
import { Phone, MapPin, Send } from 'lucide-react';
import { CATEGORY_LABELS } from '@/types';

const equipmentLinks = [
  { label: 'Вся техніка', href: '/catalog' },
  { label: CATEGORY_LABELS.excavators, href: '/catalog?category=excavators' },
  { label: 'Автовишки', href: '/catalog?category=cranes' },
  { label: CATEGORY_LABELS.dump_trucks, href: '/catalog?category=dump_trucks' },
];

const serviceLinks = [
  { label: 'Оренда техніки', href: '/#services' },
  { label: 'Сервіс', href: '/#services' },
  { label: 'Доставка', href: '/#services' },
];

const companyLinks = [
  { label: 'Про нас', href: '/about' },
  { label: 'Наші переваги', href: '/#why-us' },
  { label: 'Відгуки клієнтів', href: '/#why-us' },
];

export function Footer() {
  return (
    <footer
      className="bg-[var(--color-primary)] text-slate-300"
      role="contentinfo"
      aria-label="Нижній колонтитул"
    >
      {/* Main footer content */}
      <div className="container-site py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex flex-col leading-none group mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded" aria-label="Baggertrans — на головну">
              <span className="text-xl font-black tracking-tight text-white">
                BAGGERTRANS
              </span>
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[var(--color-accent)] mt-0.5">
                Спецтехніка з Європи
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-xs">
              Надійний партнер у продажу та оренді спецтехніки з Європи. Чесні ціни та повний сервісний супровід.
            </p>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Компанія
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-slate-400 hover:text-[var(--color-accent)] transition-colors duration-150 focus-visible:outline-none focus-visible:text-[var(--color-accent)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Equipment links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Техніка
            </h3>
            <ul className="space-y-2.5">
              {equipmentLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-slate-400 hover:text-[var(--color-accent)] transition-colors duration-150 focus-visible:outline-none focus-visible:text-[var(--color-accent)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services + Contact */}
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Послуги
              </h3>
              <ul className="space-y-2.5">
                {serviceLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-slate-400 hover:text-[var(--color-accent)] transition-colors duration-150 focus-visible:outline-none focus-visible:text-[var(--color-accent)]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Контакти
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="tel:+420733777999"
                    className="flex items-start gap-2.5 text-sm text-slate-400 hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:text-[var(--color-accent)]"
                  >
                    <Phone size={14} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                    +420 733 777 999
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+420775111555"
                    className="flex items-start gap-2.5 text-sm text-slate-400 hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:text-[var(--color-accent)]"
                  >
                    <Phone size={14} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                    +420 775 111 555
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-400">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                  <span>Закарпатська область</span>
                </li>
                <li>
                  <a
                    href="https://t.me/BAGGERTRANS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2.5 text-sm text-slate-400 hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:text-[var(--color-accent)]"
                  >
                    <Send size={14} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                    @BAGGERTRANS
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2024 BAGGERTRANS. Всі права захищені.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:text-[var(--color-accent)]"
            >
              Конфіденційність
            </Link>
            <Link
              href="/terms"
              className="hover:text-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:text-[var(--color-accent)]"
            >
              Умови оренди
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
