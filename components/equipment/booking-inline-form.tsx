'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarDays, CheckCircle2, Loader2 } from 'lucide-react';
import { cn, formatPrice, getDaysBetween } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createBooking } from '@/lib/firebase/bookings';
import { bookingSchema, BookingFormValues } from '@/lib/validations/booking';
import { ADDITIONAL_SERVICES } from '@/types';

interface BookingInlineFormProps {
  equipmentId: string;
  equipmentName: string;
  pricePerDay: number;
  disabled?: boolean;
}

export function BookingInlineForm({ equipmentId, equipmentName, pricePerDay, disabled = false }: BookingInlineFormProps) {
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      equipmentId,
      additionalServices: [],
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const totalDays = startDate && endDate
    ? Math.max(0, getDaysBetween(startDate, endDate))
    : 0;
  const totalPrice = totalDays * pricePerDay;

  async function onSubmit(data: BookingFormValues) {
    setSubmitError(null);
    try {
      const id = await createBooking({
        ...data,
        equipmentName,
        totalDays,
        totalPrice,
      });
      setBookingId(id);
    } catch (err) {
      console.error('[BookingInlineForm] createBooking error:', err);
      setSubmitError('Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте нам.');
    }
  }

  if (bookingId) {
    return (
      <div className="rounded-xl border border-[var(--color-success,#16a34a)]/30 bg-green-50 p-6 text-center animate-fade-in">
        <CheckCircle2 className="w-12 h-12 text-[var(--color-success,#16a34a)] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">Заявку відправлено!</h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-3">
          Наш менеджер зв&apos;яжеться з вами найближчим часом для підтвердження.
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">
          Номер заявки: <span className="font-mono font-semibold text-[var(--color-text)]">{bookingId}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-[var(--color-accent)]" />
        <h3 className="font-bold text-[var(--color-text)] text-base">Замовити оренду</h3>
      </div>

      {disabled && (
        <div className="rounded-lg bg-[var(--color-surface-2,#f1f5f9)] border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-muted)] text-center">
          Техніка наразі недоступна для бронювання
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={cn('flex flex-col gap-4', disabled && 'pointer-events-none opacity-50')}>
        {/* Hidden equipmentId */}
        <input type="hidden" {...register('equipmentId')} />

        {/* Date inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
              Початок оренди
            </label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              {...register('startDate')}
              className={cn(
                'w-full h-10 rounded-lg border px-3 text-sm bg-[var(--color-surface)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent',
                errors.startDate ? 'border-[var(--color-destructive,#dc2626)]' : 'border-[var(--color-border)]'
              )}
            />
            {errors.startDate && (
              <p className="text-xs text-[var(--color-destructive,#dc2626)]">{errors.startDate.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
              Кінець оренди
            </label>
            <input
              type="date"
              min={startDate || new Date().toISOString().split('T')[0]}
              {...register('endDate')}
              className={cn(
                'w-full h-10 rounded-lg border px-3 text-sm bg-[var(--color-surface)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent',
                errors.endDate ? 'border-[var(--color-destructive,#dc2626)]' : 'border-[var(--color-border)]'
              )}
            />
            {errors.endDate && (
              <p className="text-xs text-[var(--color-destructive,#dc2626)]">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {/* Calculated totals */}
        {totalDays > 0 && (
          <div className="rounded-lg bg-[var(--color-accent-light,#fff7ed)] border border-[var(--color-accent)]/20 px-4 py-3 flex justify-between items-center animate-fade-in">
            <span className="text-sm text-[var(--color-text-muted)]">
              {totalDays} {totalDays === 1 ? 'день' : totalDays < 5 ? 'дні' : 'днів'}
            </span>
            <span className="text-lg font-bold text-[var(--color-accent)]">
              {formatPrice(totalPrice)}
            </span>
          </div>
        )}

        {/* Additional services */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
            Додаткові послуги
          </p>
          <div className="flex flex-col gap-2">
            {ADDITIONAL_SERVICES.map((service) => (
              <label key={service.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  value={service.id}
                  {...register('additionalServices')}
                  className="w-4 h-4 rounded accent-[var(--color-accent)] cursor-pointer"
                />
                <span className="text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  {service.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Contact fields */}
        <div className="flex flex-col gap-3 pt-1 border-t border-[var(--color-border)]">
          <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
            Контактна інформація
          </p>
          <Input
            label="Ім'я та прізвище"
            {...register('clientName')}
            error={errors.clientName?.message}
            autoComplete="name"
          />
          <Input
            label="Номер телефону"
            type="tel"
            {...register('clientPhone')}
            error={errors.clientPhone?.message}
            autoComplete="tel"
          />
          <Input
            label="Email"
            type="email"
            {...register('clientEmail')}
            error={errors.clientEmail?.message}
            autoComplete="email"
          />
          <Input
            label="Компанія (необов'язково)"
            {...register('company')}
            error={errors.company?.message}
            autoComplete="organization"
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
              Примітки
            </label>
            <textarea
              rows={3}
              {...register('notes')}
              placeholder="Додаткова інформація або побажання..."
              className={cn(
                'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent',
                'placeholder:text-[var(--color-text-muted)] resize-none'
              )}
            />
          </div>
        </div>

        {/* Submit error */}
        {submitError && (
          <p className="text-sm text-[var(--color-destructive,#dc2626)] bg-red-50 rounded-lg px-4 py-3">
            {submitError}
          </p>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          disabled={isSubmitting || disabled}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Відправлення...
            </>
          ) : (
            'Забронювати'
          )}
        </Button>
      </form>
    </div>
  );
}
