'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, Check, ChevronDown } from 'lucide-react';
import type { Booking, BookingStatus } from '@/types';
import { BookingStatusBadge } from '@/components/admin/status-badge';
import { Spinner } from '@/components/ui/spinner';
import { formatDate, formatPrice } from '@/lib/utils';

interface BookingsTableProps {
  bookings: Booking[];
  onStatusChange: (id: string, status: BookingStatus, comment?: string) => Promise<void>;
}

export function BookingsTable({ bookings, onStatusChange }: BookingsTableProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelComment, setCancelComment] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleAction(id: string, status: BookingStatus, comment?: string) {
    setLoadingId(id);
    try {
      await onStatusChange(id, status, comment);
      if (status === 'cancelled') {
        setCancellingId(null);
        setCancelComment('');
      }
    } finally {
      setLoadingId(null);
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm flex items-center justify-center h-40 text-sm text-[var(--color-text-muted)]">
        Бронювань не знайдено
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
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
              {bookings.map((booking) => (
                <React.Fragment key={booking.id}>
                  <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg)] transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-[var(--color-text-muted)]">
                        #{booking.id.slice(0, 6)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--color-text)]">{booking.clientName}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{booking.clientPhone}</p>
                      {booking.company && (
                        <p className="text-xs text-[var(--color-text-muted)]">{booking.company}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[var(--color-text)] max-w-[140px] truncate block">
                        {booking.equipmentName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)] whitespace-nowrap">
                      {formatDate(booking.startDate)}
                      <br />
                      {formatDate(booking.endDate)}
                      <span className="text-xs"> ({booking.totalDays} дн.)</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--color-text)] whitespace-nowrap">
                      {formatPrice(booking.totalPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <BookingStatusBadge status={booking.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {booking.status === 'new' && (
                          <button
                            onClick={() => handleAction(booking.id, 'confirmed')}
                            disabled={loadingId === booking.id}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-green-200 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-60 transition-colors whitespace-nowrap"
                          >
                            {loadingId === booking.id ? (
                              <Spinner size="sm" color="#16a34a" />
                            ) : (
                              <CheckCircle size={12} />
                            )}
                            Підтвердити
                          </button>
                        )}
                        {(booking.status === 'new' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => handleAction(booking.id, 'completed')}
                            disabled={loadingId === booking.id}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-blue-200 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-60 transition-colors whitespace-nowrap"
                          >
                            {loadingId === booking.id ? (
                              <Spinner size="sm" color="#2563eb" />
                            ) : (
                              <Check size={12} />
                            )}
                            Виконано
                          </button>
                        )}
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <button
                            onClick={() => {
                              setCancellingId(cancellingId === booking.id ? null : booking.id);
                              setCancelComment('');
                            }}
                            disabled={loadingId === booking.id}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-red-200 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-60 transition-colors whitespace-nowrap"
                          >
                            <XCircle size={12} />
                            Скасувати
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {/* Cancel inline comment */}
                  {cancellingId === booking.id && (
                    <tr className="border-b border-[var(--color-border)] bg-red-50">
                      <td colSpan={7} className="px-4 py-3">
                        <div className="flex flex-col gap-2">
                          <p className="text-xs font-medium text-red-700">
                            Причина скасування (необов&apos;язково):
                          </p>
                          <textarea
                            value={cancelComment}
                            onChange={(e) => setCancelComment(e.target.value)}
                            rows={2}
                            placeholder="Введіть причину..."
                            className="w-full rounded-md border border-red-200 bg-white px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAction(booking.id, 'cancelled', cancelComment || undefined)}
                              disabled={loadingId === booking.id}
                              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[var(--color-destructive)] text-white text-xs font-medium hover:bg-red-700 disabled:opacity-60 transition-colors"
                            >
                              {loadingId === booking.id ? <Spinner size="sm" color="white" /> : null}
                              Підтвердити скасування
                            </button>
                            <button
                              onClick={() => { setCancellingId(null); setCancelComment(''); }}
                              className="px-4 py-1.5 rounded-md border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-muted)] hover:bg-white transition-colors"
                            >
                              Відмінити
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card layout */}
      <div className="flex flex-col gap-3 md:hidden">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <p className="font-semibold text-[var(--color-text)]">{booking.clientName}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{booking.clientPhone}</p>
                {booking.company && (
                  <p className="text-xs text-[var(--color-text-muted)]">{booking.company}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <BookingStatusBadge status={booking.status} />
                <span className="font-mono text-xs text-[var(--color-text-muted)]">
                  #{booking.id.slice(0, 6)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 mb-3 text-sm">
              <p className="text-[var(--color-text)] font-medium">{booking.equipmentName}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {formatDate(booking.startDate)} — {formatDate(booking.endDate)} ({booking.totalDays} дн.)
              </p>
              <p className="font-semibold text-[var(--color-text)]">{formatPrice(booking.totalPrice)}</p>
            </div>

            <div className="flex gap-2 flex-wrap">
              {booking.status === 'new' && (
                <button
                  onClick={() => handleAction(booking.id, 'confirmed')}
                  disabled={loadingId === booking.id}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-green-200 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-60 transition-colors"
                >
                  <CheckCircle size={12} />
                  Підтвердити
                </button>
              )}
              {(booking.status === 'new' || booking.status === 'confirmed') && (
                <button
                  onClick={() => handleAction(booking.id, 'completed')}
                  disabled={loadingId === booking.id}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-blue-200 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-60 transition-colors"
                >
                  <Check size={12} />
                  Виконано
                </button>
              )}
              {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                <button
                  onClick={() => {
                    setCancellingId(cancellingId === booking.id ? null : booking.id);
                    setCancelComment('');
                  }}
                  disabled={loadingId === booking.id}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-red-200 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-60 transition-colors"
                >
                  <XCircle size={12} />
                  Скасувати
                </button>
              )}
            </div>

            {cancellingId === booking.id && (
              <div className="mt-3 flex flex-col gap-2 border-t border-[var(--color-border)] pt-3">
                <p className="text-xs font-medium text-red-700">
                  Причина скасування (необов&apos;язково):
                </p>
                <textarea
                  value={cancelComment}
                  onChange={(e) => setCancelComment(e.target.value)}
                  rows={2}
                  placeholder="Введіть причину..."
                  className="w-full rounded-md border border-red-200 bg-white px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(booking.id, 'cancelled', cancelComment || undefined)}
                    disabled={loadingId === booking.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--color-destructive)] text-white text-xs font-medium hover:bg-red-700 disabled:opacity-60 transition-colors"
                  >
                    {loadingId === booking.id ? <Spinner size="sm" color="white" /> : null}
                    Підтвердити
                  </button>
                  <button
                    onClick={() => { setCancellingId(null); setCancelComment(''); }}
                    className="px-3 py-1.5 rounded-md border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] transition-colors"
                  >
                    Відмінити
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
