export type EquipmentCategory =
  | 'excavators'
  | 'dump_trucks'
  | 'mini_excavators'
  | 'loaders'
  | 'telehandlers'
  | 'bulldozers'
  | 'cranes'
  | 'compactors'
  | 'other';

export type EquipmentStatus = 'available' | 'rented' | 'maintenance';

export type BookingStatus = 'new' | 'confirmed' | 'completed' | 'cancelled';

export interface Equipment {
  id: string;
  name: string;
  nameUk: string;
  category: EquipmentCategory;
  description: string;
  images: string[];
  specs: Record<string, string>;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  status: EquipmentStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  company?: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalPrice: number;
  status: BookingStatus;
  additionalServices: string[];
  notes?: string;
  adminComment?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactForm {
  name: string;
  phone: string;
  email?: string;
  message: string;
}

export interface BookingForm {
  equipmentId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  company?: string;
  startDate: string;
  endDate: string;
  additionalServices: string[];
  notes?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
  role: 'user' | 'admin';
  favorites: string[];
  createdAt: Date;
}

export const CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  excavators: 'Екскаватори',
  dump_trucks: 'Самоскиди',
  mini_excavators: 'Міні-екскаватори',
  loaders: 'Навантажувачі',
  telehandlers: 'Телескопічні маніпулятори',
  bulldozers: 'Бульдозери',
  cranes: 'Крани',
  compactors: 'Котки та ущільнювачі',
  other: 'Інша техніка',
};

export const ADDITIONAL_SERVICES = [
  { id: 'transport', label: 'Доставка техніки' },
  { id: 'operator', label: 'Оператор/Машиніст' },
  { id: 'fuel', label: 'Паливо' },
  { id: 'insurance', label: 'Страхування' },
];

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  new: 'Нове',
  confirmed: 'Підтверджено',
  completed: 'Виконано',
  cancelled: 'Скасовано',
};
