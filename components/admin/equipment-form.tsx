'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { equipmentSchema, type EquipmentFormValues } from '@/lib/validations/equipment';
import { createEquipment, updateEquipment } from '@/lib/firebase/equipment';
import type { Equipment } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EquipmentFormProps {
  equipment?: Equipment;
  onSuccess: () => void;
  onCancel: () => void;
}

interface SpecPair {
  key: string;
  value: string;
}

export function EquipmentForm({ equipment, onSuccess, onCancel }: EquipmentFormProps) {
  const isEdit = !!equipment;

  const initialSpecs: SpecPair[] = equipment
    ? Object.entries(equipment.specs).map(([key, value]) => ({ key, value }))
    : [];

  const initialImages: string[] = equipment?.images.slice(0, 5) ?? [''];

  const [specs, setSpecs] = useState<SpecPair[]>(initialSpecs);
  const [images, setImages] = useState<string[]>(initialImages.length ? initialImages : ['']);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: equipment?.name ?? '',
      nameUk: equipment?.nameUk ?? '',
      category: equipment?.category ?? 'excavators',
      description: equipment?.description ?? '',
      pricePerDay: equipment?.pricePerDay ?? 0,
      pricePerWeek: equipment?.pricePerWeek,
      pricePerMonth: equipment?.pricePerMonth,
      status: equipment?.status ?? 'available',
      featured: equipment?.featured ?? false,
      specs: equipment?.specs ?? {},
    },
  });

  function addSpec() {
    setSpecs((prev) => [...prev, { key: '', value: '' }]);
  }

  function removeSpec(index: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSpec(index: number, field: 'key' | 'value', val: string) {
    setSpecs((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: val } : s)));
  }

  function addImage() {
    if (images.length < 5) setImages((prev) => [...prev, '']);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function updateImage(index: number, val: string) {
    setImages((prev) => prev.map((img, i) => (i === index ? val : img)));
  }

  async function onSubmit(data: EquipmentFormValues) {
    setServerError(null);
    const specsRecord: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim()) specsRecord[s.key.trim()] = s.value;
    });
    const filteredImages = images.filter((url) => url.trim() !== '');

    const payload = {
      ...data,
      specs: specsRecord,
      images: filteredImages,
    };

    try {
      if (isEdit && equipment) {
        await updateEquipment(equipment.id, payload);
      } else {
        await createEquipment(payload);
      }
      onSuccess();
    } catch {
      setServerError('Помилка збереження. Перевірте підключення та спробуйте ще раз.');
    }
  }

  const fieldClass = 'h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all';
  const labelClass = 'block text-xs font-medium text-[var(--color-text-muted)] mb-1';
  const errorClass = 'text-xs text-[var(--color-destructive)] mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {serverError && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-600">{serverError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Назва (EN)</label>
          <input {...register('name')} className={fieldClass} placeholder="Excavator CAT 320" />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Назва (UK)</label>
          <input {...register('nameUk')} className={fieldClass} placeholder="Екскаватор CAT 320" />
          {errors.nameUk && <p className={errorClass}>{errors.nameUk.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Категорія</label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <select {...field} className={fieldClass}>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Статус</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select {...field} className={fieldClass}>
                <option value="available">Доступна</option>
                <option value="rented">Орендована</option>
                <option value="maintenance">Обслуговування</option>
              </select>
            )}
          />
          {errors.status && <p className={errorClass}>{errors.status.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Опис</label>
        <textarea
          {...register('description')}
          rows={4}
          placeholder="Детальний опис техніки..."
          className={cn(fieldClass, 'h-auto resize-y py-2')}
        />
        {errors.description && <p className={errorClass}>{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Ціна/день (грн)</label>
          <input
            type="number"
            min={1}
            {...register('pricePerDay', { valueAsNumber: true })}
            className={fieldClass}
            placeholder="1000"
          />
          {errors.pricePerDay && <p className={errorClass}>{errors.pricePerDay.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Ціна/тиждень (грн)</label>
          <input
            type="number"
            min={1}
            {...register('pricePerWeek', { valueAsNumber: true, setValueAs: (v) => v === '' || isNaN(Number(v)) ? undefined : Number(v) })}
            className={fieldClass}
            placeholder="6000"
          />
        </div>
        <div>
          <label className={labelClass}>Ціна/місяць (грн)</label>
          <input
            type="number"
            min={1}
            {...register('pricePerMonth', { valueAsNumber: true, setValueAs: (v) => v === '' || isNaN(Number(v)) ? undefined : Number(v) })}
            className={fieldClass}
            placeholder="20000"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Controller
          name="featured"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              id="featured"
              checked={field.value}
              onChange={field.onChange}
              className="w-4 h-4 rounded border-[var(--color-border)] accent-[var(--color-accent)]"
            />
          )}
        />
        <label htmlFor="featured" className="text-sm text-[var(--color-text)] cursor-pointer select-none">
          Показати на головній (Featured)
        </label>
      </div>

      {/* Images */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={cn(labelClass, 'mb-0')}>Зображення (URL, до 5)</label>
          {images.length < 5 && (
            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline"
            >
              <Plus size={12} />
              Додати
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {images.map((img, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="url"
                value={img}
                onChange={(e) => updateImage(idx, e.target.value)}
                placeholder={`https://example.com/image${idx + 1}.jpg`}
                className={cn(fieldClass, 'flex-1')}
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="flex items-center justify-center w-10 h-10 rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-destructive)] hover:border-[var(--color-destructive)] transition-colors shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Specs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={cn(labelClass, 'mb-0')}>Характеристики</label>
          <button
            type="button"
            onClick={addSpec}
            className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline"
          >
            <Plus size={12} />
            Додати
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {specs.length === 0 && (
            <p className="text-xs text-[var(--color-text-muted)] py-2">
              Немає характеристик. Натисніть "Додати".
            </p>
          )}
          {specs.map((spec, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={spec.key}
                onChange={(e) => updateSpec(idx, 'key', e.target.value)}
                placeholder="Параметр (напр. Вага)"
                className={cn(fieldClass, 'flex-1')}
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => updateSpec(idx, 'value', e.target.value)}
                placeholder="Значення (напр. 20 т)"
                className={cn(fieldClass, 'flex-1')}
              />
              <button
                type="button"
                onClick={() => removeSpec(idx)}
                className="flex items-center justify-center w-10 h-10 rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-destructive)] hover:border-[var(--color-destructive)] transition-colors shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2 border-t border-[var(--color-border)]">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Скасувати
        </Button>
        <Button type="submit" loading={isSubmitting} className="flex-1">
          {isEdit ? 'Зберегти зміни' : 'Додати техніку'}
        </Button>
      </div>
    </form>
  );
}
