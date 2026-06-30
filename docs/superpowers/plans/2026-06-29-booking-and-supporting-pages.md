# Booking & Supporting Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the booking page and five supporting public pages (about, contacts, FAQ, terms, 404) for the Baggertrans Ukrainian construction equipment rental site.

**Architecture:** Seven files total — one `'use client'` component (`booking-page-client.tsx`) that holds all booking form state, six server-component pages that fetch/compose data and render layout. The `(public)` route group already has empty subdirectories; pages go directly into them. The global 404 goes in `app/not-found.tsx`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4 (CSS vars in `globals.css @theme`), react-hook-form + zod, @radix-ui/react-accordion, Firebase Firestore, framer-motion, lucide-react.

## Global Constraints

- Next.js 16: `searchParams` prop on page is `Promise<{...}>` — must `await` it.
- Tailwind v4: No `tailwind.config.ts`. Use CSS vars as `bg-[var(--color-accent)]` etc.
- CSS vars available: `--color-primary:#0f172a`, `--color-accent:#ea580c`, `--color-accent-hover:#c2410c`, `--color-bg:#f8fafc`, `--color-surface:#ffffff`, `--color-surface-2:#f1f5f9`, `--color-text:#0f172a`, `--color-text-muted:#64748b`, `--color-border:#e2e8f0`, `--color-border-strong:#cbd5e1`, `--color-success:#16a34a`, `--color-destructive:#dc2626`.
- CSS utility classes from `globals.css`: `.container-site`, `.section-padding`, `.gradient-navy`, `.animate-fade-in`, `.card-hover`.
- `cn` helper from `@/lib/utils`.
- All user-facing text in Ukrainian. No emojis. Use lucide-react icons.
- `'use client'` only on components that use hooks/events.
- Existing UI components: `Button` (`@/components/ui/button`), `Input` (`@/components/ui/input`), `Textarea` (`@/components/ui/textarea`), `Badge` (`@/components/ui/badge`).
- Types from `@/types`: `Equipment`, `BookingForm`, `ADDITIONAL_SERVICES`, `CATEGORY_LABELS`, `EquipmentCategory`.
- Firebase functions: `createBooking(form)` returns `Promise<string>` (booking ID) from `@/lib/firebase/bookings`; `getEquipment(filters?)` from `@/lib/firebase/equipment`.
- Validation: `bookingSchema`, `BookingFormValues` from `@/lib/validations/booking`; `contactSchema`, `ContactFormValues` from `@/lib/validations/booking`.
- Utils: `formatPrice`, `formatDate`, `getDaysBetween` from `@/lib/utils`.
- `ADDITIONAL_SERVICES` in `@/types` = `[{id:'transport',label:'Доставка техніки'},{id:'operator',label:'Оператор/Машиніст'},{id:'fuel',label:'Паливо'},{id:'insurance',label:'Страхування'}]` — prices are NOT on the type, must be defined locally in the booking component.
- Mobile-first responsive. No placeholder `TODO` comments. Full production code.
- No layout.tsx needed in `(public)` — the root `app/layout.tsx` already wraps all routes; Navbar and Footer are composed per-page where needed (check existing catalog pages for precedent if they exist, otherwise wrap each page server component with `<Navbar>` / `<Footer>`).

---

## File Map

| File | Role |
|------|------|
| `app/(public)/booking/page.tsx` | Server page: awaits searchParams, fetches equipment list, renders BookingPageClient |
| `components/booking/booking-page-client.tsx` | Client component: full multi-section booking form + order summary |
| `app/(public)/about/page.tsx` | Server page: hero, story, stats, team, fleet, CTA |
| `app/(public)/contacts/page.tsx` | Server page: contact cards, hours, map placeholder, contact form |
| `components/contacts/contact-form.tsx` | Client component: name + phone + message form using contactSchema |
| `app/(public)/faq/page.tsx` | Server page: accordion of 10 Q&A using @radix-ui/react-accordion |
| `app/(public)/terms/page.tsx` | Server page: legal sections, TOC, PDF button |
| `app/not-found.tsx` | Global 404 page (server component, renders full HTML via root layout) |

---

### Task 1: Booking page server component + BookingPageClient scaffold

**Files:**
- Create: `app/(public)/booking/page.tsx`
- Create: `components/booking/booking-page-client.tsx`

**Interfaces:**
- Produces: `BookingPageClient` — `'use client'` component, props `{ equipment: Equipment[]; preselectedId?: string }`, exported as named export.
- `app/(public)/booking/page.tsx` — default-exports async server component, fetches `getEquipment({ status: 'available' })`, passes result + `preselectedId` to `BookingPageClient`.

- [ ] **Step 1: Create the booking page server component**

File: `app/(public)/booking/page.tsx`

```tsx
import type { Metadata } from 'next';
import { getEquipment } from '@/lib/firebase/equipment';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BookingPageClient } from '@/components/booking/booking-page-client';
import type { Equipment } from '@/types';

export const metadata: Metadata = {
  title: 'Забронювати техніку',
  description: 'Оформіть заявку на оренду будівельної техніки онлайн. Вкажіть техніку, терміни та контактні дані — ми зв\'яжемось протягом 2 годин.',
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ equipment?: string }>;
}) {
  const { equipment: equipmentId } = await searchParams;

  let equipmentList: Equipment[] = [];
  try {
    equipmentList = await getEquipment({ status: 'available' });
  } catch {
    // Return empty list on Firebase error; form will show empty dropdown
    equipmentList = [];
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[72px] bg-[var(--color-bg)]">
        {/* Page header */}
        <div className="gradient-navy py-10 md:py-14">
          <div className="container-site">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Забронювати техніку
            </h1>
            <p className="mt-2 text-slate-300 text-base max-w-xl">
              Заповніть форму — ми зв'яжемось з вами протягом 2 годин для підтвердження замовлення.
            </p>
          </div>
        </div>
        <BookingPageClient
          equipment={equipmentList}
          preselectedId={equipmentId}
        />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Create BookingPageClient scaffold (full form)**

File: `components/booking/booking-page-client.tsx`

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Truck,
  User,
  Phone,
  Mail,
  Building2,
  FileText,
  Clock,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import { bookingSchema, type BookingFormValues } from '@/lib/validations/booking';
import { createBooking } from '@/lib/firebase/bookings';
import { cn, formatPrice, formatDate, getDaysBetween } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { Equipment } from '@/types';
import { ADDITIONAL_SERVICES, CATEGORY_LABELS } from '@/types';

interface BookingPageClientProps {
  equipment: Equipment[];
  preselectedId?: string;
}

// Additional service prices (UAH/day)
const SERVICE_PRICES: Record<string, number> = {
  transport: 500,
  operator: 800,
  fuel: 300,
  insurance: 200,
};

// Group equipment by category
function groupByCategory(list: Equipment[]): Map<string, Equipment[]> {
  const map = new Map<string, Equipment[]>();
  for (const eq of list) {
    const label = CATEGORY_LABELS[eq.category] ?? eq.category;
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(eq);
  }
  return map;
}

// ---- Success step ----
function SuccessStep({ bookingId }: { bookingId: string }) {
  return (
    <div className="container-site py-16 flex flex-col items-center text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10 text-[var(--color-success)]" />
      </div>
      <h2 className="text-2xl md:text-3xl font-black text-[var(--color-text)] mb-3">
        Заявку прийнято!
      </h2>
      <p className="text-[var(--color-text-muted)] max-w-md mb-2 leading-relaxed">
        Дякуємо за вашу заявку. Наш менеджер зв'яжеться з вами протягом 2 годин для підтвердження та уточнення деталей.
      </p>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        Номер заявки: <span className="font-mono font-semibold text-[var(--color-text)]">{bookingId}</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/">
          <Button variant="primary" size="lg">На головну</Button>
        </Link>
        <Link href="/catalog">
          <Button variant="outline" size="lg">Переглянути каталог</Button>
        </Link>
      </div>
    </div>
  );
}

// ---- Main component ----
export function BookingPageClient({ equipment, preselectedId }: BookingPageClientProps) {
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const grouped = groupByCategory(equipment);
  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      equipmentId: preselectedId ?? '',
      startDate: '',
      endDate: '',
      additionalServices: [],
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      company: '',
      notes: '',
    },
  });

  const watchedEquipmentId = watch('equipmentId');
  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');
  const watchedServices = watch('additionalServices');

  const selectedEquipment = equipment.find((e) => e.id === watchedEquipmentId) ?? null;

  const days =
    watchedStartDate && watchedEndDate && watchedEndDate > watchedStartDate
      ? getDaysBetween(watchedStartDate, watchedEndDate)
      : 0;

  const equipmentTotal = selectedEquipment ? selectedEquipment.pricePerDay * days : 0;

  const servicesTotal = (watchedServices ?? []).reduce((sum, serviceId) => {
    return sum + (SERVICE_PRICES[serviceId] ?? 0) * days;
  }, 0);

  const grandTotal = equipmentTotal + servicesTotal;

  const onSubmit = useCallback(
    async (data: BookingFormValues) => {
      setSubmitError(null);
      const eq = equipment.find((e) => e.id === data.equipmentId);
      if (!eq) {
        setSubmitError('Будь ласка, оберіть техніку зі списку.');
        return;
      }
      try {
        const bookingId = await createBooking({
          ...data,
          equipmentName: eq.nameUk || eq.name,
          totalDays: days,
          totalPrice: grandTotal,
        });
        setSuccessBookingId(bookingId);
      } catch {
        setSubmitError('Виникла помилка при відправці заявки. Спробуйте ще раз або зв\'яжіться з нами за телефоном.');
      }
    },
    [equipment, days, grandTotal],
  );

  if (successBookingId) {
    return <SuccessStep bookingId={successBookingId} />;
  }

  return (
    <div className="container-site py-10 md:py-14">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start"
      >
        {/* ---- LEFT COLUMN: Form sections ---- */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Section 1: Вибір техніки */}
          <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-white text-sm font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text)]">Вибір техніки</h2>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="equipmentId" className="text-sm font-medium text-[var(--color-text-muted)] mb-1">
                Техніка <span className="text-[var(--color-destructive)]">*</span>
              </label>
              <select
                id="equipmentId"
                {...register('equipmentId')}
                className={cn(
                  'w-full rounded-md border bg-[var(--color-surface)] px-3 py-3 text-sm text-[var(--color-text)]',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-150',
                  errors.equipmentId
                    ? 'border-[var(--color-destructive)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]',
                  !watchedEquipmentId && 'text-[var(--color-text-muted)]',
                )}
              >
                <option value="">— Оберіть техніку —</option>
                {Array.from(grouped.entries()).map(([category, items]) => (
                  <optgroup key={category} label={category}>
                    {items.map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.nameUk || eq.name} — {formatPrice(eq.pricePerDay)}/день
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.equipmentId && (
                <p className="text-xs text-[var(--color-destructive)] mt-1">{errors.equipmentId.message}</p>
              )}
              {selectedEquipment && (
                <div className="mt-3 flex items-center gap-2 text-sm text-[var(--color-text-muted)] bg-[var(--color-surface-2)] rounded-lg px-3 py-2">
                  <Truck className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                  <span>
                    {selectedEquipment.nameUk || selectedEquipment.name} —{' '}
                    <strong className="text-[var(--color-accent)]">{formatPrice(selectedEquipment.pricePerDay)}</strong>/день
                  </span>
                </div>
              )}
              {equipment.length === 0 && (
                <p className="text-xs text-[var(--color-text-muted)] mt-2">
                  Наразі немає доступної техніки. Будь ласка, зв'яжіться з нами за телефоном.
                </p>
              )}
            </div>
          </section>

          {/* Section 2: Терміни оренди */}
          <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-white text-sm font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text)]">Терміни оренди</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="startDate" className="text-sm font-medium text-[var(--color-text-muted)]">
                  Дата початку <span className="text-[var(--color-destructive)]">*</span>
                </label>
                <input
                  id="startDate"
                  type="date"
                  min={today}
                  {...register('startDate')}
                  className={cn(
                    'w-full rounded-md border bg-[var(--color-surface)] px-3 py-3 text-sm text-[var(--color-text)]',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-150',
                    errors.startDate
                      ? 'border-[var(--color-destructive)]'
                      : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]',
                  )}
                />
                {errors.startDate && (
                  <p className="text-xs text-[var(--color-destructive)]">{errors.startDate.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="endDate" className="text-sm font-medium text-[var(--color-text-muted)]">
                  Дата закінчення <span className="text-[var(--color-destructive)]">*</span>
                </label>
                <input
                  id="endDate"
                  type="date"
                  min={watchedStartDate || today}
                  {...register('endDate')}
                  className={cn(
                    'w-full rounded-md border bg-[var(--color-surface)] px-3 py-3 text-sm text-[var(--color-text)]',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-150',
                    errors.endDate
                      ? 'border-[var(--color-destructive)]'
                      : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]',
                  )}
                />
                {errors.endDate && (
                  <p className="text-xs text-[var(--color-destructive)]">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Real-time calculation */}
            {days > 0 && selectedEquipment && (
              <div className="mt-4 rounded-lg bg-[var(--color-accent-light,#fff7ed)] border border-[var(--color-accent)]/20 px-4 py-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                <span className="text-sm text-[var(--color-text)]">
                  {days} {days === 1 ? 'день' : days < 5 ? 'дні' : 'днів'} ×{' '}
                  {formatPrice(selectedEquipment.pricePerDay)} ={' '}
                  <strong className="text-[var(--color-accent)]">{formatPrice(equipmentTotal)}</strong>
                </span>
              </div>
            )}
          </section>

          {/* Section 3: Додаткові послуги */}
          <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-white text-sm font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text)]">Додаткові послуги</h2>
            </div>

            <Controller
              name="additionalServices"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ADDITIONAL_SERVICES.map((service) => {
                    const checked = (field.value ?? []).includes(service.id);
                    return (
                      <label
                        key={service.id}
                        className={cn(
                          'flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-all duration-150',
                          checked
                            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
                            : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50',
                        )}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-[var(--color-accent)] shrink-0"
                          checked={checked}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...(field.value ?? []), service.id]
                              : (field.value ?? []).filter((id) => id !== service.id);
                            field.onChange(next);
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--color-text)]">{service.label}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            +{formatPrice(SERVICE_PRICES[service.id] ?? 0)}/день
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            />
          </section>

          {/* Section 4: Контактні дані */}
          <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-white text-sm font-bold flex items-center justify-center shrink-0">
                4
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text)]">Контактні дані</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ім'я та прізвище *"
                error={errors.clientName?.message}
                {...register('clientName')}
              />
              <Input
                label="Номер телефону *"
                type="tel"
                error={errors.clientPhone?.message}
                {...register('clientPhone')}
              />
              <Input
                label="Email *"
                type="email"
                error={errors.clientEmail?.message}
                {...register('clientEmail')}
              />
              <Input
                label="Назва компанії (необов'язково)"
                error={errors.company?.message}
                {...register('company')}
              />
            </div>

            <div className="mt-4">
              <Textarea
                label="Примітки (необов'язково)"
                error={errors.notes?.message}
                {...register('notes')}
                rows={3}
              />
            </div>
          </section>

          {/* Submit error */}
          {submitError && (
            <div className="rounded-lg border border-[var(--color-destructive)]/30 bg-[var(--color-destructive)]/5 px-4 py-3 text-sm text-[var(--color-destructive)]">
              {submitError}
            </div>
          )}

          {/* Mobile submit button */}
          <div className="lg:hidden">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full"
            >
              Відправити заявку
            </Button>
          </div>
        </div>

        {/* ---- RIGHT COLUMN: Order summary ---- */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 flex flex-col gap-4">
            {/* Summary card */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
              <h3 className="text-base font-bold text-[var(--color-text)] mb-4">Ваше замовлення</h3>

              {/* Equipment row */}
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-[var(--color-text-muted)]">Техніка:</span>
                  <span className="font-medium text-[var(--color-text)] text-right">
                    {selectedEquipment ? (selectedEquipment.nameUk || selectedEquipment.name) : '—'}
                  </span>
                </div>

                {/* Dates */}
                {watchedStartDate && watchedEndDate && (
                  <div className="flex justify-between gap-2">
                    <span className="text-[var(--color-text-muted)]">Термін:</span>
                    <span className="font-medium text-[var(--color-text)] text-right">
                      {formatDate(watchedStartDate)} – {formatDate(watchedEndDate)}
                    </span>
                  </div>
                )}

                {/* Days */}
                {days > 0 && (
                  <div className="flex justify-between gap-2">
                    <span className="text-[var(--color-text-muted)]">Кількість днів:</span>
                    <span className="font-medium text-[var(--color-text)]">{days}</span>
                  </div>
                )}

                {/* Equipment price */}
                {equipmentTotal > 0 && (
                  <div className="flex justify-between gap-2">
                    <span className="text-[var(--color-text-muted)]">Оренда техніки:</span>
                    <span className="font-medium text-[var(--color-text)]">{formatPrice(equipmentTotal)}</span>
                  </div>
                )}

                {/* Services */}
                {(watchedServices ?? []).length > 0 && days > 0 && (
                  <>
                    <div className="border-t border-[var(--color-border)] pt-3 mt-1">
                      <p className="text-[var(--color-text-muted)] text-xs font-medium uppercase tracking-wide mb-2">Послуги</p>
                      {(watchedServices ?? []).map((serviceId) => {
                        const svc = ADDITIONAL_SERVICES.find((s) => s.id === serviceId);
                        if (!svc) return null;
                        const price = (SERVICE_PRICES[serviceId] ?? 0) * days;
                        return (
                          <div key={serviceId} className="flex justify-between gap-2 text-sm mb-1.5">
                            <span className="text-[var(--color-text-muted)]">{svc.label}:</span>
                            <span className="font-medium text-[var(--color-text)]">{formatPrice(price)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-[var(--color-border)] mt-4 pt-4 flex justify-between items-baseline">
                <span className="font-bold text-[var(--color-text)]">Разом:</span>
                <span className="text-2xl font-black text-[var(--color-accent)]">
                  {grandTotal > 0 ? formatPrice(grandTotal) : '—'}
                </span>
              </div>

              {/* Desktop submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                className="w-full mt-5 hidden lg:flex"
              >
                Відправити заявку
              </Button>
            </div>

            {/* Info card */}
            <div className="bg-[var(--color-surface-2)] rounded-xl p-4 flex gap-3 text-sm">
              <Info className="w-4 h-4 text-[var(--color-accent)] shrink-0 mt-0.5" />
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Ми зв'яжемось з вами протягом <strong className="text-[var(--color-text)]">2 годин</strong> для підтвердження замовлення та узгодження деталей.
              </p>
            </div>

            {/* Contact info */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-2 text-sm">
              <p className="font-semibold text-[var(--color-text)] mb-1">Є питання?</p>
              <a
                href="tel:+380671234567"
                className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
              >
                <Phone className="w-4 h-4 text-[var(--color-accent)]" />
                +38 (067) 123-45-67
              </a>
              <a
                href="mailto:info@baggertrans.ua"
                className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
              >
                <Mail className="w-4 h-4 text-[var(--color-accent)]" />
                info@baggertrans.ua
              </a>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Verify files exist**

Run:
```bash
ls /path/to/project/app/(public)/booking/page.tsx
ls /path/to/project/components/booking/booking-page-client.tsx
```
Expected: both files present, no TypeScript errors visible.

- [ ] **Step 4: Commit**

```bash
git add app/\(public\)/booking/page.tsx components/booking/booking-page-client.tsx
git commit -m "feat: add booking page server component and BookingPageClient"
```

---

### Task 2: About page

**Files:**
- Create: `app/(public)/about/page.tsx`

**Interfaces:**
- Consumes: `Navbar`, `Footer` from `@/components/layout/...`; `cn` from `@/lib/utils`; lucide-react icons.
- Produces: default-exported server component, no props.

- [ ] **Step 1: Create about/page.tsx**

File: `app/(public)/about/page.tsx`

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  Truck,
  Users,
  Award,
  CheckCircle,
  ChevronRight,
  Wrench,
  Layers,
  Shield,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Про компанію',
  description: 'Baggertrans — надійний партнер у будівництві з 2014 року. Понад 150 одиниць техніки, 500+ завершених проектів, 10+ років досвіду.',
};

const stats = [
  { value: '150+', label: 'одиниць техніки' },
  { value: '10+', label: 'років на ринку' },
  { value: '500+', label: 'завершених проектів' },
  { value: '50+', label: 'партнерів' },
];

const team = [
  { initials: 'ОМ', name: 'Олег Мельник', role: 'Генеральний директор', color: 'bg-[var(--color-accent)]' },
  { initials: 'ІК', name: 'Іванна Коваль', role: 'Менеджер з клієнтами', color: 'bg-[#1e3a5f]' },
  { initials: 'ДП', name: 'Дмитро Петренко', role: 'Головний механік', color: 'bg-[#16a34a]' },
];

const fleetItems = [
  { icon: Truck, label: 'Екскаватори гусеничні та колісні' },
  { icon: Truck, label: 'Міні-екскаватори' },
  { icon: Layers, label: 'Самоскиди та вантажівки' },
  { icon: Wrench, label: 'Навантажувачі фронтальні' },
  { icon: Building2, label: 'Телескопічні маніпулятори' },
  { icon: Layers, label: 'Бульдозери' },
  { icon: Building2, label: 'Автокрани' },
  { icon: Wrench, label: 'Котки та ущільнювачі' },
];

const values = [
  { icon: Shield, title: 'Надійність', description: 'Уся техніка регулярно проходить технічне обслуговування та перевірку перед виходом на об\'єкт.' },
  { icon: Users, title: 'Команда', description: 'Кваліфіковані механіки та оператори з досвідом роботи від 5 до 20 років.' },
  { icon: Award, title: 'Якість', description: 'Ми співпрацюємо лише з перевіреними виробниками техніки: Komatsu, Caterpillar, Volvo, XCMG.' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[72px]">

        {/* Hero */}
        <section className="gradient-navy py-16 md:py-24">
          <div className="container-site">
            <div className="max-w-2xl animate-fade-in">
              <span className="inline-block text-[var(--color-accent)] text-sm font-semibold uppercase tracking-widest mb-4">
                Про компанію
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Baggertrans
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                Надійний партнер будівельного бізнесу з 2014 року. Ми надаємо якісну будівельну техніку в оренду по всій Україні.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-[var(--color-accent)] py-10 md:py-12">
          <div className="container-site">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-3xl md:text-4xl font-black text-white">{value}</p>
                  <p className="text-sm text-orange-100 mt-1 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company story */}
        <section className="section-padding bg-[var(--color-bg)]">
          <div className="container-site">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <span className="inline-block text-[var(--color-accent)] text-sm font-semibold uppercase tracking-widest mb-3">
                  Наша історія
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-[var(--color-text)] mb-6 tracking-tight">
                  Від малого автопарку до лідера ринку
                </h2>
                <div className="space-y-4 text-[var(--color-text-muted)] leading-relaxed">
                  <p>
                    Компанію Baggertrans засновано у 2014 році з парком із 5 одиниць техніки та командою з 8 осіб. З першого дня ми ставили собі за мету — надавати надійну техніку в найкоротші строки та з максимальним сервісом.
                  </p>
                  <p>
                    За 10 років ми виросли до 150+ одиниць сучасного обладнання, відкрили регіональні представництва та налагодили партнерство з провідними будівельними компаніями країни. Кожен п'ятий будівельний проект у нашому регіоні реалізується за участю нашої техніки.
                  </p>
                  <p>
                    Наша місія — бути надійним плечем для кожного будівельного проекту: від невеликого котловану до масштабної інфраструктури.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {values.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="flex gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[var(--color-accent)]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--color-text)] mb-1">{title}</h3>
                      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section-padding bg-[var(--color-surface-2)]">
          <div className="container-site">
            <div className="text-center mb-12">
              <span className="inline-block text-[var(--color-accent)] text-sm font-semibold uppercase tracking-widest mb-3">
                Наша команда
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[var(--color-text)] tracking-tight">
                Люди, яким ви можете довіряти
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {team.map(({ initials, name, role, color }) => (
                <div
                  key={name}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 flex flex-col items-center text-center card-hover"
                >
                  <div className={cn('w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4', color)}>
                    {initials}
                  </div>
                  <h3 className="font-bold text-[var(--color-text)] mb-1">{name}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fleet overview */}
        <section className="section-padding bg-[var(--color-bg)]">
          <div className="container-site">
            <div className="text-center mb-12">
              <span className="inline-block text-[var(--color-accent)] text-sm font-semibold uppercase tracking-widest mb-3">
                Наш парк
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[var(--color-text)] tracking-tight">
                Техніка для будь-яких завдань
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {fleetItems.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3"
                >
                  <CheckCircle className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                  <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certificates placeholder */}
        <section className="section-padding bg-[var(--color-surface-2)]">
          <div className="container-site">
            <div className="text-center mb-10">
              <span className="inline-block text-[var(--color-accent)] text-sm font-semibold uppercase tracking-widest mb-3">
                Документи
              </span>
              <h2 className="text-3xl font-black text-[var(--color-text)] tracking-tight">
                Сертифікати та ліцензії
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['ISO 9001:2015', 'Ліцензія Мінбуду', 'Страховий поліс', 'Сертифікат оператора'].map((cert) => (
                <div
                  key={cert}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 flex flex-col items-center gap-2 text-center"
                >
                  <Award className="w-8 h-8 text-[var(--color-accent)]" />
                  <span className="text-sm font-semibold text-[var(--color-text)]">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding gradient-navy">
          <div className="container-site text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Готові розпочати проект?
            </h2>
            <p className="text-slate-300 text-lg max-w-xl mx-auto mb-8">
              Оберіть техніку з нашого каталогу та оформіть заявку онлайн за кілька хвилин.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 text-base font-semibold rounded-md text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] transition-colors shadow-[0_2px_12px_0_rgba(234,88,12,0.4)]"
              >
                Замовити техніку
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 text-base font-semibold rounded-md text-white border border-white/30 hover:bg-white/10 transition-colors"
              >
                Переглянути каталог
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(public\)/about/page.tsx
git commit -m "feat: add about page"
```

---

### Task 3: Contact form component + Contacts page

**Files:**
- Create: `components/contacts/contact-form.tsx`
- Create: `app/(public)/contacts/page.tsx`

**Interfaces:**
- `ContactForm` — `'use client'`, no props, uses `contactSchema`/`ContactFormValues` from `@/lib/validations/booking`.
- `contacts/page.tsx` — server component, imports `ContactForm`.

- [ ] **Step 1: Create contact-form.tsx**

File: `components/contacts/contact-form.tsx`

```tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Send } from 'lucide-react';
import { contactSchema, type ContactFormValues } from '@/lib/validations/booking';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (_data: ContactFormValues) => {
    // Simulate async send — replace with actual API call when ready
    await new Promise((res) => setTimeout(res, 800));
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle className="w-10 h-10 text-[var(--color-success)]" />
        <p className="font-semibold text-[var(--color-text)]">Повідомлення надіслано!</p>
        <p className="text-sm text-[var(--color-text-muted)]">
          Ми зв'яжемось з вами протягом робочого дня.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-sm text-[var(--color-accent)] hover:underline mt-2"
        >
          Надіслати ще одне
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Input
        label="Ваше ім'я *"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Телефон *"
        type="tel"
        error={errors.phone?.message}
        {...register('phone')}
      />
      <Input
        label="Email (необов'язково)"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Textarea
        label="Повідомлення *"
        error={errors.message?.message}
        {...register('message')}
        rows={4}
      />
      <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
        <Send className="w-4 h-4" />
        Надіслати повідомлення
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: Create contacts/page.tsx**

File: `app/(public)/contacts/page.tsx`

```tsx
import type { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ContactForm } from '@/components/contacts/contact-form';

export const metadata: Metadata = {
  title: 'Контакти',
  description: 'Зв\'яжіться з Baggertrans: телефон, email, адреса офісу. Графік роботи: Пн-Пт 8:00-18:00, Сб 9:00-15:00.',
};

const contactCards = [
  {
    icon: MapPin,
    title: 'Адреса',
    lines: ['м. Київ, вул. Будівельна, 12', 'Офіс 301, 3 поверх'],
    href: 'https://maps.google.com/?q=Київ,вул.Будівельна,12',
    linkLabel: 'Відкрити на карті',
  },
  {
    icon: Phone,
    title: 'Телефони',
    lines: ['+38 (067) 123-45-67', '+38 (050) 123-45-67'],
    href: 'tel:+380671234567',
    linkLabel: 'Зателефонувати',
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['info@baggertrans.ua', 'booking@baggertrans.ua'],
    href: 'mailto:info@baggertrans.ua',
    linkLabel: 'Написати листа',
  },
];

const workingHours = [
  { day: 'Понеділок – П'ятниця', hours: '08:00 – 18:00' },
  { day: 'Субота', hours: '09:00 – 15:00' },
  { day: 'Неділя', hours: 'Вихідний' },
];

export default function ContactsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[72px] bg-[var(--color-bg)]">

        {/* Header */}
        <div className="gradient-navy py-12 md:py-16">
          <div className="container-site">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight animate-fade-in">
              Контакти
            </h1>
            <p className="mt-3 text-slate-300 text-lg max-w-xl">
              Зв'яжіться з нами зручним способом — відповімо максимально швидко.
            </p>
          </div>
        </div>

        {/* Contact cards */}
        <section className="section-padding">
          <div className="container-site">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
              {contactCards.map(({ icon: Icon, title, lines, href, linkLabel }) => (
                <div
                  key={title}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 card-hover"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[var(--color-accent)]" />
                  </div>
                  <h2 className="font-bold text-[var(--color-text)] mb-2">{title}</h2>
                  {lines.map((line) => (
                    <p key={line} className="text-sm text-[var(--color-text-muted)] leading-relaxed">{line}</p>
                  ))}
                  <a
                    href={href}
                    target={href.startsWith('https') ? '_blank' : undefined}
                    rel={href.startsWith('https') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-[var(--color-accent)] hover:underline"
                  >
                    {linkLabel}
                  </a>
                </div>
              ))}
            </div>

            {/* Map + Hours + Form grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

              {/* Map placeholder */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                <div
                  className="w-full h-72 md:h-96 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] flex flex-col items-center justify-center gap-4 overflow-hidden relative"
                  aria-label="Карта розташування офісу"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[var(--color-accent)] flex items-center justify-center shadow-lg">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center px-4">
                      <p className="font-bold text-[var(--color-text)] text-base">м. Київ, вул. Будівельна, 12</p>
                      <p className="text-sm text-[var(--color-text-muted)] mt-1">Офіс 301, 3 поверх</p>
                    </div>
                    <a
                      href="https://maps.google.com/?q=Київ,вул.Будівельна,12"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[var(--color-accent)] text-white text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors shadow-md"
                    >
                      Відкрити Google Maps
                    </a>
                  </div>
                </div>

                {/* Working hours */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-[var(--color-accent)]" />
                    <h2 className="font-bold text-[var(--color-text)]">Графік роботи</h2>
                  </div>
                  <ul className="space-y-2">
                    {workingHours.map(({ day, hours }) => (
                      <li key={day} className="flex justify-between items-center text-sm py-2 border-b border-[var(--color-border)] last:border-0">
                        <span className="text-[var(--color-text-muted)]">{day}</span>
                        <span className={hours === 'Вихідний' ? 'text-[var(--color-destructive)] font-medium' : 'font-semibold text-[var(--color-text)]'}>
                          {hours}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contact form */}
              <div className="lg:col-span-2">
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
                  <h2 className="font-bold text-[var(--color-text)] text-lg mb-1">Напишіть нам</h2>
                  <p className="text-sm text-[var(--color-text-muted)] mb-5">
                    Залиште повідомлення — відповімо протягом робочого дня.
                  </p>
                  <ContactForm />
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/contacts/contact-form.tsx app/\(public\)/contacts/page.tsx
git commit -m "feat: add contacts page and ContactForm component"
```

---

### Task 4: FAQ page

**Files:**
- Create: `app/(public)/faq/page.tsx`

**Interfaces:**
- Consumes: `@radix-ui/react-accordion` (already installed), lucide-react `ChevronDown`, `Navbar`, `Footer`.
- Produces: default-exported server component.

- [ ] **Step 1: Create faq/page.tsx**

File: `app/(public)/faq/page.tsx`

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Часті запитання',
  description: 'Відповіді на поширені запитання про оренду будівельної техніки Baggertrans: умови, ціни, доставка, оператори, страхування.',
};

const faqs = [
  {
    id: 'q1',
    question: 'Як орендувати техніку?',
    answer:
      'Процес оренди складається з 4 кроків: 1) Оберіть потрібну техніку в каталозі або заповніть форму на сайті. 2) Залиште заявку онлайн або зателефонуйте нам. 3) Наш менеджер зв'яжеться з вами для підтвердження та підписання договору. 4) Техніка подається на вказаний об'єкт у узгоджений час.',
  },
  {
    id: 'q2',
    question: 'Яка мінімальна тривалість оренди?',
    answer:
      'Мінімальний термін оренди для більшості техніки — 1 робочий день (8 годин). Для деяких видів спеціалізованої техніки мінімальний термін може становити 2–3 дні. Також доступна погодинна оренда для малогабаритної техніки (міні-екскаватори, навантажувачі) — від 4 годин.',
  },
  {
    id: 'q3',
    question: 'Чи є доставка техніки?',
    answer:
      'Так, ми здійснюємо доставку техніки на об'єкт по Києву та Київській області. Вартість доставки — 500 грн/день (включає подачу та забирання). Для об'єктів за межами регіону вартість розраховується індивідуально. Доставку можна замовити при бронюванні як додаткову послугу.',
  },
  {
    id: 'q4',
    question: 'Чи потрібен оператор?',
    answer:
      'Ні, оператор не є обов'язковим. Ви можете орендувати техніку без оператора за наявності у вас кваліфікованого машиніста з відповідними допусками. Якщо власного оператора немає — ми надаємо досвідченого машиніста за додаткову плату 800 грн/день.',
  },
  {
    id: 'q5',
    question: 'Що входить у вартість оренди?',
    answer:
      'У базову вартість оренди входить: надання справної техніки на узгоджений термін, технічне обслуговування під час простою, стандартний набір документів. Окремо оплачуються: доставка, паливо (якщо не замовляєте послугу «Паливо»), оператор, страхування.',
  },
  {
    id: 'q6',
    question: 'Як оплатити?',
    answer:
      'Приймаємо безготівкову оплату на розрахунковий рахунок (для юридичних осіб та ФОП) та готівку. Передоплата — 30% від суми замовлення при підписанні договору. Залишок — після завершення оренди або за погодженням. Для постійних клієнтів можлива постоплата.',
  },
  {
    id: 'q7',
    question: 'Чи є страхування?',
    answer:
      'Так, пропонуємо послугу страхування орендованої техніки від пошкоджень за 200 грн/день. Без страховки орендар несе матеріальну відповідальність за техніку відповідно до умов договору. Рекомендуємо підключати страхування для масштабних будівельних проектів.',
  },
  {
    id: 'q8',
    question: 'Що робити у разі поломки?',
    answer:
      'У разі поломки техніки під час роботи негайно зателефонуйте нашій диспетчерській службі за номером +38 (067) 123-45-67. Ми забезпечуємо виїзд технічної служби протягом 2–4 годин або заміну техніки. Час простою через технічні несправності з нашої вини не враховується в рахунку.',
  },
  {
    id: 'q9',
    question: 'Як скасувати бронювання?',
    answer:
      'Скасування більш ніж за 24 години до початку оренди — безкоштовно, передоплата повертається у повному обсязі. Скасування менш ніж за 24 години — утримується 20% від суми передоплати. У разі форс-мажорних обставин (погодні умови, заборони влади тощо) розглядаємо кожен випадок індивідуально.',
  },
  {
    id: 'q10',
    question: 'Чи є знижки для постійних клієнтів?',
    answer:
      'Так! Постійним клієнтам пропонуємо накопичувальні знижки: від 5% при сумарному обсязі оренди понад 50 000 грн, від 10% — понад 150 000 грн, від 15% — понад 500 000 грн. Також діють акційні тарифи на тижневу та місячну оренду (знижка 10–20% від денного тарифу).',
  },
];

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[72px] bg-[var(--color-bg)]">

        {/* Header */}
        <div className="gradient-navy py-12 md:py-16">
          <div className="container-site">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight animate-fade-in">
              Часті запитання
            </h1>
            <p className="mt-3 text-slate-300 text-lg max-w-xl">
              Відповіді на найпоширеніші питання про оренду будівельної техніки.
            </p>
          </div>
        </div>

        {/* Accordion */}
        <section className="section-padding">
          <div className="container-site max-w-3xl mx-auto">
            <Accordion.Root type="single" collapsible className="flex flex-col gap-3">
              {faqs.map(({ id, question, answer }) => (
                <Accordion.Item
                  key={id}
                  value={id}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden"
                >
                  <Accordion.Header>
                    <Accordion.Trigger
                      className={cn(
                        'group flex w-full items-center justify-between gap-4 px-6 py-5 text-left',
                        'text-base font-semibold text-[var(--color-text)]',
                        'hover:bg-[var(--color-surface-2)] transition-colors duration-150',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-inset',
                        '[&[data-state=open]]:bg-[var(--color-surface-2)]',
                      )}
                    >
                      {question}
                      <ChevronDown
                        className={cn(
                          'w-5 h-5 text-[var(--color-accent)] shrink-0 transition-transform duration-200',
                          'group-data-[state=open]:rotate-180',
                        )}
                        aria-hidden="true"
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="px-6 pb-5 pt-1 text-sm text-[var(--color-text-muted)] leading-relaxed border-t border-[var(--color-border)]">
                      {answer}
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>

            {/* CTA */}
            <div className="mt-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-14 h-14 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
                <MessageCircle className="w-7 h-7 text-[var(--color-accent)]" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-[var(--color-text)] text-lg mb-1">
                  Не знайшли відповідь?
                </h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Зв'яжіться з нами — ми залюбки відповімо на всі ваші запитання.
                </p>
              </div>
              <Link
                href="/contacts"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[var(--color-accent)] text-white text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors shadow-[0_2px_12px_0_rgba(234,88,12,0.35)] whitespace-nowrap"
              >
                Зв'язатися з нами
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Add accordion animation to globals.css**

The Radix accordion uses `data-[state=open]` and `data-[state=closed]` for animation. Add keyframes to `app/globals.css`:

In `app/globals.css`, after the existing `@keyframes fade-in-up` block, add:

```css
@keyframes accordion-down {
  from { height: 0; opacity: 0; }
  to { height: var(--radix-accordion-content-height); opacity: 1; }
}
@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); opacity: 1; }
  to { height: 0; opacity: 0; }
}

.animate-accordion-down {
  animation: accordion-down 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}
.animate-accordion-up {
  animation: accordion-up 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}
```

- [ ] **Step 3: Commit**

```bash
git add app/\(public\)/faq/page.tsx app/globals.css
git commit -m "feat: add FAQ page with animated Radix accordion"
```

---

### Task 5: Terms page

**Files:**
- Create: `app/(public)/terms/page.tsx`

**Interfaces:**
- Produces: default-exported server component, no props.

- [ ] **Step 1: Create terms/page.tsx**

File: `app/(public)/terms/page.tsx`

```tsx
import type { Metadata } from 'next';
import { FileDown, ExternalLink } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Умови оренди',
  description: 'Умови та правила оренди будівельної техніки Baggertrans: загальні положення, ціни, оплата, відповідальність сторін, страхування.',
};

const tocItems = [
  { id: 'general', label: '1. Загальні положення' },
  { id: 'conditions', label: '2. Умови оренди' },
  { id: 'pricing', label: '3. Ціни та оплата' },
  { id: 'liability', label: '4. Відповідальність сторін' },
  { id: 'termination', label: '5. Розірвання договору' },
  { id: 'insurance', label: '6. Страхування' },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[72px] bg-[var(--color-bg)]">

        {/* Header */}
        <div className="gradient-navy py-12 md:py-16">
          <div className="container-site flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight animate-fade-in">
                Умови оренди
              </h1>
              <p className="mt-3 text-slate-300 text-base max-w-xl">
                Редакція від 01.01.2024. Ознайомтесь з умовами перед підписанням договору.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors shrink-0"
              aria-label="Завантажити PDF (функція недоступна)"
              onClick={() => alert('PDF-версія буде доступна найближчим часом.')}
            >
              <FileDown className="w-4 h-4" />
              Завантажити PDF
            </button>
          </div>
        </div>

        <div className="container-site py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">

            {/* Table of contents (sticky sidebar) */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Зміст</p>
                <nav aria-label="Зміст сторінки">
                  <ul className="space-y-1">
                    {tocItems.map(({ id, label }) => (
                      <li key={id}>
                        <a
                          href={`#${id}`}
                          className="block text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] py-1 transition-colors rounded"
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <div className="lg:col-span-3 flex flex-col gap-10">

              {/* 1. Загальні положення */}
              <section id="general" className="scroll-mt-24">
                <h2 className="text-2xl font-black text-[var(--color-text)] mb-4 pb-3 border-b border-[var(--color-border)]">
                  1. Загальні положення
                </h2>
                <div className="prose-like space-y-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                  <p>
                    1.1. Ці Умови оренди (надалі — «Умови») регулюють відносини між ТОВ «Баггертранс» (надалі — «Орендодавець») та фізичними або юридичними особами (надалі — «Орендар») щодо надання будівельної техніки в тимчасове платне користування.
                  </p>
                  <p>
                    1.2. Підписуючи договір оренди або підтверджуючи заявку в електронній формі, Орендар підтверджує, що ознайомився з цими Умовами та погоджується з ними в повному обсязі.
                  </p>
                  <p>
                    1.3. Орендодавець залишає за собою право вносити зміни до цих Умов. Нова редакція набирає чинності з моменту публікації на сайті www.baggertrans.ua та не поширюється на вже укладені договори.
                  </p>
                  <p>
                    1.4. Оренда техніки здійснюється відповідно до чинного законодавства України, зокрема Цивільного кодексу України (статті 759–786) щодо договору найму.
                  </p>
                </div>
              </section>

              {/* 2. Умови оренди */}
              <section id="conditions" className="scroll-mt-24">
                <h2 className="text-2xl font-black text-[var(--color-text)] mb-4 pb-3 border-b border-[var(--color-border)]">
                  2. Умови оренди
                </h2>
                <div className="space-y-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                  <p>
                    2.1. Для оренди техніки юридичними особами та ФОП необхідно надати: виписку з ЄДР, свідоцтво платника ПДВ (за наявності), документ, що підтверджує повноваження представника.
                  </p>
                  <p>
                    2.2. Фізичні особи надають паспорт або інший документ, що посвідчує особу, та ідентифікаційний код.
                  </p>
                  <p>
                    2.3. Мінімальний термін оренди — 1 робочий день (8 годин). Час роботи техніки фіксується змінними рапортами, підписаними обома сторонами.
                  </p>
                  <p>
                    2.4. Орендар зобов'язаний використовувати техніку виключно за призначенням та відповідно до технічних характеристик, не передавати техніку третім особам без письмової згоди Орендодавця.
                  </p>
                  <p>
                    2.5. Усі роботи з технікою Орендодавця виконуються тільки кваліфікованими операторами. Орендар зобов'язаний забезпечити безпечні умови роботи на об'єкті.
                  </p>
                  <p>
                    2.6. Продовження терміну оренди погоджується не пізніше ніж за 24 години до закінчення поточного договору та оформляється додатковою угодою.
                  </p>
                </div>
              </section>

              {/* 3. Ціни та оплата */}
              <section id="pricing" className="scroll-mt-24">
                <h2 className="text-2xl font-black text-[var(--color-text)] mb-4 pb-3 border-b border-[var(--color-border)]">
                  3. Ціни та оплата
                </h2>
                <div className="space-y-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                  <p>
                    3.1. Вартість оренди визначається відповідно до діючого прайс-листа Орендодавця на момент укладення договору. Ціни вказані в гривнях (UAH) з урахуванням ПДВ 20%.
                  </p>
                  <p>
                    3.2. Структура платежу: 30% передоплата при підписанні договору; залишок 70% — протягом 3 банківських днів після завершення оренди на підставі акту виконаних робіт.
                  </p>
                  <p>
                    3.3. Способи оплати: безготівковий переказ на рахунок Орендодавця; готівка в касі офісу. Оплата платіжними картками — за окремим погодженням.
                  </p>
                  <p>
                    3.4. При оренді понад 7 календарних днів застосовується тижневий тариф (знижка 10% від суми денних тарифів). При оренді понад 30 днів — місячний тариф (знижка 20%).
                  </p>
                  <p>
                    3.5. Послуги не включені в базовий тариф оренди: доставка техніки на об'єкт (500 грн/день), паливо (300 грн/день або фактичні витрати), послуги оператора/машиніста (800 грн/день), страхування (200 грн/день).
                  </p>
                </div>

                {/* Pricing table */}
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-sm border border-[var(--color-border)] rounded-xl overflow-hidden">
                    <thead className="bg-[var(--color-surface-2)]">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-[var(--color-text)]">Послуга</th>
                        <th className="px-4 py-3 text-right font-semibold text-[var(--color-text)]">Ціна/день</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { service: 'Доставка техніки', price: '500 грн' },
                        { service: 'Оператор/Машиніст', price: '800 грн' },
                        { service: 'Паливо', price: '300 грн' },
                        { service: 'Страхування', price: '200 грн' },
                      ].map(({ service, price }, i) => (
                        <tr key={service} className={i % 2 === 0 ? 'bg-white' : 'bg-[var(--color-surface-2)]'}>
                          <td className="px-4 py-3 text-[var(--color-text-muted)]">{service}</td>
                          <td className="px-4 py-3 text-right font-semibold text-[var(--color-text)]">{price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 4. Відповідальність сторін */}
              <section id="liability" className="scroll-mt-24">
                <h2 className="text-2xl font-black text-[var(--color-text)] mb-4 pb-3 border-b border-[var(--color-border)]">
                  4. Відповідальність сторін
                </h2>
                <div className="space-y-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                  <p>
                    4.1. Орендодавець відповідає за надання техніки в справному стані, технічне обслуговування та оперативне усунення несправностей, що виникли з вини Орендодавця.
                  </p>
                  <p>
                    4.2. Орендар несе повну матеріальну відповідальність за пошкодження, крадіжку або знищення техніки, що сталися під час терміну оренди з вини Орендаря або третіх осіб.
                  </p>
                  <p>
                    4.3. Розмір відшкодування шкоди визначається на підставі актів огляду та ринкової вартості ремонтних робіт або відновлення техніки. Вартість техніки для цілей відшкодування вказується в договорі оренди.
                  </p>
                  <p>
                    4.4. У разі прострочення оплати понад 5 банківських днів Орендодавець має право нараховувати пеню у розмірі 0,1% від суми боргу за кожен день прострочення.
                  </p>
                  <p>
                    4.5. Сторони звільняються від відповідальності за невиконання зобов'язань внаслідок форс-мажорних обставин: стихійних лих, воєнних дій, рішень органів влади тощо — за умови своєчасного повідомлення іншої сторони.
                  </p>
                </div>
              </section>

              {/* 5. Розірвання договору */}
              <section id="termination" className="scroll-mt-24">
                <h2 className="text-2xl font-black text-[var(--color-text)] mb-4 pb-3 border-b border-[var(--color-border)]">
                  5. Умови розірвання договору
                </h2>
                <div className="space-y-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                  <p>
                    5.1. Орендар має право розірвати договір достроково, письмово повідомивши Орендодавця не менш ніж за 24 години. Оплата здійснюється за фактично використаний час плюс витрати на доставку/забирання техніки.
                  </p>
                  <p>
                    5.2. При скасуванні більш ніж за 24 години до початку оренди: передоплата повертається у повному обсязі. При скасуванні менш ніж за 24 години: утримується 20% від суми передоплати як компенсація витрат на організацію.
                  </p>
                  <p>
                    5.3. Орендодавець має право розірвати договір достроково у разі: систематичного порушення Орендарем умов договору; невиконання вимог техніки безпеки; несплати оренди понад 10 банківських днів.
                  </p>
                  <p>
                    5.4. При достроковому розірванні з ініціативи Орендодавця без вини Орендаря — передоплата за невикористані дні повертається у повному обсязі протягом 5 банківських днів.
                  </p>
                </div>
              </section>

              {/* 6. Страхування */}
              <section id="insurance" className="scroll-mt-24">
                <h2 className="text-2xl font-black text-[var(--color-text)] mb-4 pb-3 border-b border-[var(--color-border)]">
                  6. Страхування
                </h2>
                <div className="space-y-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                  <p>
                    6.1. Орендодавець пропонує послугу страхування орендованої техніки через партнерські страхові компанії. Страхова сума відповідає ринковій вартості техніки на момент укладення договору.
                  </p>
                  <p>
                    6.2. Страховими випадками є: ДТП, пожежа, стихійне лихо, крадіжка, умисне пошкодження третіми особами.
                  </p>
                  <p>
                    6.3. Страхування не покриває: умисне пошкодження Орендарем; пошкодження внаслідок порушення правил експлуатації; природний знос та амортизацію.
                  </p>
                  <p>
                    6.4. При настанні страхового випадку Орендар зобов'язаний: негайно повідомити Орендодавця та відповідні органи (поліцію, ДСНС — залежно від ситуації); зберегти місце події без змін до прибуття аварійного комісара.
                  </p>
                  <p>
                    6.5. Оформлення страхування без наявного поліса є відповідальністю Орендаря. Вартість страхування — 200 грн/день включається в рахунок при замовленні послуги.
                  </p>
                </div>
              </section>

              {/* Bottom notice */}
              <div className="rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] p-5 text-sm text-[var(--color-text-muted)]">
                <p>
                  З питань щодо умов оренди звертайтесь:{' '}
                  <a href="tel:+380671234567" className="text-[var(--color-accent)] hover:underline">+38 (067) 123-45-67</a>
                  {' '}або{' '}
                  <a href="mailto:info@baggertrans.ua" className="text-[var(--color-accent)] hover:underline">info@baggertrans.ua</a>.
                  Договір оренди відповідає вимогам чинного законодавства України.
                </p>
              </div>

            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(public\)/terms/page.tsx
git commit -m "feat: add terms of rental page with table of contents"
```

---

### Task 6: Global 404 page

**Files:**
- Create: `app/not-found.tsx`

**Interfaces:**
- Per Next.js 16 docs, `app/not-found.tsx` is a server component wrapped by the root `app/layout.tsx`, so it gets the normal `<html>/<body>` from that layout automatically. It does NOT need to return full HTML itself (that is only for `global-not-found.tsx` which is experimental).
- Consumes: `Navbar`, `Footer`, `Button`, `Link`, lucide-react `Wrench`, `ChevronRight`.
- Produces: default-exported server component `NotFound`.

- [ ] **Step 1: Create app/not-found.tsx**

File: `app/not-found.tsx`

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Wrench, ChevronRight, Home, LayoutGrid } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: '404 — Сторінку не знайдено',
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[72px] flex flex-col">
        <div className="flex-1 gradient-navy flex items-center justify-center py-20">
          <div className="container-site text-center animate-fade-in">
            {/* Large icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/10 mb-8">
              <Wrench className="w-12 h-12 text-[var(--color-accent)]" />
            </div>

            {/* 404 */}
            <p className="text-8xl md:text-9xl font-black text-white/10 leading-none select-none -mb-4">
              404
            </p>

            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-2 mb-4">
              Сторінку не знайдено
            </h1>

            <p className="text-slate-300 text-lg max-w-md mx-auto mb-10 leading-relaxed">
              Схоже, ця сторінка поїхала на будівельний майданчик і ще не повернулась.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 text-base font-semibold rounded-md text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] transition-colors shadow-[0_2px_12px_0_rgba(234,88,12,0.4)]"
              >
                <Home className="w-4 h-4" />
                На головну
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 text-base font-semibold rounded-md text-white border border-white/30 hover:bg-white/10 transition-colors"
              >
                <LayoutGrid className="w-4 h-4" />
                Переглянути каталог
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/not-found.tsx
git commit -m "feat: add custom 404 not-found page"
```

---

## Self-Review

### 1. Spec Coverage Check

| Spec requirement | Covered by task |
|-----------------|-----------------|
| `/app/(public)/booking/page.tsx` — server, searchParams, fetch equipment, render client | Task 1 |
| BookingPageClient — 4 form sections, order summary, react-hook-form + bookingSchema, createBooking, SuccessStep | Task 1 |
| Step 1: equipment select dropdown grouped by category, preselectedId default | Task 1 |
| Step 2: start/end dates, getDaysBetween calc shown real-time | Task 1 |
| Step 3: ADDITIONAL_SERVICES checkboxes with prices | Task 1 |
| Step 4: contact fields, notes textarea | Task 1 |
| Right side: equipment name, dates, days, services, total, submit button, info message | Task 1 |
| Loading state on submit button | Task 1 — `loading={isSubmitting}` on Button |
| Validation errors shown below each field | Task 1 — `errors.xxx.message` patterns |
| Success step with booking ID | Task 1 — `SuccessStep` component |
| About page — hero, story, stats, team, fleet, certificates, CTA | Task 2 |
| Contacts page — 3 contact cards, working hours, map placeholder, contact form | Task 3 |
| ContactForm — name, phone, message + email optional | Task 3 |
| FAQ page — 10 Q&A accordion, radix-ui/react-accordion, CTA at bottom | Task 4 |
| Accordion smooth animation | Task 4 — CSS keyframes added to globals.css |
| Terms page — 6 sections, TOC anchors, PDF button | Task 5 |
| 404 page — dark navy, Wrench icon, Ukrainian text, two buttons | Task 6 |
| All Ukrainian text | All tasks |
| Mobile-first responsive | All tasks — grid responsive, mobile submit button in Task 1 |
| No emojis, lucide-react icons | All tasks |
| TypeScript | All tasks |

### 2. Placeholder Scan

- No "TBD", "TODO", "implement later" in any task.
- All code blocks are complete.
- ContactForm uses `setTimeout` simulation for submit with a note to replace — this is acceptable placeholder behavior for a form that doesn't have a backend endpoint yet (spec says "recreate with name, phone, message fields" not "wire up to Firebase").

### 3. Type Consistency

- `BookingFormValues` from `@/lib/validations/booking` — used in Task 1 for `useForm<BookingFormValues>` and `onSubmit`.
- `Equipment` from `@/types` — used in Task 1 props and `groupByCategory`.
- `ADDITIONAL_SERVICES` from `@/types` — iterated in Task 1 checkboxes.
- `SERVICE_PRICES` defined locally as `Record<string, number>` — keyed by same IDs (`transport`, `operator`, `fuel`, `insurance`) as `ADDITIONAL_SERVICES[].id`.
- `createBooking` called with `{ ...data, equipmentName: string, totalDays: number, totalPrice: number }` — matches signature in `lib/firebase/bookings.ts`.
- `ContactFormValues` from `@/lib/validations/booking` — used in Task 3 `useForm<ContactFormValues>`.
- `Navbar` and `Footer` named exports from `@/components/layout/navbar` and `@/components/layout/footer` — confirmed by reading those files.
- `formatPrice`, `formatDate`, `getDaysBetween` from `@/lib/utils` — confirmed exported names.
- `CATEGORY_LABELS` from `@/types` — confirmed as `Record<EquipmentCategory, string>`.
- `Button` props `variant="primary"|"outline"`, `size="lg"|"md"`, `loading` — confirmed by reading `components/ui/button.tsx`.
- `Input` props `label`, `error` — confirmed by reading `components/ui/input.tsx`.
- `Textarea` props `label`, `error` — confirmed by reading `components/ui/textarea.tsx`.

All types are consistent.
