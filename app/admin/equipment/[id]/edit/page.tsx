'use client';

import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { EquipmentForm } from '@/components/admin/equipment-form';
import { getEquipmentById } from '@/lib/firebase/equipment';
import type { Equipment } from '@/types';

export default function EditEquipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getEquipmentById(id)
      .then((eq) => {
        if (!eq) setNotFound(true);
        else setEquipment(eq);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !equipment) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-text-muted)]">Техніку не знайдено</p>
        <button onClick={() => router.push('/admin/equipment')} className="mt-4 text-[var(--color-accent)] hover:underline text-sm">
          Повернутись до списку
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Назад
        </button>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Редагувати техніку</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{equipment.nameUk}</p>
      </div>

      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 shadow-sm">
        <EquipmentForm
          equipment={equipment}
          onSuccess={() => router.push('/admin/equipment')}
          onCancel={() => router.push('/admin/equipment')}
        />
      </div>
    </div>
  );
}
