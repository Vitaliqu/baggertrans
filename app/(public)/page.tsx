export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { getEquipment } from '@/lib/firebase/equipment';
import { Hero } from '@/components/home/hero';
import { Advantages } from '@/components/home/advantages';
import { PopularEquipment } from '@/components/home/popular-equipment';
import { Testimonials } from '@/components/home/testimonials';
import { ContactForm } from '@/components/home/contact-form';
import type { Equipment } from '@/types';

export const metadata: Metadata = {
  title: 'Baggertrans — Оренда будівельної техніки',
  description:
    'Оренда будівельної техніки в Україні: екскаватори, самоскиди, навантажувачі, телескопічні маніпулятори та інше. Великий парк техніки, досвідчені оператори, швидка подача на об\'єкт.',
};

export default async function HomePage() {
  let featured: Equipment[] = [];
  try {
    featured = await getEquipment({ featured: true, limitCount: 4 });
    if (featured.length === 0) {
      featured = await getEquipment({ limitCount: 4 });
    }
  } catch {
    // section degrades gracefully to placeholder cards
  }

  return (
    <>
      <Hero />
      <PopularEquipment equipment={featured} />
      <Advantages />
      <Testimonials />
      <ContactForm />
    </>
  );
}
