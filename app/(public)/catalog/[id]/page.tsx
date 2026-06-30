export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next';
import { ChevronRight } from 'lucide-react';
import { getEquipmentById } from '@/lib/firebase/equipment';
import { EquipmentGallery } from '@/components/equipment/equipment-gallery';
import { EquipmentSpecs } from '@/components/equipment/equipment-specs';
import { BookingInlineForm } from '@/components/equipment/booking-inline-form';
import { CATEGORY_LABELS } from '@/types';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const equipment = await getEquipmentById(id);

  if (!equipment) {
    return { title: 'Техніка не знайдена' };
  }

  const name = equipment.nameUk || equipment.name;
  return {
    title: name,
    description:
      equipment.description ||
      `Оренда: ${name}. Ціна від ${equipment.pricePerDay} грн/день. Baggertrans — оренда будівельної техніки.`,
    openGraph: {
      title: `${name} | Baggertrans`,
      description: equipment.description,
      images: equipment.images[0] ? [{ url: equipment.images[0] }] : [],
    },
  };
}

export default async function EquipmentDetailPage({ params }: Props) {
  const { id } = await params;
  const equipment = await getEquipmentById(id);

  if (!equipment) {
    notFound();
  }

  const name = equipment.nameUk || equipment.name;
  const categoryLabel = CATEGORY_LABELS[equipment.category];
  const isUnavailable = equipment.status === 'rented' || equipment.status === 'maintenance';

  return (
    <div className="container-site py-8 lg:py-12 animate-fade-in">
      {/* Breadcrumbs */}
      <nav aria-label="Навігація" className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] mb-6 flex-wrap">
        <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">
          Головна
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <Link href="/catalog" className="hover:text-[var(--color-accent)] transition-colors">
          Каталог
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span className="text-[var(--color-text)] font-medium truncate max-w-[200px]">{name}</span>
      </nav>

      {/* Back link */}
      <Link
        href="/catalog"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-6"
      >
        <ChevronRight className="w-4 h-4 rotate-180" aria-hidden="true" />
        Повернутись до каталогу
      </Link>

      {/* Category + Name */}
      <div className="mb-6">
        <p className="text-sm font-medium text-[var(--color-accent)] uppercase tracking-wide mb-1">
          {categoryLabel}
        </p>
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--color-text)]">{name}</h1>
      </div>

      {/* Top section: Gallery + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 mb-12">
        {/* Gallery */}
        <EquipmentGallery images={equipment.images} alt={name} />

        {/* Right column: description + specs summary + booking */}
        <div className="flex flex-col gap-6">
          {/* Description */}
          {equipment.description && (
            <div>
              <h2 className="text-base font-semibold text-[var(--color-text)] mb-2">Опис</h2>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {equipment.description}
              </p>
            </div>
          )}

          {/* Inline booking form */}
          <BookingInlineForm
            equipmentId={equipment.id}
            equipmentName={name}
            pricePerDay={equipment.pricePerDay}
            disabled={isUnavailable}
          />
        </div>
      </div>

      {/* Bottom section: full specs + pricing */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8">
        {/* Full specs table */}
        <EquipmentSpecs
          specs={equipment.specs}
          pricePerDay={equipment.pricePerDay}
          pricePerWeek={equipment.pricePerWeek}
          pricePerMonth={equipment.pricePerMonth}
          status={equipment.status}
        />

        {/* Sidebar: additional info */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h3 className="font-bold text-[var(--color-text)] mb-3">Потрібна консультація?</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Наші менеджери допоможуть підібрати техніку під ваші задачі та розрахують вартість.
            </p>
            <Link
              href="/contacts"
              className={`
                inline-flex items-center justify-center gap-2 w-full h-10 px-5 text-sm font-medium rounded-md
                border-2 border-[var(--color-border)] text-[var(--color-text)] bg-transparent
                hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]
                transition-all duration-200
              `}
            >
              Зв&apos;язатися з нами
            </Link>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h3 className="font-bold text-[var(--color-text)] mb-3">Схожа техніка</h3>
            <Link
              href={`/catalog?category=${equipment.category}`}
              className="text-sm text-[var(--color-accent)] hover:underline underline-offset-2"
            >
              Переглянути всі {categoryLabel.toLowerCase()}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
