export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { getEquipment } from '@/lib/firebase/equipment';
import { CatalogClient } from '@/components/catalog/catalog-client';

export const metadata: Metadata = {
  title: 'Каталог техніки',
  description:
    'Повний каталог будівельної техніки для оренди: екскаватори, самоскиди, навантажувачі, телескопічні маніпулятори та інше.',
};

export default async function CatalogPage() {
  let equipment = [];

  try {
    equipment = await getEquipment();
  } catch (error) {
    console.error('[CatalogPage] Failed to fetch equipment:', error);
    return (
      <div className="container-site py-20 text-center">
        <p className="text-[var(--color-text)] font-medium text-lg mb-2">
          Не вдалося завантажити каталог
        </p>
        <p className="text-[var(--color-text-muted)] text-sm">
          Спробуйте оновити сторінку або зв&apos;яжіться з нами.
        </p>
      </div>
    );
  }

  return <CatalogClient initialEquipment={equipment} />;
}
