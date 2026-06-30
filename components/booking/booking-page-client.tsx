'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  Truck,
  Wrench,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import { cn, getDaysBetween, formatPrice } from '@/lib/utils';
import { bookingSchema, type BookingFormValues } from '@/lib/validations/booking';
import { createBooking } from '@/lib/firebase/bookings';
import { ADDITIONAL_SERVICES, CATEGORY_LABELS, type Equipment } from '@/types';

const SERVICE_PRICES: Record<string, number> = {
  transport: 500,
  operator: 800,
  fuel: 300,
  insurance: 200,
};

interface Props {
  equipment: Equipment[];
  preselectedId?: string;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="flex items-center gap-1 text-xs text-[var(--color-destructive)] mt-1">
      <AlertCircle size={12} aria-hidden="true" />
      {message}
    </p>
  );
}

function Label({ htmlFor, children, optional }: { htmlFor: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-[var(--color-text)] mb-1.5">
      {children}{' '}
      {optional ? (
        <span className="text-[var(--color-text-muted)] font-normal text-xs">(необов'язково)</span>
      ) : (
        <span className="text-[var(--color-destructive)]" aria-label="обов'язкове поле">*</span>
      )}
    </label>
  );
}

const inputCls = (hasError?: boolean) =>
  cn(
    'w-full h-11 px-4 rounded-lg border text-sm bg-[var(--color-bg)] text-[var(--color-text)]',
    'placeholder:text-[var(--color-text-muted)] transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]',
    hasError
      ? 'border-[var(--color-destructive)] focus:ring-[var(--color-destructive)]'
      : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
  );

export function BookingPageClient({ equipment, preselectedId }: Props) {
  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      equipmentId: preselectedId || '',
      additionalServices: [],
      startDate: '',
      endDate: '',
    },
  });

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const watchedEquipmentId = watch('equipmentId');
  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');
  const watchedServices = watch('additionalServices');

  const selectedEquipment = equipment.find((e) => e.id === watchedEquipmentId) || null;

  const totalDays =
    watchedStartDate && watchedEndDate && watchedEndDate > watchedStartDate
      ? getDaysBetween(watchedStartDate, watchedEndDate)
      : 0;

  const equipmentCost = selectedEquipment ? selectedEquipment.pricePerDay * totalDays : 0;

  const servicesCost = (watchedServices || []).reduce((acc, sId) => {
    return acc + (SERVICE_PRICES[sId] || 0) * totalDays;
  }, 0);

  const totalPrice = equipmentCost + servicesCost;

  // Group equipment by category
  const grouped = equipment.reduce<Record<string, Equipment[]>>((acc, eq) => {
    const key = eq.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(eq);
    return acc;
  }, {});

  const onSubmit = async (data: BookingFormValues) => {
    if (!selectedEquipment) return;
    setSubmitStatus('loading');
    setServerError(null);
    try {
      const id = await createBooking({
        ...data,
        equipmentName: selectedEquipment.nameUk || selectedEquipment.name,
        totalDays,
        totalPrice,
      });
      setBookingId(id);
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
      setServerError('Сталася помилка. Спробуйте ще раз або зв\'яжіться з нами за телефоном.');
    }
  };

  if (submitStatus === 'success' && bookingId) {
    return (
      <div className="container-site py-12 lg:py-20">
        <div className="max-w-lg mx-auto text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-[var(--color-success)]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text)] mb-4">
            Заявку надіслано!
          </h1>
          <p className="text-[var(--color-text-muted)] mb-3 leading-relaxed">
            Ваша заявка на бронювання прийнята. Наш менеджер зв'яжеться з вами протягом 15 хвилин у робочий час.
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mb-8">
            Номер заявки:{' '}
            <span className="font-mono font-semibold text-[var(--color-text)]">{bookingId}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text)] hover:border-[var(--color-border-strong)] transition-colors"
            >
              Повернутись до каталогу
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[var(--color-accent)] text-white text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors shadow-[0_4px_14px_0_rgba(234,88,12,0.3)]"
            >
              На головну
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-site py-12 lg:py-16 animate-fade-in">
      {/* Page header */}
      <div className="mb-10">
        <span className="inline-block text-[var(--color-accent)] text-xs font-semibold uppercase tracking-widest mb-3">
          Оренда техніки
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--color-text)] tracking-tight">
          Бронювання техніки
        </h1>
        <p className="mt-3 text-[var(--color-text-muted)] max-w-xl">
          Заповніть форму нижче, і наш менеджер зв'яжеться з вами для підтвердження бронювання.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: form */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Step 1: Select equipment */}
            <section
              className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 md:p-8 shadow-sm"
              aria-labelledby="step-equipment"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-accent)] text-white text-sm font-bold shrink-0">
                  1
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={18} className="text-[var(--color-accent)]" aria-hidden="true" />
                  <h2 id="step-equipment" className="text-lg font-bold text-[var(--color-text)]">
                    Оберіть техніку
                  </h2>
                </div>
              </div>

              <div>
                <Label htmlFor="equipmentId">Техніка</Label>
                <select
                  id="equipmentId"
                  aria-required="true"
                  aria-invalid={!!errors.equipmentId}
                  className={cn(
                    inputCls(!!errors.equipmentId),
                    'appearance-none cursor-pointer',
                    !watchedEquipmentId && 'text-[var(--color-text-muted)]',
                  )}
                  {...register('equipmentId')}
                >
                  <option value="" disabled>
                    — Оберіть техніку зі списку —
                  </option>
                  {Object.entries(grouped).map(([cat, items]) => (
                    <optgroup key={cat} label={CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] || cat}>
                      {items.map((eq) => (
                        <option key={eq.id} value={eq.id}>
                          {eq.nameUk || eq.name} — {formatPrice(eq.pricePerDay)}/день
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <FieldError message={errors.equipmentId?.message} />

                {selectedEquipment && (
                  <div className="mt-4 p-4 rounded-xl bg-[var(--color-accent-light)] border border-[var(--color-orange-200)]">
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      {selectedEquipment.nameUk || selectedEquipment.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      {CATEGORY_LABELS[selectedEquipment.category]} •{' '}
                      <span className="font-semibold text-[var(--color-accent)]">
                        {formatPrice(selectedEquipment.pricePerDay)}/день
                      </span>
                    </p>
                    {selectedEquipment.description && (
                      <p className="text-xs text-[var(--color-text-muted)] mt-2 line-clamp-2">
                        {selectedEquipment.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Step 2: Dates */}
            <section
              className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 md:p-8 shadow-sm"
              aria-labelledby="step-dates"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-accent)] text-white text-sm font-bold shrink-0">
                  2
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-[var(--color-accent)]" aria-hidden="true" />
                  <h2 id="step-dates" className="text-lg font-bold text-[var(--color-text)]">
                    Дати оренди
                  </h2>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="startDate">Дата початку</Label>
                  <input
                    id="startDate"
                    type="date"
                    min={today}
                    aria-required="true"
                    aria-invalid={!!errors.startDate}
                    className={inputCls(!!errors.startDate)}
                    {...register('startDate')}
                  />
                  <FieldError message={errors.startDate?.message} />
                </div>

                <div>
                  <Label htmlFor="endDate">Дата закінчення</Label>
                  <input
                    id="endDate"
                    type="date"
                    min={watchedStartDate || today}
                    aria-required="true"
                    aria-invalid={!!errors.endDate}
                    className={inputCls(!!errors.endDate)}
                    {...register('endDate')}
                  />
                  <FieldError message={errors.endDate?.message} />
                </div>
              </div>

              {totalDays > 0 && selectedEquipment && (
                <div className="mt-5 p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">
                      {totalDays} {totalDays === 1 ? 'день' : totalDays < 5 ? 'дні' : 'днів'} × {formatPrice(selectedEquipment.pricePerDay)}/день
                    </span>
                    <span className="font-bold text-[var(--color-text)]">{formatPrice(equipmentCost)}</span>
                  </div>
                </div>
              )}
            </section>

            {/* Step 3: Additional services */}
            <section
              className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 md:p-8 shadow-sm"
              aria-labelledby="step-services"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-accent)] text-white text-sm font-bold shrink-0">
                  3
                </div>
                <div className="flex items-center gap-2">
                  <Wrench size={18} className="text-[var(--color-accent)]" aria-hidden="true" />
                  <h2 id="step-services" className="text-lg font-bold text-[var(--color-text)]">
                    Додаткові послуги
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {ADDITIONAL_SERVICES.map((service) => {
                  const isChecked = (watchedServices || []).includes(service.id);
                  return (
                    <label
                      key={service.id}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all',
                        isChecked
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]',
                      )}
                    >
                      <input
                        type="checkbox"
                        value={service.id}
                        className="w-4 h-4 rounded border-[var(--color-border)] accent-[var(--color-accent)] cursor-pointer"
                        {...register('additionalServices')}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--color-text)]">{service.label}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[var(--color-accent)]">
                          +{formatPrice(SERVICE_PRICES[service.id])}/день
                        </p>
                        {totalDays > 0 && (
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {formatPrice(SERVICE_PRICES[service.id] * totalDays)} всього
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Step 4: Contact info */}
            <section
              className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 md:p-8 shadow-sm"
              aria-labelledby="step-contact"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-accent)] text-white text-sm font-bold shrink-0">
                  4
                </div>
                <div className="flex items-center gap-2">
                  <User size={18} className="text-[var(--color-accent)]" aria-hidden="true" />
                  <h2 id="step-contact" className="text-lg font-bold text-[var(--color-text)]">
                    Контактна інформація
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="clientName">Повне ім'я</Label>
                    <input
                      id="clientName"
                      type="text"
                      autoComplete="name"
                      placeholder="Іван Іваненко"
                      aria-required="true"
                      aria-invalid={!!errors.clientName}
                      className={inputCls(!!errors.clientName)}
                      {...register('clientName')}
                    />
                    <FieldError message={errors.clientName?.message} />
                  </div>

                  <div>
                    <Label htmlFor="clientPhone">Телефон</Label>
                    <input
                      id="clientPhone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+38 (067) 123-45-67"
                      aria-required="true"
                      aria-invalid={!!errors.clientPhone}
                      className={inputCls(!!errors.clientPhone)}
                      {...register('clientPhone')}
                    />
                    <FieldError message={errors.clientPhone?.message} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="clientEmail">Email</Label>
                    <input
                      id="clientEmail"
                      type="email"
                      autoComplete="email"
                      placeholder="ivan@company.ua"
                      aria-required="true"
                      aria-invalid={!!errors.clientEmail}
                      className={inputCls(!!errors.clientEmail)}
                      {...register('clientEmail')}
                    />
                    <FieldError message={errors.clientEmail?.message} />
                  </div>

                  <div>
                    <Label htmlFor="company" optional>
                      Компанія
                    </Label>
                    <input
                      id="company"
                      type="text"
                      autoComplete="organization"
                      placeholder="ТОВ Будівельна компанія"
                      className={inputCls(false)}
                      {...register('company')}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" optional>
                    Примітки до замовлення
                  </Label>
                  <textarea
                    id="notes"
                    rows={4}
                    placeholder="Адреса об'єкту, особливі вимоги, час подачі техніки..."
                    aria-invalid={!!errors.notes}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border text-sm bg-[var(--color-bg)] text-[var(--color-text)]',
                      'placeholder:text-[var(--color-text-muted)] transition-colors resize-none',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]',
                      'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
                    )}
                    {...register('notes')}
                  />
                  <FieldError message={errors.notes?.message} />
                </div>
              </div>
            </section>

            {/* Mobile submit (shown only on small screens) */}
            <div className="lg:hidden">
              {serverError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 px-4 py-3 rounded-xl bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/30 text-sm text-[var(--color-destructive)] mb-4"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                  {serverError}
                </div>
              )}
              <button
                type="submit"
                disabled={submitStatus === 'loading'}
                className={cn(
                  'w-full inline-flex items-center justify-center gap-2 h-14 px-8 text-base font-bold rounded-xl',
                  'bg-[var(--color-accent)] text-white',
                  'hover:bg-[var(--color-accent-hover)] active:scale-[0.98]',
                  'disabled:opacity-60 disabled:cursor-not-allowed',
                  'transition-all shadow-[0_4px_20px_0_rgba(234,88,12,0.4)]',
                )}
                aria-busy={submitStatus === 'loading'}
              >
                {submitStatus === 'loading' ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    Надсилаємо...
                  </>
                ) : (
                  <>
                    <ClipboardList size={18} aria-hidden="true" />
                    Відправити заявку
                    <ChevronRight size={16} aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: summary sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
                <div className="gradient-navy px-6 py-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-orange-300)] mb-1">
                    Ваше замовлення
                  </p>
                  <h3 className="text-lg font-bold text-white">Підсумок</h3>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  {/* Equipment */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                      Техніка
                    </p>
                    {selectedEquipment ? (
                      <p className="text-sm font-semibold text-[var(--color-text)]">
                        {selectedEquipment.nameUk || selectedEquipment.name}
                      </p>
                    ) : (
                      <p className="text-sm text-[var(--color-text-muted)] italic">Не обрано</p>
                    )}
                  </div>

                  {/* Dates */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                      Дати
                    </p>
                    {watchedStartDate && watchedEndDate ? (
                      <div className="text-sm text-[var(--color-text)]">
                        <p>{watchedStartDate} — {watchedEndDate}</p>
                        {totalDays > 0 && (
                          <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            {totalDays} {totalDays === 1 ? 'день' : totalDays < 5 ? 'дні' : 'днів'}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-[var(--color-text-muted)] italic">Не обрано</p>
                    )}
                  </div>

                  {/* Price breakdown */}
                  {totalDays > 0 && selectedEquipment && (
                    <div className="border-t border-[var(--color-border)] pt-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
                        Розрахунок
                      </p>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--color-text-muted)]">
                            Оренда техніки ({totalDays} д.)
                          </span>
                          <span className="font-semibold text-[var(--color-text)]">
                            {formatPrice(equipmentCost)}
                          </span>
                        </div>

                        {(watchedServices || []).map((sId) => {
                          const svc = ADDITIONAL_SERVICES.find((s) => s.id === sId);
                          if (!svc) return null;
                          return (
                            <div key={sId} className="flex justify-between text-sm">
                              <span className="text-[var(--color-text-muted)]">{svc.label}</span>
                              <span className="font-semibold text-[var(--color-text)]">
                                {formatPrice(SERVICE_PRICES[sId] * totalDays)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t border-[var(--color-border)] pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-[var(--color-text)]">Разом</span>
                      <span className="text-xl font-black text-[var(--color-accent)]">
                        {totalPrice > 0 ? formatPrice(totalPrice) : '—'}
                      </span>
                    </div>
                    {totalPrice === 0 && (
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        Оберіть техніку та дати
                      </p>
                    )}
                  </div>

                  {/* Server error */}
                  {serverError && (
                    <div
                      role="alert"
                      className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/30 text-xs text-[var(--color-destructive)]"
                    >
                      <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                      {serverError}
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={submitStatus === 'loading'}
                    className={cn(
                      'w-full inline-flex items-center justify-center gap-2 h-13 px-6 text-sm font-bold rounded-xl mt-1',
                      'bg-[var(--color-accent)] text-white',
                      'hover:bg-[var(--color-accent-hover)] active:scale-[0.98]',
                      'disabled:opacity-60 disabled:cursor-not-allowed',
                      'transition-all shadow-[0_4px_14px_0_rgba(234,88,12,0.35)]',
                    )}
                    aria-busy={submitStatus === 'loading'}
                  >
                    {submitStatus === 'loading' ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                        Надсилаємо...
                      </>
                    ) : (
                      <>
                        <ClipboardList size={16} aria-hidden="true" />
                        Відправити заявку
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-[var(--color-text-muted)] text-center leading-relaxed">
                    Натискаючи кнопку, ви погоджуєтеся з{' '}
                    <a
                      href="/terms"
                      className="text-[var(--color-accent)] hover:underline"
                    >
                      умовами оренди
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
