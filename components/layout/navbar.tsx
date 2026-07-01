'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

const navLinks = [
  { label: 'Головна', href: '/' },
  { label: 'Про нас', href: '/about' },
  { label: 'Техніка', href: '/catalog' },
  { label: 'Послуги', href: '/#services' },
  { label: 'Переваги', href: '/#why-us' },
  { label: 'Контакти', href: '/contacts' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[var(--color-primary)]/95 backdrop-blur-md shadow-[0_2px_24px_0_rgba(0,0,0,0.45)]'
            : isHome
              ? 'bg-gradient-to-b from-black/50 to-transparent'
              : 'bg-[var(--color-primary)]',
        )}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-[72px] max-sm:h-16">

            {/* Logo */}
            <Logo size="sm" />

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Основна навігація">
              {navLinks.map((link) => {
                const isActive = link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-3 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
                      isActive
                        ? 'text-[var(--color-accent)]'
                        : 'text-slate-300 hover:text-white',
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[var(--color-accent)]"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop right actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/contacts"
                className={cn(
                  'inline-flex items-center gap-2 px-5 h-10 text-xs font-bold uppercase tracking-wider rounded-md text-[var(--color-primary)]',
                  'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] active:scale-[0.98]',
                  'transition-all duration-150 shadow-[0_2px_12px_0_rgba(244,184,21,0.4)]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)]',
                )}
              >
                <Phone size={14} strokeWidth={2.5} aria-hidden="true" />
                Зв&apos;язатись з нами
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className={cn(
                'md:hidden flex items-center justify-center w-11 h-11 rounded-md text-white',
                'hover:bg-white/10 active:bg-white/20 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
              )}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Закрити меню' : 'Відкрити меню'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <nav
        id="mobile-nav"
        aria-label="Мобільна навігація"
        className={cn(
          'fixed top-16 left-0 right-0 z-40 md:hidden',
          'bg-[var(--color-primary)] border-t border-white/10',
          'transition-all duration-300 origin-top',
          mobileOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none',
        )}
      >
        <div className="container-site py-4 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = link.href === '/'
              ? pathname === '/'
              : pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center px-3 py-3 text-sm font-bold uppercase tracking-wider rounded-md transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
                  isActive
                    ? 'text-[var(--color-accent)] bg-white/5'
                    : 'text-slate-300 hover:text-white hover:bg-white/5',
                )}
              >
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] mr-2.5 shrink-0" aria-hidden="true" />
                )}
                {link.label}
              </Link>
            );
          })}

          <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
            <a
              href="tel:+420733777999"
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-md hover:bg-white/5"
            >
              <Phone size={16} className="text-[var(--color-accent)]" />
              +420 733 777 999
            </a>
            <Link
              href="/contacts"
              className={cn(
                'flex items-center justify-center gap-2 h-12 text-sm font-bold uppercase tracking-wider rounded-md text-[var(--color-primary)] mt-1',
                'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] active:scale-[0.98]',
                'transition-all duration-150 shadow-[0_2px_12px_0_rgba(244,184,21,0.4)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)]',
              )}
            >
              <Phone size={16} strokeWidth={2.5} aria-hidden="true" />
              Зв&apos;язатись з нами
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
