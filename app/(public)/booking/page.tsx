export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { BookingPageClient } from '@/components/booking/booking-page-client';
import { getEquipment } from '@/lib/firebase/equipment';
import type { Equipment } from '@/types';

export const metadata: Metadata = {
  title: 'Бронювання техніки — Baggertrans',
  description: 'Забронюйте будівельну техніку онлайн. Екскаватори, самоскиди, навантажувачі та інша техніка в оренду.',
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ equipment?: string }>;
}) {
  const { equipment: preselectedId } = await searchParams;
  let equipment: Equipment[] = [];
  try {
    equipment = await getEquipment({ status: 'available' });
  } catch {
    // Silently fall back to empty list
  }
  return <BookingPageClient equipment={equipment} preselectedId={preselectedId} />;
}
