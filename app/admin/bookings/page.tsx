'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { getBookings, updateBookingStatus } from '@/lib/firebase/bookings';
import type { Booking, BookingStatus } from '@/types';
import { BOOKING_STATUS_LABELS } from '@/types';
import { BookingsTable } from '@/components/admin/bookings-table';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

type TabStatus = 'all' | BookingStatus;

const TABS: { label: string; value: TabStatus }[] = [
  { label: 'Всі', value: 'all' },
  { label: 'Нові', value: 'new' },
  { label: 'Підтверджені', value: 'confirmed' },
  { label: 'Виконані', value: 'completed' },
  { label: 'Скасовані', value: 'cancelled' },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabStatus>('all');

  async function load() {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const countByStatus = useMemo(() => {
    return bookings.reduce<Record<string, number>>((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {});
  }, [bookings]);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return bookings;
    return bookings.filter((b) => b.status === activeTab);
  }, [bookings, activeTab]);

  async function handleStatusChange(id: string, status: BookingStatus, comment?: string) {
    await updateBookingStatus(id, status, comment);
    await load();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Бронювання</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {bookings.length} бронювань у системі
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap border-b border-[var(--color-border)]">
        {TABS.map((tab) => {
          const count = tab.value === 'all' ? bookings.length : (countByStatus[tab.value] ?? 0);
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
                activeTab === tab.value
                  ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border)]'
              )}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={cn(
                    'inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold px-1',
                    activeTab === tab.value
                      ? 'bg-[var(--color-accent)] text-[var(--color-primary)]'
                      : 'bg-[var(--color-border)] text-[var(--color-text-muted)]'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Spinner size="lg" />
        </div>
      ) : (
        <BookingsTable bookings={filtered} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
