'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { contactSchema, type ContactFormValues } from '@/lib/validations/booking';

export function ContactFormInline() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus('loading');
    setServerError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
      setServerError("Щось пішло не так. Спробуйте ще раз або зателефонуйте нам.");
    }
  };

  const inputCls = (hasError?: boolean) =>
    cn(
      'w-full h-11 px-4 rounded-lg border text-sm bg-[var(--color-bg)] text-[var(--color-text)]',
      'placeholder:text-[var(--color-text-muted)] transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]',
      hasError
        ? 'border-[var(--color-destructive)] focus:ring-[var(--color-destructive)]'
        : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
    );

  if (status === 'success') {
    return (
      <div
        className="flex flex-col items-center text-center py-10 gap-4"
        role="alert"
        aria-live="polite"
      >
        <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
          <CheckCircle size={32} className="text-[var(--color-success)]" />
        </div>
        <h3 className="text-xl font-bold text-[var(--color-text)]">Повідомлення надіслано!</h3>
        <p className="text-sm text-[var(--color-text-muted)] max-w-xs">
          Дякуємо за ваше звернення. Ми відповімо якнайшвидше у робочий час.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-2 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
        >
          Надіслати ще одне повідомлення
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
      aria-label="Форма зворотнього зв'язку"
    >
      {/* Name */}
      <div>
        <label htmlFor="cnt-name" className="block text-sm font-semibold text-[var(--color-text)] mb-1.5">
          Ваше ім'я <span className="text-[var(--color-destructive)]" aria-label="обов'язкове поле">*</span>
        </label>
        <input
          id="cnt-name"
          type="text"
          autoComplete="name"
          placeholder="Іван Іваненко"
          aria-required="true"
          aria-invalid={!!errors.name}
          className={inputCls(!!errors.name)}
          {...register('name')}
        />
        {errors.name && (
          <p role="alert" className="flex items-center gap-1 text-xs text-[var(--color-destructive)] mt-1">
            <AlertCircle size={12} aria-hidden="true" />
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="cnt-phone" className="block text-sm font-semibold text-[var(--color-text)] mb-1.5">
          Телефон <span className="text-[var(--color-destructive)]" aria-label="обов'язкове поле">*</span>
        </label>
        <input
          id="cnt-phone"
          type="tel"
          autoComplete="tel"
          placeholder="+420 733 777 999"
          aria-required="true"
          aria-invalid={!!errors.phone}
          className={inputCls(!!errors.phone)}
          {...register('phone')}
        />
        {errors.phone && (
          <p role="alert" className="flex items-center gap-1 text-xs text-[var(--color-destructive)] mt-1">
            <AlertCircle size={12} aria-hidden="true" />
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="cnt-message" className="block text-sm font-semibold text-[var(--color-text)] mb-1.5">
          Повідомлення <span className="text-[var(--color-destructive)]" aria-label="обов'язкове поле">*</span>
        </label>
        <textarea
          id="cnt-message"
          rows={4}
          placeholder="Опишіть вашу потребу..."
          aria-required="true"
          aria-invalid={!!errors.message}
          className={cn(
            'w-full px-4 py-3 rounded-lg border text-sm bg-[var(--color-bg)] text-[var(--color-text)]',
            'placeholder:text-[var(--color-text-muted)] transition-colors resize-none',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]',
            errors.message
              ? 'border-[var(--color-destructive)] focus:ring-[var(--color-destructive)]'
              : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
          )}
          {...register('message')}
        />
        {errors.message && (
          <p role="alert" className="flex items-center gap-1 text-xs text-[var(--color-destructive)] mt-1">
            <AlertCircle size={12} aria-hidden="true" />
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Server error */}
      {status === 'error' && serverError && (
        <div
          role="alert"
          className="flex items-start gap-2 px-4 py-3 rounded-lg bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/30 text-sm text-[var(--color-destructive)]"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {serverError}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className={cn(
          'inline-flex items-center justify-center gap-2 h-12 px-7 text-sm font-bold rounded-lg',
          'bg-[var(--color-accent)] text-[var(--color-primary)]',
          'hover:bg-[var(--color-accent-hover)] active:scale-[0.98]',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          'transition-all shadow-[0_4px_14px_0_rgba(244,184,21,0.35)]',
        )}
        aria-busy={status === 'loading'}
      >
        {status === 'loading' ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
            Надсилаємо...
          </>
        ) : (
          <>
            <Send size={15} aria-hidden="true" />
            Надіслати повідомлення
          </>
        )}
      </button>
    </form>
  );
}
