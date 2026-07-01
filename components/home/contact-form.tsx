'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
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
      'h-11 w-full px-4 rounded-lg border text-sm bg-[#1c1d20] text-white',
      'placeholder:text-slate-500 transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]',
      hasError
        ? 'border-[var(--color-destructive)] focus:ring-[var(--color-destructive)]'
        : 'border-white/10 hover:border-white/20',
    );

  return (
    <section
      className="section-padding bg-[var(--color-primary)]"
      aria-labelledby="contact-heading"
    >
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: heading + contact details ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <h2
              id="contact-heading"
              className="text-2xl sm:text-3xl font-black uppercase leading-tight tracking-tight mb-4"
            >
              <span className="block text-white">Потрібна техніка?</span>
              <span className="block text-[var(--color-accent)]">Ми готові допомогти!</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
              Зв&apos;яжіться з нами зручним способом та отримайте консультацію.
            </p>

            <div className="flex flex-col gap-4">
              <a
                href="tel:+420733777999"
                className="flex items-center gap-3 group focus-visible:outline-none"
              >
                <Phone size={17} className="text-[var(--color-accent)] shrink-0" aria-hidden="true" />
                <span className="flex flex-col leading-snug">
                  <span className="text-base font-bold text-white group-hover:text-[var(--color-accent)] transition-colors tabular-nums">
                    +420 733 777 999
                  </span>
                  <span className="text-base font-bold text-white group-hover:text-[var(--color-accent)] transition-colors tabular-nums">
                    +420 775 111 555
                  </span>
                </span>
              </a>
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin size={17} className="text-[var(--color-accent)] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Закарпатська область, Україна</span>
              </div>
              <a
                href="https://t.me/BAGGERTRANS"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-slate-400 hover:text-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:text-[var(--color-accent)]"
              >
                <Send size={17} className="text-[var(--color-accent)] shrink-0" aria-hidden="true" />
                @BAGGERTRANS
              </a>
            </div>
          </motion.div>

          {/* ── Right: lean form ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.07 }}
          >
            <div className="bg-[#141517] rounded-2xl border border-white/10 p-6 sm:p-7">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-10 gap-4"
                  role="alert"
                  aria-live="polite"
                >
                  <CheckCircle size={44} className="text-[var(--color-success)]" />
                  <div>
                    <p className="text-base font-bold text-white mb-1">Заявку прийнято!</p>
                    <p className="text-sm text-slate-400">Передзвонимо протягом 15 хвилин.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-1 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    Надіслати ще одне
                  </button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="flex flex-col gap-4"
                  aria-label="Форма зворотнього зв'язку"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <input
                        id="cf-name"
                        type="text"
                        autoComplete="name"
                        placeholder="Ваше ім'я"
                        aria-label="Ваше ім'я"
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

                    <div className="flex flex-col gap-1.5">
                      <input
                        id="cf-phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="Номер телефону"
                        aria-label="Номер телефону"
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
                  </div>

                  {status === 'error' && serverError && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="flex items-start gap-2 px-4 py-3 rounded-lg bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/25 text-sm text-[var(--color-destructive)]"
                    >
                      <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                      {serverError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    aria-busy={status === 'loading'}
                    className="inline-flex items-center justify-center gap-2 h-12 w-full text-sm font-bold uppercase tracking-wider rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent-hover)] active:scale-[0.99] disabled:opacity-55 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-150 shadow-[0_4px_16px_0_rgba(244,184,21,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141517]"
                  >
                    {status === 'loading' ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin" aria-hidden="true" />
                        Надсилаємо…
                      </>
                    ) : (
                      'Надіслати запит'
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
