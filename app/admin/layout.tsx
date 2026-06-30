'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home } from 'lucide-react';
import { AuthProvider } from '@/components/providers/auth-provider';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { useAuth } from '@/lib/hooks/use-auth';
import { Spinner } from '@/components/ui/spinner';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

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
              className="h-10 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors"
            >
              <Home size={16} />
              На головну
            </Link>
            {!user && (
              <Link
                href="/login"
                className="text-sm text-[var(--color-accent)] hover:underline"
              >
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

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-60 z-50 lg:hidden transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 bg-[var(--color-primary)] text-white flex items-center gap-3 px-4 h-14 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Відкрити меню"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-semibold text-sm">Baggertrans Адмін</span>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
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
