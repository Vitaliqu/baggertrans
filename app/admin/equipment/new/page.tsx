'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { EquipmentForm } from '@/components/admin/equipment-form';

export default function NewEquipmentPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Назад
        </button>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Додати техніку</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Заповніть усі необхідні поля
        </p>
      </div>

      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 shadow-sm">
        <EquipmentForm
          onSuccess={() => router.push('/admin/equipment')}
          onCancel={() => router.push('/admin/equipment')}
        />
      </div>
    </div>
  );
}
