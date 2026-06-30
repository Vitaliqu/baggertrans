import { z } from 'zod';

export const equipmentSchema = z.object({
  name: z.string().min(2, 'Назва має містити мінімум 2 символи'),
  nameUk: z.string().min(2, 'Назва (укр) має містити мінімум 2 символи'),
  category: z.enum(['excavators', 'dump_trucks', 'mini_excavators', 'loaders', 'telehandlers', 'bulldozers', 'cranes', 'compactors', 'other']),
  description: z.string().min(20, 'Опис має містити мінімум 20 символів'),
  pricePerDay: z.number().min(1, 'Ціна за день має бути більше 0'),
  pricePerWeek: z.number().optional(),
  pricePerMonth: z.number().optional(),
  status: z.enum(['available', 'rented', 'maintenance']),
  featured: z.boolean(),
  specs: z.record(z.string(), z.string()),
});

export type EquipmentFormValues = z.infer<typeof equipmentSchema>;
