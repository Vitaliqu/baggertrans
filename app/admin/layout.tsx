'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Truck, CalendarCheck, LogOut } from 'lucide-react';
import { AuthProvider } from '@/components/providers/auth-provider';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { useAuth } from '@/lib/hooks/use-auth';
import { Spinner } from '@/components/ui/spinner';
import { signOut } from '@/lib/firebase/auth';
import { cn } from '@/lib/utils';

const BOTTOM_NAV = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard, exact: true },
  { href: '/admin/equipment', label: 'Техніка', icon: Truck, exact: false },
  { href: '/admin/bookings', label: 'Бронювання', icon: CalendarCheck, exact: false },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-[var(--color-text-muted)]">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-lg p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-600">!</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--color-text)] mb-2">Доступ заборонено</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            У вас немає прав адміністратора для перегляду цієї сторінки.
          </p>
          <div className="flex flex-col gap-2">
            {user && (
              <button
                onClick={async () => {
                  await signOut();
                  router.push('/login');
                }}
                className="h-10 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
              >
                Вийти
              </button>
            )}
            <Link
              href="/"
              className="h-10 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              На головну
            </Link>
            {!user && (
              <Link href="/login" className="text-sm text-[var(--color-accent)] hover:underline">
                Увійти
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-60 shrink-0 fixed top-0 left-0 bottom-0 z-30">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 bg-[var(--color-primary)] text-white flex items-center justify-between px-4 h-14 shrink-0 border-b border-white/10">
          <span className="font-bold text-sm tracking-wide">
            {BOTTOM_NAV.find((n) => isActive(n.href, n.exact))?.label ?? 'Адмін'}
          </span>
          <button
            onClick={async () => {
              await signOut();
              router.push('/login');
            }}
            className="flex items-center gap-1.5 px-3 h-8 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Вийти"
          >
            <LogOut size={14} />
            Вийти
          </button>
        </header>

        {/* Page content — extra bottom padding for mobile bottom nav */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0 pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-[var(--color-primary)] border-t border-white/10"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Мобільна навігація"
      >
        <div className="flex h-16">
          {BOTTOM_NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-1 transition-colors',
                  active ? 'text-[var(--color-accent)]' : 'text-slate-400 hover:text-white',
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.75} />
                <span className="text-[10px] font-semibold leading-none">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
