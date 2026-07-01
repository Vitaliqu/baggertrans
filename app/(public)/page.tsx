export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { getEquipment } from '@/lib/firebase/equipment';
import { Hero } from '@/components/home/hero';
import { ServicesBand } from '@/components/home/services-band';
import { Advantages } from '@/components/home/advantages';
import { PopularEquipment } from '@/components/home/popular-equipment';
import { Directions } from '@/components/home/directions';
import { ContactForm } from '@/components/home/contact-form';
import type { Equipment } from '@/types';

export const metadata: Metadata = {
  title: 'Baggertrans — Продаж та оренда спецтехніки з Європи',
  description:
    'Продаж та оренда спецтехніки з Європи: екскаватори, самоскиди, навантажувачі, телескопічні маніпулятори та інше. Надійна техніка, перевірена якість. Працюємо тільки в Закарпатті.',
};

export default async function HomePage() {
  let featured: Equipment[] = [];
  try {
    featured = await getEquipment({ featured: true, limitCount: 5 });
    if (featured.length === 0) {
      featured = await getEquipment({ limitCount: 5 });
    }
  } catch {
    // section degrades gracefully to placeholder cards
  }

  return (
    <>
      <Hero />
      <PopularEquipment equipment={featured} />
      <Advantages />
      <Directions />
      <ContactForm />
    </>
  );
}
