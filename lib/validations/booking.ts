import { z } from 'zod';

export const bookingSchema = z.object({
  equipmentId: z.string().min(1, 'Оберіть техніку'),
  clientName: z.string().min(2, "Ім'я має містити мінімум 2 символи"),
  clientPhone: z.string().regex(/^\+?[\d\s\-()]{10,}$/, 'Введіть коректний номер телефону'),
  clientEmail: z.string().email('Введіть коректний email'),
  company: z.string().optional(),
  startDate: z.string().min(1, 'Оберіть дату початку'),
  endDate: z.string().min(1, 'Оберіть дату закінчення'),
  additionalServices: z.array(z.string()),
  notes: z.string().max(500).optional(),
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  { message: 'Дата закінчення має бути після дати початку', path: ['endDate'] }
);

export const contactSchema = z.object({
  name: z.string().min(2, "Ім'я має містити мінімум 2 символи"),
  phone: z.string().regex(/^\+?[\d\s\-()]{10,}$/, 'Введіть коректний номер телефону'),
  email: z.string().email('Введіть коректний email').optional().or(z.literal('')),
  message: z.string().min(10, 'Повідомлення має містити мінімум 10 символів').optional().or(z.literal('')),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
