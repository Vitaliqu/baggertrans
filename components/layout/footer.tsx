import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';
import { CATEGORY_LABELS, type EquipmentCategory } from '@/types';

const catalogCategories: Array<{ category: EquipmentCategory; label: string }> = [
  { category: 'excavators', label: CATEGORY_LABELS.excavators },
  { category: 'dump_trucks', label: CATEGORY_LABELS.dump_trucks },
  { category: 'mini_excavators', label: CATEGORY_LABELS.mini_excavators },
  { category: 'loaders', label: CATEGORY_LABELS.loaders },
  { category: 'telehandlers', label: CATEGORY_LABELS.telehandlers },
  { category: 'bulldozers', label: CATEGORY_LABELS.bulldozers },
];

const companyLinks = [
  { label: 'Про нас', href: '/about' },
  { label: 'Поширені запитання', href: '/faq' },
  { label: 'Умови оренди', href: '/terms' },
  { label: 'Контакти', href: '/contacts' },
];

const socialLinks = [
  { label: 'Facebook', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'YouTube', href: '#' },
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
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex flex-col leading-none group mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded" aria-label="Baggertrans — на головну">
              <span className="text-xl font-black tracking-tight text-white">
                <span className="text-[var(--color-accent)]">B</span>AGGERTRANS
              </span>
              <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-[var(--color-accent)] opacity-75 mt-0.5">
                Оренда техніки
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-xs">
              Надійний партнер у будівництві. Великий парк сучасної техніки, досвідчені оператори та швидка подача на об'єкт.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 text-slate-400 hover:bg-[var(--color-accent)] hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] text-xs font-bold"
                >
                  {label[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Catalog links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Техніка
            </h3>
            <ul className="space-y-2.5">
              {catalogCategories.map(({ category, label }) => (
                <li key={category}>
                  <Link
                    href={`/catalog?category=${category}`}
                    className="text-sm text-slate-400 hover:text-[var(--color-accent)] transition-colors duration-150 focus-visible:outline-none focus-visible:text-[var(--color-accent)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/catalog"
                  className="text-sm text-[var(--color-accent)] hover:text-orange-400 transition-colors duration-150 font-medium focus-visible:outline-none focus-visible:underline"
                >
                  Весь каталог →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Компанія
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map(({ label, href }) => (
                <li key={href}>
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

          {/* Contact column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Контакти
            </h3>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="tel:+380671234567"
                  className="flex items-start gap-2.5 text-sm text-slate-400 hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:text-[var(--color-accent)]"
                >
                  <Phone size={15} className="mt-0.5 shrink-0 text-[var(--color-accent)] group-hover:text-orange-400" />
                  +38 (067) 123-45-67
                </a>
              </li>
              <li>
                <a
                  href="tel:+380501234567"
                  className="flex items-start gap-2.5 text-sm text-slate-400 hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:text-[var(--color-accent)]"
                >
                  <Phone size={15} className="mt-0.5 shrink-0 text-[var(--color-accent)] group-hover:text-orange-400" />
                  +38 (050) 123-45-67
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@baggertrans.ua"
                  className="flex items-start gap-2.5 text-sm text-slate-400 hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:text-[var(--color-accent)]"
                >
                  <Mail size={15} className="mt-0.5 shrink-0 text-[var(--color-accent)] group-hover:text-orange-400" />
                  info@baggertrans.ua
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                <span>м. Київ, вул. Будівельна, 12</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <Clock size={15} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                <div>
                  <p>Пн–Пт: 08:00 – 18:00</p>
                  <p>Сб: 09:00 – 15:00</p>
                  <p>Нд: вихідний</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2024 Baggertrans. Всі права захищені.</p>
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
