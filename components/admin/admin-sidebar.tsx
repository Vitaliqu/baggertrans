'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Truck, CalendarCheck, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from '@/lib/firebase/auth';

const NAV_ITEMS = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard, exact: true },
  { href: '/admin/equipment', label: 'Техніка', icon: Truck, exact: false },
  { href: '/admin/bookings', label: 'Бронювання', icon: CalendarCheck, exact: false },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  return (
    <aside className="flex flex-col h-full bg-[var(--color-primary)] text-white">
      <div className="px-5 py-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5 group" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center shrink-0">
            <Truck size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight group-hover:text-[var(--color-accent)] transition-colors">
              Baggertrans
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">Адмін-панель</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-[var(--color-accent)] text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon size={18} className="shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-500/20 hover:text-red-300 transition-all duration-150"
        >
          <LogOut size={18} className="shrink-0" />
          Вийти
        </button>
      </div>
    </aside>
  );
}
