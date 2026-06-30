# Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full admin panel for the Baggertrans equipment rental site, covering authentication/login, a dashboard, equipment CRUD management, and booking status management.

**Architecture:** All admin routes live under `/app/admin/` with a shared `layout.tsx` that guards against unauthenticated/non-admin users. Components are co-located under `/components/admin/`. Firebase Firestore is the backend for all data; `useAuth()` from the existing hook reads auth state from `AuthContext` (already populated by `AuthProvider` in the public layout — admin layout wraps its own `AuthProvider` for isolation).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4 (CSS vars in globals.css, no config file), Firebase Firestore, react-hook-form v7 + @hookform/resolvers v5 + zod v4, lucide-react, framer-motion, Radix UI (Dialog, Select, DropdownMenu, Tabs).

## Global Constraints

- Next.js 16 App Router; `'use client'` at top of every interactive component
- Tailwind v4: no tailwind.config.ts; all config in `app/globals.css @theme`; use CSS vars as `bg-[var(--color-primary)]` etc.
- CSS vars: `--color-primary: #0f172a`, `--color-accent: #ea580c`, `--color-bg: #f8fafc`, `--color-surface: #ffffff`, `--color-text: #0f172a`, `--color-text-muted: #64748b`, `--color-border: #e2e8f0`, `--color-success: #16a34a`, `--color-destructive: #dc2626`
- `cn` helper at `@/lib/utils`; `formatPrice`, `formatDate` also from `@/lib/utils`
- Types: `Equipment`, `Booking`, `CATEGORY_LABELS`, `BOOKING_STATUS_LABELS`, `BookingStatus`, `EquipmentStatus`, `EquipmentCategory` from `@/types`
- Firebase: `@/lib/firebase/equipment` (getEquipment, getEquipmentById, createEquipment, updateEquipment, deleteEquipment), `@/lib/firebase/bookings` (getBookings, updateBookingStatus), `@/lib/firebase/auth` (signIn, signOut, isAdmin)
- Auth hook: `useAuth()` from `@/lib/hooks/use-auth` — returns `{ user, profile, loading, isAdmin }`
- `AuthProvider` from `@/components/providers/auth-provider` wraps children with AuthContext
- `equipmentSchema` and `EquipmentFormValues` from `@/lib/validations/equipment`
- All UI text in Ukrainian; no emojis; Lucide icons throughout
- Mobile responsive; `'use client'` on all interactive components
- Next.js 16: dynamic route params are `Promise<{id: string}>` — must `await params` in async page components
- Zod v4 is installed (`zod@4.4.3`); import from `'zod'` as usual
- `@hookform/resolvers@5.4.0`: import zodResolver from `'@hookform/resolvers/zod'`
- react-hook-form v7: `useForm`, `Controller`, `useFieldArray`
- Existing UI components: `Button` (`@/components/ui/button`), `Input` (`@/components/ui/input`), `Textarea` (`@/components/ui/textarea`), `Select`/`SelectTrigger`/`SelectContent`/`SelectItem`/`SelectValue` (`@/components/ui/select`), `Badge` (`@/components/ui/badge`), `Card`/`CardHeader`/`CardTitle`/`CardContent` (`@/components/ui/card`), `Dialog`/`DialogContent`/`DialogHeader`/`DialogTitle`/`DialogFooter`/`DialogClose` (`@/components/ui/dialog`)
- `@radix-ui/react-dropdown-menu` and `@radix-ui/react-tabs` are installed but not yet extracted into `/components/ui/` — use Radix primitives directly where needed

---

## File Map

| File | Status | Responsibility |
|------|--------|---------------|
| `app/login/page.tsx` | Create | Email/password login page |
| `app/admin/layout.tsx` | Create | Auth guard + sidebar + mobile nav |
| `app/admin/page.tsx` | Create | Dashboard: analytics cards + recent bookings |
| `app/admin/equipment/page.tsx` | Create | Equipment list with CRUD actions |
| `app/admin/equipment/new/page.tsx` | Create | Redirect wrapper to equipment form for adding new |
| `app/admin/equipment/[id]/edit/page.tsx` | Create | Fetch equipment by id, render form |
| `app/admin/bookings/page.tsx` | Create | Bookings management with filter tabs |
| `components/admin/admin-sidebar.tsx` | Create | Sidebar nav component (desktop fixed + mobile drawer) |
| `components/admin/equipment-form.tsx` | Create | Add/edit equipment form with react-hook-form + zod |
| `components/admin/bookings-table.tsx` | Create | Bookings table with status change actions |
| `components/admin/stat-card.tsx` | Create | Reusable analytics stat card |
| `components/admin/status-badge.tsx` | Create | Booking status badge (new/confirmed/completed/cancelled) |
| `components/admin/equipment-status-badge.tsx` | Create | Equipment status badge (available/rented/maintenance) |
| `components/admin/delete-confirm-dialog.tsx` | Create | Reusable delete confirmation dialog |

---

### Task 1: Login Page

**Files:**
- Create: `app/login/page.tsx`

**Interfaces:**
- Consumes: `signIn` from `@/lib/firebase/auth` — `signIn(email: string, password: string): Promise<UserCredential>`
- Consumes: `useRouter` from `next/navigation`
- Produces: nothing (leaf page)

- [ ] **Step 1: Create the login page file**

```tsx
// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, ArrowLeft } from 'lucide-react';
import { signIn } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      router.push('/admin');
    } catch {
      setError('Неправильний email або пароль. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--color-primary)] mb-4">
            <LogIn size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Вхід до адмін-панелі</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Baggertrans — управління сайтом</p>
        </div>

        {/* Card */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="rounded-md bg-red-50 border border-[var(--color-destructive)]/20 px-4 py-3 text-sm text-[var(--color-destructive)]">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full mt-1">
              Увійти
            </Button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            <ArrowLeft size={14} />
            На головну
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the file was written and imports resolve correctly**

```bash
cd /Users/vitaliipavlyshynets/WebstormProjects/untitled50/baggertrans && npx tsc --noEmit 2>&1 | grep "login" || echo "no login errors"
```

Expected: no TypeScript errors related to `app/login/page.tsx`.

---

### Task 2: Shared Admin Components (stat-card, status-badge, equipment-status-badge, delete-confirm-dialog)

These are small, standalone components used by multiple admin pages. Build them all together since they have no inter-dependencies.

**Files:**
- Create: `components/admin/stat-card.tsx`
- Create: `components/admin/status-badge.tsx`
- Create: `components/admin/equipment-status-badge.tsx`
- Create: `components/admin/delete-confirm-dialog.tsx`

**Interfaces:**
- `StatCard` props: `{ title: string; value: number | string; icon: React.ElementType; color: 'blue' | 'green' | 'orange' | 'navy' }`
- `StatusBadge` props: `{ status: BookingStatus }`
- `EquipmentStatusBadge` props: `{ status: EquipmentStatus }`
- `DeleteConfirmDialog` props: `{ open: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => void; loading?: boolean; title?: string; description?: string }`

- [ ] **Step 1: Create stat-card component**

```tsx
// components/admin/stat-card.tsx
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'orange' | 'navy';
}

const colorMap = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   border: 'border-blue-100' },
  green:  { bg: 'bg-green-50',  icon: 'text-green-600',  border: 'border-green-100' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-100' },
  navy:   { bg: 'bg-slate-50',  icon: 'text-slate-700',  border: 'border-slate-200' },
};

export function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm p-6 flex items-center gap-4">
      <div className={cn('flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border', c.bg, c.border)}>
        <Icon size={22} className={c.icon} />
      </div>
      <div>
        <p className="text-sm text-[var(--color-text-muted)]">{title}</p>
        <p className="text-2xl font-bold text-[var(--color-text)] mt-0.5">{value}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create status-badge component (booking statuses)**

```tsx
// components/admin/status-badge.tsx
import { cn } from '@/lib/utils';
import type { BookingStatus } from '@/types';
import { BOOKING_STATUS_LABELS } from '@/types';

interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

const statusStyles: Record<BookingStatus, string> = {
  new:       'bg-blue-100 text-blue-700 border-blue-200',
  confirmed: 'bg-green-100 text-green-700 border-green-200',
  completed: 'bg-slate-100 text-slate-600 border-slate-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        statusStyles[status],
        className
      )}
    >
      {BOOKING_STATUS_LABELS[status]}
    </span>
  );
}
```

- [ ] **Step 3: Create equipment-status-badge component**

```tsx
// components/admin/equipment-status-badge.tsx
import { cn } from '@/lib/utils';
import type { EquipmentStatus } from '@/types';

interface EquipmentStatusBadgeProps {
  status: EquipmentStatus;
  className?: string;
}

const statusConfig: Record<EquipmentStatus, { label: string; styles: string }> = {
  available:   { label: 'Доступна',       styles: 'bg-green-100 text-green-700 border-green-200' },
  rented:      { label: 'В оренді',       styles: 'bg-orange-100 text-orange-700 border-orange-200' },
  maintenance: { label: 'Обслуговування', styles: 'bg-slate-100 text-slate-600 border-slate-200' },
};

export function EquipmentStatusBadge({ status, className }: EquipmentStatusBadgeProps) {
  const { label, styles } = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        styles,
        className
      )}
    >
      {label}
    </span>
  );
}
```

- [ ] **Step 4: Create delete-confirm-dialog component**

```tsx
// components/admin/delete-confirm-dialog.tsx
'use client';

import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  title = 'Видалити запис?',
  description = 'Цю дію неможливо скасувати. Запис буде видалено назавжди.',
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Trash2 size={18} className="text-[var(--color-destructive)]" />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="pl-[52px]">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <DialogClose asChild>
            <Button variant="outline" size="sm" disabled={loading}>
              Скасувати
            </Button>
          </DialogClose>
          <Button
            variant="primary"
            size="sm"
            loading={loading}
            onClick={onConfirm}
            className="bg-[var(--color-destructive)] hover:bg-red-700"
            style={{ boxShadow: 'none' }}
          >
            Видалити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 5: Verify TypeScript**

```bash
cd /Users/vitaliipavlyshynets/WebstormProjects/untitled50/baggertrans && npx tsc --noEmit 2>&1 | grep "components/admin" || echo "no errors in admin components"
```

Expected: no errors in `components/admin/`.

---

### Task 3: Admin Sidebar Component

**Files:**
- Create: `components/admin/admin-sidebar.tsx`

**Interfaces:**
- Props: `{ mobileOpen: boolean; onMobileClose: () => void }`
- Consumes: `signOut` from `@/lib/firebase/auth`
- Consumes: `usePathname`, `useRouter` from `next/navigation`
- Produces: rendered sidebar used by `app/admin/layout.tsx`

- [ ] **Step 1: Create admin-sidebar component**

```tsx
// components/admin/admin-sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Calendar, LogOut, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/admin',           label: 'Дашборд',    icon: LayoutDashboard },
  { href: '/admin/equipment', label: 'Техніка',    icon: Package },
  { href: '/admin/bookings',  label: 'Бронювання', icon: Calendar },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]/20">
        <div>
          <div className="text-lg font-bold text-white tracking-tight">BAGGERTRANS</div>
          <div className="text-xs text-white/60 font-medium uppercase tracking-widest mt-0.5">Адмін</div>
        </div>
        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Закрити меню"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onMobileClose}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              isActive(href)
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-150"
        >
          <LogOut size={18} />
          Вийти
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[var(--color-primary)] fixed left-0 top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex flex-col w-72 min-h-screen bg-[var(--color-primary)] lg:hidden transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/vitaliipavlyshynets/WebstormProjects/untitled50/baggertrans && npx tsc --noEmit 2>&1 | grep "admin-sidebar" || echo "no errors in admin-sidebar"
```

Expected: no errors.

---

### Task 4: Admin Layout

**Files:**
- Create: `app/admin/layout.tsx`

**Interfaces:**
- Consumes: `useAuth()` from `@/lib/hooks/use-auth` — returns `{ user, profile, loading, isAdmin }`
- Consumes: `AuthProvider` from `@/components/providers/auth-provider`
- Consumes: `AdminSidebar` from `@/components/admin/admin-sidebar`
- Produces: layout wrapper for all `/admin/*` pages

- [ ] **Step 1: Create admin layout**

```tsx
// app/admin/layout.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { AuthProvider } from '@/components/providers/auth-provider';
import { useAuth } from '@/lib/hooks/use-auth';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { loading, isAdmin } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[var(--color-bg)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
          <p className="text-sm text-[var(--color-text-muted)]">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[var(--color-bg)] p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚫</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--color-text)] mb-2">Доступ заборонено</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            У вас немає прав для перегляду цієї сторінки.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover,#c2410c)] transition-colors"
          >
            Перейти до входу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Main content — offset by sidebar width on desktop */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-20 bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
            aria-label="Відкрити меню"
          >
            <Menu size={20} />
          </button>
          <span className="font-bold text-[var(--color-primary)] tracking-tight">BAGGERTRANS</span>
          <span className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-widest">Адмін</span>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/vitaliipavlyshynets/WebstormProjects/untitled50/baggertrans && npx tsc --noEmit 2>&1 | grep "admin/layout" || echo "no errors in admin layout"
```

Expected: no errors.

---

### Task 5: Dashboard Page

**Files:**
- Create: `app/admin/page.tsx`

**Interfaces:**
- Consumes: `getEquipment` from `@/lib/firebase/equipment` — `getEquipment(): Promise<Equipment[]>`
- Consumes: `getBookings` from `@/lib/firebase/bookings` — `getBookings(): Promise<Booking[]>`
- Consumes: `StatCard` from `@/components/admin/stat-card`
- Consumes: `StatusBadge` from `@/components/admin/status-badge`
- Consumes: `formatPrice`, `formatDate` from `@/lib/utils`
- Produces: rendered dashboard page

- [ ] **Step 1: Create the dashboard page**

```tsx
// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Package, CheckCircle, Calendar, TrendingUp } from 'lucide-react';
import { getEquipment } from '@/lib/firebase/equipment';
import { getBookings } from '@/lib/firebase/bookings';
import { StatCard } from '@/components/admin/stat-card';
import { StatusBadge } from '@/components/admin/status-badge';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Equipment, Booking } from '@/types';

export default function AdminDashboardPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [eq, bk] = await Promise.all([getEquipment(), getBookings()]);
        setEquipment(eq);
        setBookings(bk);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const availableCount   = equipment.filter((e) => e.status === 'available').length;
  const rentedCount      = equipment.filter((e) => e.status === 'rented').length;
  const maintenanceCount = equipment.filter((e) => e.status === 'maintenance').length;
  const newBookings      = bookings.filter((b) => b.status === 'new').length;
  const recentBookings   = bookings.slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Дашборд</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-[var(--color-border)] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Дашборд</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Загальний огляд системи</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Всього техніки"    value={equipment.length} icon={Package}     color="blue"   />
        <StatCard title="Доступна техніка"  value={availableCount}   icon={CheckCircle} color="green"  />
        <StatCard title="Нові бронювання"   value={newBookings}      icon={Calendar}    color="orange" />
        <StatCard title="Бронювань всього"  value={bookings.length}  icon={TrendingUp}  color="navy"   />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent bookings */}
        <div className="xl:col-span-2 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm">
          <div className="px-6 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Останні бронювання</h2>
          </div>
          {recentBookings.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-[var(--color-text-muted)]">
              Бронювань поки немає
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {recentBookings.map((b) => (
                <div key={b.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">{b.clientName}</p>
                    <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">{b.equipmentName}</p>
                  </div>
                  <div className="hidden sm:block text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-[var(--color-text)]">{formatPrice(b.totalPrice)}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatDate(b.createdAt)}</p>
                  </div>
                  <StatusBadge status={b.status} className="flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Equipment quick stats */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm">
          <div className="px-6 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Технічний стан</h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-sm text-[var(--color-text-muted)]">Доступна</span>
              </div>
              <span className="text-sm font-semibold text-[var(--color-text)]">{availableCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="text-sm text-[var(--color-text-muted)]">В оренді</span>
              </div>
              <span className="text-sm font-semibold text-[var(--color-text)]">{rentedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="text-sm text-[var(--color-text-muted)]">Обслуговування</span>
              </div>
              <span className="text-sm font-semibold text-[var(--color-text)]">{maintenanceCount}</span>
            </div>
            {equipment.length > 0 && (
              <div className="pt-2">
                <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${(availableCount / equipment.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
                  {Math.round((availableCount / equipment.length) * 100)}% техніки доступно
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/vitaliipavlyshynets/WebstormProjects/untitled50/baggertrans && npx tsc --noEmit 2>&1 | grep "admin/page" || echo "no errors in admin page"
```

Expected: no errors.

---

### Task 6: Equipment Form Component

**Files:**
- Create: `components/admin/equipment-form.tsx`

**Interfaces:**
- Props: `{ equipment?: Equipment; onSuccess: () => void }`
- Consumes: `createEquipment`, `updateEquipment` from `@/lib/firebase/equipment`
- Consumes: `equipmentSchema`, `EquipmentFormValues` from `@/lib/validations/equipment`
- Consumes: `zodResolver` from `@hookform/resolvers/zod`
- Consumes: `useForm`, `useFieldArray`, `Controller` from `react-hook-form`
- Produces: form component embedded in a Dialog on the equipment list page

**Important:** The `equipmentSchema` in `lib/validations/equipment.ts` does NOT include `images` field. The form handles images as local state (`string[]`) and merges them manually before calling create/update.

- [ ] **Step 1: Create equipment form component**

```tsx
// components/admin/equipment-form.tsx
'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Minus, Loader2 } from 'lucide-react';
import { equipmentSchema, type EquipmentFormValues } from '@/lib/validations/equipment';
import { createEquipment, updateEquipment } from '@/lib/firebase/equipment';
import { CATEGORY_LABELS } from '@/types';
import type { Equipment, EquipmentCategory, EquipmentStatus } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface EquipmentFormProps {
  equipment?: Equipment;
  onSuccess: () => void;
}

export function EquipmentForm({ equipment, onSuccess }: EquipmentFormProps) {
  const isEditing = Boolean(equipment);
  const [serverError, setServerError] = useState('');
  const [images, setImages] = useState<string[]>(
    equipment?.images?.length ? equipment.images : ['']
  );

  // Convert specs Record<string, string> to array for useFieldArray
  const defaultSpecs = equipment?.specs
    ? Object.entries(equipment.specs).map(([key, value]) => ({ key, value }))
    : [{ key: '', value: '' }];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name:          equipment?.name          ?? '',
      nameUk:        equipment?.nameUk        ?? '',
      category:      equipment?.category      ?? 'excavators',
      description:   equipment?.description   ?? '',
      status:        equipment?.status        ?? 'available',
      featured:      equipment?.featured      ?? false,
      pricePerDay:   equipment?.pricePerDay   ?? 0,
      pricePerWeek:  equipment?.pricePerWeek  ?? undefined,
      pricePerMonth: equipment?.pricePerMonth ?? undefined,
      specs:         equipment?.specs         ?? {},
    },
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control,
    // @ts-expect-error: useFieldArray is for arrays, but specs is a Record. We manage specs as local array state instead.
    name: 'specs',
  });

  // Manage specs as local state (not through useFieldArray since it's a Record)
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(defaultSpecs);

  function addSpec() {
    setSpecs((prev) => [...prev, { key: '', value: '' }]);
  }
  function removeSpecRow(index: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  }
  function updateSpec(index: number, field: 'key' | 'value', val: string) {
    setSpecs((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: val } : s)));
  }

  function addImage() {
    if (images.length < 5) setImages((prev) => [...prev, '']);
  }
  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }
  function updateImage(index: number, val: string) {
    setImages((prev) => prev.map((img, i) => (i === index ? val : img)));
  }

  async function onSubmit(values: EquipmentFormValues) {
    setServerError('');
    try {
      // Build specs Record from local state
      const specsRecord: Record<string, string> = {};
      for (const s of specs) {
        if (s.key.trim()) specsRecord[s.key.trim()] = s.value.trim();
      }

      const filteredImages = images.filter((img) => img.trim() !== '');

      const payload = {
        ...values,
        specs: specsRecord,
        images: filteredImages,
      };

      if (isEditing && equipment) {
        await updateEquipment(equipment.id, payload);
      } else {
        await createEquipment(payload);
      }
      onSuccess();
    } catch (err) {
      setServerError('Сталася помилка. Спробуйте ще раз.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 overflow-y-auto max-h-[70vh] px-6 pb-6">
      {/* Basic info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Назва (EN)"
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          label="Назва (UK)"
          {...register('nameUk')}
          error={errors.nameUk?.message}
        />
      </div>

      {/* Category + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select value={field.value} onValueChange={(v) => field.onChange(v as EquipmentCategory)}>
              <SelectTrigger label="Категорія" error={errors.category?.message}>
                <SelectValue placeholder="Оберіть категорію" />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(CATEGORY_LABELS) as [EquipmentCategory, string][]).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={(v) => field.onChange(v as EquipmentStatus)}>
              <SelectTrigger label="Статус" error={errors.status?.message}>
                <SelectValue placeholder="Оберіть статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Доступна</SelectItem>
                <SelectItem value="rented">В оренді</SelectItem>
                <SelectItem value="maintenance">Обслуговування</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Description */}
      <Textarea
        label="Опис"
        {...register('description')}
        error={errors.description?.message}
        className="min-h-[80px]"
      />

      {/* Prices */}
      <div>
        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">Ціни (грн)</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="За день *"
            type="number"
            {...register('pricePerDay', { valueAsNumber: true })}
            error={errors.pricePerDay?.message}
          />
          <Input
            label="За тиждень"
            type="number"
            {...register('pricePerWeek', { valueAsNumber: true })}
            error={errors.pricePerWeek?.message}
          />
          <Input
            label="За місяць"
            type="number"
            {...register('pricePerMonth', { valueAsNumber: true })}
            error={errors.pricePerMonth?.message}
          />
        </div>
      </div>

      {/* Featured checkbox */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          {...register('featured')}
          className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-accent)] accent-[var(--color-accent)]"
        />
        <label htmlFor="featured" className="text-sm text-[var(--color-text)]">
          Відображати на головній (Featured)
        </label>
      </div>

      {/* Images */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
            Зображення (URL, до 5)
          </p>
          {images.length < 5 && (
            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover,#c2410c)] font-medium"
            >
              <Plus size={14} /> Додати
            </button>
          )}
        </div>
        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="url"
                value={img}
                onChange={(e) => updateImage(i, e.target.value)}
                placeholder={`URL зображення ${i + 1}`}
                className="flex-1 h-10 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="flex-shrink-0 w-10 h-10 rounded-md border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-destructive)] hover:border-[var(--color-destructive)] transition-colors"
                >
                  <Minus size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Specs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
            Характеристики
          </p>
          <button
            type="button"
            onClick={addSpec}
            className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover,#c2410c)] font-medium"
          >
            <Plus size={14} /> Додати
          </button>
        </div>
        <div className="space-y-2">
          {specs.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={spec.key}
                onChange={(e) => updateSpec(i, 'key', e.target.value)}
                placeholder="Назва"
                className="w-2/5 h-10 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => updateSpec(i, 'value', e.target.value)}
                placeholder="Значення"
                className="flex-1 h-10 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
              {specs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSpecRow(i)}
                  className="flex-shrink-0 w-10 h-10 rounded-md border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-destructive)] hover:border-[var(--color-destructive)] transition-colors"
                >
                  <Minus size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {serverError && (
        <div className="rounded-md bg-red-50 border border-[var(--color-destructive)]/20 px-4 py-3 text-sm text-[var(--color-destructive)]">
          {serverError}
        </div>
      )}

      <Button type="submit" loading={isSubmitting} className="w-full">
        {isEditing ? 'Зберегти зміни' : 'Додати техніку'}
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: Fix the useFieldArray usage (remove unused specFields / appendSpec / removeSpec)**

The form uses local `specs` state instead of `useFieldArray` (since `specs` is a `Record`, not an array). Remove the dead `useFieldArray` call. Here is the corrected import block (remove `useFieldArray`):

```tsx
import { useForm, Controller } from 'react-hook-form';
```

And remove these lines entirely from the component body:

```tsx
const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
  control,
  // @ts-expect-error: useFieldArray is for arrays, but specs is a Record. We manage specs as local array state instead.
  name: 'specs',
});
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd /Users/vitaliipavlyshynets/WebstormProjects/untitled50/baggertrans && npx tsc --noEmit 2>&1 | grep "equipment-form" || echo "no errors in equipment-form"
```

Expected: no errors.

---

### Task 7: Equipment Management Page

**Files:**
- Create: `app/admin/equipment/page.tsx`

**Interfaces:**
- Consumes: `getEquipment`, `deleteEquipment` from `@/lib/firebase/equipment`
- Consumes: `EquipmentForm` from `@/components/admin/equipment-form`
- Consumes: `EquipmentStatusBadge` from `@/components/admin/equipment-status-badge`
- Consumes: `DeleteConfirmDialog` from `@/components/admin/delete-confirm-dialog`
- Consumes: `Dialog`/`DialogContent`/`DialogHeader`/`DialogTitle` from `@/components/ui/dialog`
- Consumes: `CATEGORY_LABELS` from `@/types`
- Produces: full CRUD equipment management page

- [ ] **Step 1: Create the equipment management page**

```tsx
// app/admin/equipment/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { getEquipment, deleteEquipment } from '@/lib/firebase/equipment';
import { EquipmentForm } from '@/components/admin/equipment-form';
import { EquipmentStatusBadge } from '@/components/admin/equipment-status-badge';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { CATEGORY_LABELS } from '@/types';
import type { Equipment, EquipmentCategory, EquipmentStatus } from '@/types';

export default function AdminEquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<EquipmentCategory | ''>('');
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | ''>('');

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Equipment | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadEquipment = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEquipment();
      setEquipment(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  function openAddForm() {
    setEditTarget(undefined);
    setFormOpen(true);
  }

  function openEditForm(eq: Equipment) {
    setEditTarget(eq);
    setFormOpen(true);
  }

  function handleFormSuccess() {
    setFormOpen(false);
    loadEquipment();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteEquipment(deleteTarget.id);
      setDeleteTarget(null);
      loadEquipment();
    } finally {
      setDeleting(false);
    }
  }

  const filtered = equipment.filter((eq) => {
    const matchSearch =
      !search ||
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.nameUk.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || eq.category === categoryFilter;
    const matchStatus = !statusFilter || eq.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Техніка</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {equipment.length} одиниць у базі
          </p>
        </div>
        <Button onClick={openAddForm} className="sm:self-start flex items-center gap-2">
          <Plus size={16} />
          Додати техніку
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пошук за назвою..."
            className="w-full h-10 pl-9 pr-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as EquipmentCategory | '')}
          className="h-10 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        >
          <option value="">Всі категорії</option>
          {(Object.entries(CATEGORY_LABELS) as [EquipmentCategory, string][]).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as EquipmentStatus | '')}
          className="h-10 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        >
          <option value="">Всі статуси</option>
          <option value="available">Доступна</option>
          <option value="rented">В оренді</option>
          <option value="maintenance">Обслуговування</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-[var(--color-border)] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-[var(--color-text-muted)]">
            {search || categoryFilter || statusFilter
              ? 'Нічого не знайдено за фільтром'
              : 'Техніки ще немає. Додайте першу!'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Назва</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide hidden sm:table-cell">Категорія</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Статус</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide hidden md:table-cell">Ціна/день</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide hidden lg:table-cell">Featured</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filtered.map((eq) => (
                  <tr key={eq.id} className="hover:bg-[var(--color-bg)] transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text)]">{eq.nameUk}</p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{eq.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-[var(--color-text-muted)]">
                        {CATEGORY_LABELS[eq.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <EquipmentStatusBadge status={eq.status} />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm font-medium text-[var(--color-text)]">
                        {formatPrice(eq.pricePerDay)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`text-xs font-medium ${eq.featured ? 'text-green-600' : 'text-[var(--color-text-muted)]'}`}>
                        {eq.featured ? 'Так' : 'Ні'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(eq)}
                          className="p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-orange-50 transition-colors"
                          title="Редагувати"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(eq)}
                          className="p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-destructive)] hover:bg-red-50 transition-colors"
                          title="Видалити"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="pt-6">
            <DialogTitle>
              {editTarget ? 'Редагувати техніку' : 'Додати техніку'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <EquipmentForm equipment={editTarget} onSuccess={handleFormSuccess} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onConfirm={handleDelete}
        loading={deleting}
        title={`Видалити "${deleteTarget?.nameUk}"?`}
        description="Цю техніку буде видалено з бази назавжди. Активні бронювання не буде скасовано автоматично."
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/vitaliipavlyshynets/WebstormProjects/untitled50/baggertrans && npx tsc --noEmit 2>&1 | grep "equipment/page" || echo "no errors"
```

Expected: no errors.

---

### Task 8: Equipment Edit Page (dynamic route)

**Files:**
- Create: `app/admin/equipment/[id]/edit/page.tsx`
- Create: `app/admin/equipment/new/page.tsx`

**Interfaces:**
- `EditPage`: `params` is `Promise<{ id: string }>` in Next.js 16 — must `await params`
- Consumes: `getEquipmentById` from `@/lib/firebase/equipment`
- Consumes: `EquipmentForm` from `@/components/admin/equipment-form`
- Produces: full-page edit view (fallback for direct URL access, separate from dialog flow)

- [ ] **Step 1: Create the edit page**

```tsx
// app/admin/equipment/[id]/edit/page.tsx
'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getEquipmentById } from '@/lib/firebase/equipment';
import { EquipmentForm } from '@/components/admin/equipment-form';
import type { Equipment } from '@/types';

interface EditEquipmentPageProps {
  params: Promise<{ id: string }>;
}

export default function EditEquipmentPage({ params }: EditEquipmentPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const eq = await getEquipmentById(id);
      if (!eq) {
        setNotFound(true);
      } else {
        setEquipment(eq);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 w-40 rounded bg-[var(--color-border)]" />
        <div className="h-96 rounded-xl bg-[var(--color-border)]" />
      </div>
    );
  }

  if (notFound || !equipment) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-lg font-semibold text-[var(--color-text)]">Техніку не знайдено</p>
        <Link
          href="/admin/equipment"
          className="inline-flex items-center gap-2 mt-4 text-sm text-[var(--color-accent)] hover:underline"
        >
          <ArrowLeft size={14} /> Повернутись до списку
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/equipment"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-4"
        >
          <ArrowLeft size={14} /> Назад до списку
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Редагувати техніку</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{equipment.nameUk}</p>
      </div>

      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
        <EquipmentForm
          equipment={equipment}
          onSuccess={() => router.push('/admin/equipment')}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the new equipment page (redirect shortcut)**

```tsx
// app/admin/equipment/new/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { EquipmentForm } from '@/components/admin/equipment-form';

export default function NewEquipmentPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/equipment"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-4"
        >
          <ArrowLeft size={14} /> Назад до списку
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Додати техніку</h1>
      </div>

      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
        <EquipmentForm onSuccess={() => router.push('/admin/equipment')} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd /Users/vitaliipavlyshynets/WebstormProjects/untitled50/baggertrans && npx tsc --noEmit 2>&1 | grep "equipment/\[id\]" || echo "no errors in edit page"
```

Expected: no errors.

---

### Task 9: Bookings Table Component

**Files:**
- Create: `components/admin/bookings-table.tsx`

**Interfaces:**
- Props: `{ bookings: Booking[]; onStatusChange: (id: string, status: BookingStatus, comment?: string) => void }`
- Consumes: `StatusBadge` from `@/components/admin/status-badge`
- Consumes: `formatPrice`, `formatDate` from `@/lib/utils`
- Consumes: `@radix-ui/react-dropdown-menu` directly (not extracted to a UI component)

- [ ] **Step 1: Create bookings-table component**

```tsx
// components/admin/bookings-table.tsx
'use client';

import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreVertical, ChevronDown, ChevronUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import { StatusBadge } from '@/components/admin/status-badge';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Booking, BookingStatus } from '@/types';
import { cn } from '@/lib/utils';

interface BookingsTableProps {
  bookings: Booking[];
  onStatusChange: (id: string, status: BookingStatus, comment?: string) => void;
}

function BookingRowExpanded({ booking }: { booking: Booking }) {
  return (
    <div className="px-4 py-4 bg-[var(--color-bg)] border-t border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
      <div>
        <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide font-semibold mb-1">Клієнт</p>
        <p className="font-medium text-[var(--color-text)]">{booking.clientName}</p>
        <p className="text-[var(--color-text-muted)]">{booking.clientPhone}</p>
        <p className="text-[var(--color-text-muted)]">{booking.clientEmail}</p>
        {booking.company && <p className="text-[var(--color-text-muted)]">{booking.company}</p>}
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide font-semibold mb-1">Оренда</p>
        <p className="text-[var(--color-text)]">{formatDate(booking.startDate)} — {formatDate(booking.endDate)}</p>
        <p className="text-[var(--color-text-muted)]">{booking.totalDays} дн.</p>
        {booking.additionalServices.length > 0 && (
          <p className="text-[var(--color-text-muted)] mt-1">+ {booking.additionalServices.join(', ')}</p>
        )}
      </div>
      {(booking.notes || booking.adminComment) && (
        <div>
          {booking.notes && (
            <>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide font-semibold mb-1">Нотатки клієнта</p>
              <p className="text-[var(--color-text-muted)]">{booking.notes}</p>
            </>
          )}
          {booking.adminComment && (
            <>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide font-semibold mb-1 mt-2">Коментар адміна</p>
              <p className="text-[var(--color-text-muted)]">{booking.adminComment}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ActionMenu({
  booking,
  onStatusChange,
}: {
  booking: Booking;
  onStatusChange: BookingsTableProps['onStatusChange'];
}) {
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<BookingStatus | null>(null);

  function handleAction(status: BookingStatus) {
    if (status === 'cancelled') {
      setPendingStatus(status);
      setShowComment(true);
    } else {
      onStatusChange(booking.id, status);
    }
  }

  function confirmWithComment() {
    if (pendingStatus) {
      onStatusChange(booking.id, pendingStatus, comment || undefined);
      setShowComment(false);
      setComment('');
      setPendingStatus(null);
    }
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
            aria-label="Дії"
          >
            <MoreVertical size={16} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="z-50 min-w-[180px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg p-1 animate-in fade-in-0 zoom-in-95"
            align="end"
            sideOffset={4}
          >
            {booking.status !== 'confirmed' && booking.status !== 'completed' && booking.status !== 'cancelled' && (
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm text-green-700 rounded-md cursor-pointer hover:bg-green-50 outline-none"
                onSelect={() => handleAction('confirmed')}
              >
                <CheckCircle size={14} />
                Підтвердити
              </DropdownMenu.Item>
            )}
            {booking.status !== 'completed' && booking.status !== 'cancelled' && (
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 rounded-md cursor-pointer hover:bg-slate-50 outline-none"
                onSelect={() => handleAction('completed')}
              >
                <Clock size={14} />
                Виконано
              </DropdownMenu.Item>
            )}
            {booking.status !== 'cancelled' && (
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-700 rounded-md cursor-pointer hover:bg-red-50 outline-none"
                onSelect={() => handleAction('cancelled')}
              >
                <XCircle size={14} />
                Скасувати
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Comment dialog for cancellation */}
      {showComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-semibold text-[var(--color-text)]">Причина скасування</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Необов'язково..."
              className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setShowComment(false); setComment(''); setPendingStatus(null); }}
                className="px-4 py-2 text-sm rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                Скасувати
              </button>
              <button
                onClick={confirmWithComment}
                className="px-4 py-2 text-sm rounded-md bg-[var(--color-destructive)] text-white hover:bg-red-700 transition-colors"
              >
                Підтвердити
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function BookingsTable({ bookings, onStatusChange }: BookingsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm p-12 text-center text-sm text-[var(--color-text-muted)]">
        Бронювань не знайдено
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Клієнт</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Техніка</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Дати</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Сума</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Статус</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Дії</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <>
                <tr
                  key={b.id}
                  className={cn(
                    'border-b border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer',
                    expandedId === b.id && 'bg-[var(--color-bg)]'
                  )}
                  onClick={() => toggleExpand(b.id)}
                >
                  <td className="px-4 py-3 text-xs font-mono text-[var(--color-text-muted)]">
                    #{b.id.slice(0, 6)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-[var(--color-text)]">{b.clientName}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{b.clientPhone}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text)] max-w-[180px] truncate">
                    {b.equipmentName}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
                    {formatDate(b.startDate)}–{formatDate(b.endDate)}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-[var(--color-text)]">
                    {formatPrice(b.totalPrice)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleExpand(b.id); }}
                        className="p-1.5 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
                      >
                        {expandedId === b.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      <ActionMenu booking={b} onStatusChange={onStatusChange} />
                    </div>
                  </td>
                </tr>
                {expandedId === b.id && (
                  <tr key={`${b.id}-expanded`}>
                    <td colSpan={7} className="p-0">
                      <BookingRowExpanded booking={b} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-[var(--color-border)]">
        {bookings.map((b) => (
          <div key={b.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text)]">{b.clientName}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{b.equipmentName}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <StatusBadge status={b.status} />
                <ActionMenu booking={b} onStatusChange={onStatusChange} />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-text-muted)]">
                {formatDate(b.startDate)} — {formatDate(b.endDate)}
              </span>
              <span className="font-semibold text-[var(--color-text)]">{formatPrice(b.totalPrice)}</span>
            </div>
            <button
              onClick={() => toggleExpand(b.id)}
              className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline"
            >
              {expandedId === b.id ? (
                <><ChevronUp size={12} /> Сховати деталі</>
              ) : (
                <><ChevronDown size={12} /> Деталі</>
              )}
            </button>
            {expandedId === b.id && <BookingRowExpanded booking={b} />}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/vitaliipavlyshynets/WebstormProjects/untitled50/baggertrans && npx tsc --noEmit 2>&1 | grep "bookings-table" || echo "no errors in bookings-table"
```

Expected: no errors.

---

### Task 10: Bookings Management Page

**Files:**
- Create: `app/admin/bookings/page.tsx`

**Interfaces:**
- Consumes: `getBookings`, `updateBookingStatus` from `@/lib/firebase/bookings`
- Consumes: `BookingsTable` from `@/components/admin/bookings-table`
- Consumes: `@radix-ui/react-tabs` directly
- Produces: full bookings management page with status filter tabs

- [ ] **Step 1: Create bookings page**

```tsx
// app/admin/bookings/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Download } from 'lucide-react';
import { getBookings, updateBookingStatus } from '@/lib/firebase/bookings';
import { BookingsTable } from '@/components/admin/bookings-table';
import type { Booking, BookingStatus } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_TABS: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'Всі' },
  { value: 'new',       label: 'Нові' },
  { value: 'confirmed', label: 'Підтверджені' },
  { value: 'completed', label: 'Виконані' },
  { value: 'cancelled', label: 'Скасовані' },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BookingStatus | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  async function handleStatusChange(id: string, status: BookingStatus, comment?: string) {
    await updateBookingStatus(id, status, comment);
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status, adminComment: comment ?? b.adminComment, updatedAt: new Date() }
          : b
      )
    );
  }

  const filtered = bookings.filter((b) => {
    const matchTab = activeTab === 'all' || b.status === activeTab;
    const matchStart = !startDate || b.startDate >= new Date(startDate);
    const matchEnd = !endDate || b.endDate <= new Date(endDate);
    return matchTab && matchStart && matchEnd;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Бронювання</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {bookings.length} бронювань загалом
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text-muted)] transition-colors sm:self-start"
          title="Функція експорту буде доступна незабаром"
          onClick={() => alert('Функція експорту буде доступна незабаром')}
        >
          <Download size={16} />
          Експорт CSV
        </button>
      </div>

      {/* Date range filter */}
      <div className="flex flex-col sm:flex-row gap-3 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm p-4">
        <div className="flex items-center gap-2 flex-1">
          <label className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">Від:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="flex-1 h-9 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>
        <div className="flex items-center gap-2 flex-1">
          <label className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">До:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="flex-1 h-9 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>
        {(startDate || endDate) && (
          <button
            onClick={() => { setStartDate(''); setEndDate(''); }}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-destructive)] transition-colors sm:self-center"
          >
            Очистити
          </button>
        )}
      </div>

      {/* Status tabs */}
      <Tabs.Root value={activeTab} onValueChange={(v) => setActiveTab(v as BookingStatus | 'all')}>
        <Tabs.List className="flex gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1 shadow-sm overflow-x-auto">
          {STATUS_TABS.map((tab) => {
            const count = tab.value === 'all'
              ? bookings.length
              : bookings.filter((b) => b.status === tab.value).length;
            return (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none flex-shrink-0',
                  'data-[state=active]:bg-[var(--color-accent)] data-[state=active]:text-white data-[state=active]:shadow-sm',
                  'data-[state=inactive]:text-[var(--color-text-muted)] data-[state=inactive]:hover:text-[var(--color-text)] data-[state=inactive]:hover:bg-[var(--color-bg)]'
                )}
              >
                {tab.label}
                <span className={cn(
                  'inline-flex items-center justify-center rounded-full text-xs px-1.5 min-w-[20px] h-5 font-semibold',
                  'data-[state=active]:bg-white/20 data-[state=active]:text-white',
                )}>
                  {count}
                </span>
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>

        {STATUS_TABS.map((tab) => (
          <Tabs.Content key={tab.value} value={tab.value} className="mt-4 outline-none">
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-[var(--color-border)] animate-pulse" />
                ))}
              </div>
            ) : (
              <BookingsTable
                bookings={filtered}
                onStatusChange={handleStatusChange}
              />
            )}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/vitaliipavlyshynets/WebstormProjects/untitled50/baggertrans && npx tsc --noEmit 2>&1 | grep "bookings/page" || echo "no errors in bookings page"
```

Expected: no errors.

---

### Task 11: Final TypeScript Check + Build Smoke Test

**Files:** No new files.

- [ ] **Step 1: Run full TypeScript check**

```bash
cd /Users/vitaliipavlyshynets/WebstormProjects/untitled50/baggertrans && npx tsc --noEmit 2>&1
```

Expected: zero errors (or only pre-existing errors unrelated to admin panel files).

- [ ] **Step 2: Run Next.js build to catch any compilation or bundling issues**

```bash
cd /Users/vitaliipavlyshynets/WebstormProjects/untitled50/baggertrans && npm run build 2>&1 | tail -30
```

Expected: build completes successfully with all admin routes listed in the output.

- [ ] **Step 3: Fix any errors found**

If TypeScript or build errors appear in admin panel files, fix them based on the error message before proceeding.

---

## Self-Review Against Spec

### Spec coverage check

| Spec requirement | Task |
|-----------------|------|
| `/app/login/page.tsx` — email/password login, error handling, back link | Task 1 |
| `/app/admin/layout.tsx` — auth guard, sidebar, mobile hamburger | Tasks 3 + 4 |
| `/app/admin/page.tsx` — 4 analytics cards, last 5 bookings, equipment quick stats | Task 5 |
| `/components/admin/equipment-form.tsx` — react-hook-form + zod, all fields, specs, images | Task 6 |
| `/app/admin/equipment/page.tsx` — list, search, filters, edit/delete dialog | Task 7 |
| `/app/admin/equipment/[id]/edit/page.tsx` — await params, fetch, form | Task 8 |
| `/components/admin/bookings-table.tsx` — status badges, actions dropdown, mobile cards, row expand | Task 9 |
| `/app/admin/bookings/page.tsx` — status filter tabs, date range, export hint | Task 10 |
| All text Ukrainian | All tasks |
| CSS vars as `bg-[var(--color-X)]` | All tasks |
| Mobile responsive | Tasks 3, 4, 7, 9, 10 |
| Lucide icons | All tasks |

### Potential issues identified and resolved

1. **`use(params)` vs `await params`**: In Next.js 16 with `'use client'` pages, `params` as a Promise is unwrapped with React's `use()` hook, not `await`. Task 8 uses `use(params)` correctly.

2. **`useFieldArray` with `specs` Record**: The `equipmentSchema` defines `specs` as `z.record(z.string())`, not an array. `useFieldArray` cannot be used with it. Task 6 uses local `useState` for specs management and converts to/from Record on submit. The dead `useFieldArray` call is removed in Step 2 of Task 6.

3. **`AuthProvider` in admin layout**: The root `app/layout.tsx` does NOT wrap children in `AuthProvider` — so `useAuth()` would return defaults (loading=true forever) without wrapping. Task 4 wraps `AdminLayoutInner` in its own `AuthProvider` instance correctly.

4. **Zod v4 + @hookform/resolvers v5**: Both are compatible. `zodResolver` is imported from `'@hookform/resolvers/zod'`. No API changes needed.

5. **`DialogDescription` required by Radix**: The `DialogContent` in `delete-confirm-dialog.tsx` uses `DialogDescription` to satisfy accessibility requirements from Radix UI.
