'use client';

import React, { useEffect, useState } from 'react';
import { Package, CheckCircle, Clock, CalendarDays } from 'lucide-react';
import { getEquipment } from '@/lib/firebase/equipment';
import { getBookings } from '@/lib/firebase/bookings';
import type { Equipment, Booking } from '@/types';
import { StatCard } from '@/components/admin/stat-card';
import { BookingStatusBadge } from '@/components/admin/status-badge';
import { Spinner } from '@/components/ui/spinner';
import { formatDate, formatPrice } from '@/lib/utils';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const availableCount = equipment.filter((e) => e.status === 'available').length;
  const rentedCount = equipment.filter((e) => e.status === 'rented').length;
  const maintenanceCount = equipment.filter((e) => e.status === 'maintenance').length;
  const newBookings = bookings.filter((b) => b.status === 'new').length;
  const last5Bookings = bookings.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Дашборд</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Огляд стану системи</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Всього техніки"
          value={equipment.length}
          icon={Package}
          color="navy"
        />
        <StatCard
          title="Доступна техніка"
          value={availableCount}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Нові бронювання"
          value={newBookings}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Всього бронювань"
          value={bookings.length}
          icon={CalendarDays}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Last 5 bookings */}
        <div className="xl:col-span-2 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Останні бронювання</h2>
          </div>
          <div className="overflow-x-auto">
            {last5Bookings.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] px-5 py-8 text-center">
                Бронювань ще немає
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                      Клієнт
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                      Техніка
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide hidden md:table-cell">
                      Дати
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                      Статус
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {last5Bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg)] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-[var(--color-text)]">{booking.clientName}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{booking.clientPhone}</p>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text)] max-w-[140px]">
                        <span className="truncate block">{booking.equipmentName}</span>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)] hidden md:table-cell whitespace-nowrap">
                        {formatDate(booking.startDate)} — {formatDate(booking.endDate)}
                      </td>
                      <td className="px-4 py-3">
                        <BookingStatusBadge status={booking.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Equipment health */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Стан техніки</h2>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[var(--color-success)] shrink-0" />
                <span className="text-sm text-[var(--color-text)]">Доступна</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--color-text)]">{availableCount}</span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  ({equipment.length > 0 ? Math.round((availableCount / equipment.length) * 100) : 0}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[var(--color-accent)] shrink-0" />
                <span className="text-sm text-[var(--color-text)]">Орендована</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--color-text)]">{rentedCount}</span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  ({equipment.length > 0 ? Math.round((rentedCount / equipment.length) * 100) : 0}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-slate-400 shrink-0" />
                <span className="text-sm text-[var(--color-text)]">Обслуговування</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--color-text)]">{maintenanceCount}</span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  ({equipment.length > 0 ? Math.round((maintenanceCount / equipment.length) * 100) : 0}%)
                </span>
              </div>
            </div>

            {equipment.length > 0 && (
              <div className="mt-2 h-2.5 rounded-full bg-[var(--color-border)] overflow-hidden flex">
                {availableCount > 0 && (
                  <div
                    className="h-full bg-[var(--color-success)] transition-all"
                    style={{ width: `${(availableCount / equipment.length) * 100}%` }}
                  />
                )}
                {rentedCount > 0 && (
                  <div
                    className="h-full bg-[var(--color-accent)] transition-all"
                    style={{ width: `${(rentedCount / equipment.length) * 100}%` }}
                  />
                )}
                {maintenanceCount > 0 && (
                  <div
                    className="h-full bg-slate-400 transition-all"
                    style={{ width: `${(maintenanceCount / equipment.length) * 100}%` }}
                  />
                )}
              </div>
            )}

            <div className="pt-2 border-t border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-muted)]">
                Загальна вартість оренди (нові бронювання)
              </p>
              <p className="text-lg font-bold text-[var(--color-text)] mt-1">
                {formatPrice(
                  bookings
                    .filter((b) => b.status === 'new' || b.status === 'confirmed')
                    .reduce((sum, b) => sum + b.totalPrice, 0)
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
