'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { contactSchema, type ContactFormValues } from '@/lib/validations/booking';

export function ContactForm() {
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
      if (!res.ok) throw new Error('Помилка сервера');
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
      setServerError('Щось пішло не так. Спробуйте ще раз або зателефонуйте нам.');
    }
  };

  const inputClass = (hasError: boolean) =>
    cn(
      'h-11 w-full px-4 rounded-lg border text-sm bg-[var(--color-bg)] text-[var(--color-text)]',
      'placeholder:text-[var(--color-text-muted)] transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]',
      hasError
        ? 'border-[var(--color-destructive)] focus:ring-[var(--color-destructive)]'
        : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
    );

  return (
    <section
      className="section-padding bg-[var(--color-surface-2)]"
      aria-labelledby="contact-heading"
    >
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── Left: phone-first info ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <span className="block w-6 h-px bg-[var(--color-accent)] mb-6" aria-hidden="true" />
            <h2
              id="contact-heading"
              className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] leading-tight mb-4"
            >
              Потрібна техніка?<br />Зателефонуйте.
            </h2>
            <p className="text-[var(--color-text-muted)] text-base leading-relaxed mb-10 max-w-sm">
              Відповідаємо протягом 15 хвилин у робочий час. Підберемо техніку та розрахуємо вартість.
            </p>

            {/* Phone numbers — large */}
            <div className="flex flex-col gap-4 mb-8">
              <a
                href="tel:+380671234567"
                className="flex items-center gap-3 group focus-visible:outline-none"
              >
                <Phone
                  size={18}
                  className="text-[var(--color-accent)] shrink-0"
                  aria-hidden="true"
                />
                <span className="text-[1.5rem] font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors tabular-nums tracking-tight">
                  +38 (067) 123-45-67
                </span>
              </a>
              <a
                href="tel:+380501234567"
                className="flex items-center gap-3 group focus-visible:outline-none"
              >
                <Phone
                  size={18}
                  className="text-[var(--color-accent)] shrink-0"
                  aria-hidden="true"
                />
                <span className="text-[1.5rem] font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors tabular-nums tracking-tight">
                  +38 (050) 123-45-67
                </span>
              </a>
            </div>

            {/* Secondary contact details */}
            <div className="flex flex-col gap-3 text-sm text-[var(--color-text-muted)]">
              <a
                href="mailto:info@baggertrans.ua"
                className="flex items-center gap-2.5 hover:text-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:text-[var(--color-accent)]"
              >
                <Mail size={15} className="text-[var(--color-accent)] shrink-0" aria-hidden="true" />
                info@baggertrans.ua
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[var(--color-accent)] shrink-0 mt-0.5" aria-hidden="true" />
                <span>м. Київ, вул. Будівельна, 12</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock size={15} className="text-[var(--color-accent)] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p>Пн–Пт: 08:00 – 18:00</p>
                  <p>Сб: 09:00 – 15:00</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Right: lean form ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.07 }}
          >
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-7 lg:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">
                Або залиште заявку
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-7">
                Передзвонимо протягом 15 хвилин у робочий час
              </p>

              {/* Success */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-10 gap-4"
                  role="alert"
                  aria-live="polite"
                >
                  <CheckCircle size={44} className="text-[var(--color-success)]" />
                  <div>
                    <p className="text-base font-bold text-[var(--color-text)] mb-1">
                      Заявку прийнято!
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Передзвонимо протягом 15 хвилин.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-1 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    Надіслати ще одне
                  </button>
                </motion.div>
              )}

              {status !== 'success' && (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="flex flex-col gap-5"
                  aria-label="Форма зворотнього зв'язку"
                >
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cf-name" className="text-sm font-semibold text-[var(--color-text)]">
                      Ваше ім&apos;я <span className="text-[var(--color-destructive)]" aria-label="обов'язкове поле">*</span>
                    </label>
                    <input
                      id="cf-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Іван Іваненко"
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'cf-name-err' : undefined}
                      className={inputClass(!!errors.name)}
                      {...register('name')}
                    />
                    {errors.name && (
                      <p id="cf-name-err" role="alert" className="flex items-center gap-1 text-xs text-[var(--color-destructive)]">
                        <AlertCircle size={12} aria-hidden="true" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cf-phone" className="text-sm font-semibold text-[var(--color-text)]">
                      Телефон <span className="text-[var(--color-destructive)]" aria-label="обов'язкове поле">*</span>
                    </label>
                    <input
                      id="cf-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+38 (067) 123-45-67"
                      aria-required="true"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'cf-phone-err' : undefined}
                      className={inputClass(!!errors.phone)}
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p id="cf-phone-err" role="alert" className="flex items-center gap-1 text-xs text-[var(--color-destructive)]">
                        <AlertCircle size={12} aria-hidden="true" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cf-message" className="text-sm font-semibold text-[var(--color-text)]">
                      Повідомлення <span className="text-[var(--color-destructive)]" aria-label="обов'язкове поле">*</span>
                    </label>
                    <textarea
                      id="cf-message"
                      rows={4}
                      placeholder="Яка техніка потрібна, на який термін, де об'єкт…"
                      aria-required="true"
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'cf-message-err' : undefined}
                      className={cn(
                        inputClass(!!errors.message),
                        'h-auto py-3 resize-none',
                      )}
                      {...register('message')}
                    />
                    {errors.message && (
                      <p id="cf-message-err" role="alert" className="flex items-center gap-1 text-xs text-[var(--color-destructive)]">
                        <AlertCircle size={12} aria-hidden="true" />
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Server error */}
                  {status === 'error' && serverError && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="flex items-start gap-2 px-4 py-3 rounded-lg bg-[var(--color-destructive)]/8 border border-[var(--color-destructive)]/25 text-sm text-[var(--color-destructive)]"
                    >
                      <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                      {serverError}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    aria-busy={status === 'loading'}
                    className="mt-1 inline-flex items-center justify-center gap-2 h-12 px-7 text-sm font-bold rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:scale-[0.99] disabled:opacity-55 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-150 shadow-[0_4px_16px_0_rgba(234,88,12,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                        Надсилаємо…
                      </>
                    ) : (
                      'Надіслати заявку'
                    )}
                  </button>

                  <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                    Натискаючи кнопку, ви погоджуєтесь з{' '}
                    <a href="/privacy" className="text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:underline">
                      політикою конфіденційності
                    </a>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
