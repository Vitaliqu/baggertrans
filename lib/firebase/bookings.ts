import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import type { Booking, BookingForm, BookingStatus } from '@/types';

const COLLECTION = 'bookings';

function fromFirestore(id: string, data: Record<string, unknown>): Booking {
  return {
    id,
    equipmentId: data.equipmentId as string,
    equipmentName: data.equipmentName as string,
    clientName: data.clientName as string,
    clientPhone: data.clientPhone as string,
    clientEmail: data.clientEmail as string,
    company: data.company as string | undefined,
    startDate: (data.startDate as Timestamp)?.toDate() || new Date(),
    endDate: (data.endDate as Timestamp)?.toDate() || new Date(),
    totalDays: data.totalDays as number,
    totalPrice: data.totalPrice as number,
    status: data.status as BookingStatus,
    additionalServices: (data.additionalServices as string[]) || [],
    notes: data.notes as string | undefined,
    adminComment: data.adminComment as string | undefined,
    userId: data.userId as string | undefined,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  };
}

export async function createBooking(form: BookingForm & { equipmentName: string; totalDays: number; totalPrice: number }): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...form,
    startDate: Timestamp.fromDate(new Date(form.startDate)),
    endDate: Timestamp.fromDate(new Date(form.endDate)),
    status: 'new' as BookingStatus,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return ref.id;
}

export async function getBookings(filters?: {
  status?: BookingStatus;
  equipmentId?: string;
  userId?: string;
}): Promise<Booking[]> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  if (filters?.status) constraints.push(where('status', '==', filters.status));
  if (filters?.equipmentId) constraints.push(where('equipmentId', '==', filters.equipmentId));
  if (filters?.userId) constraints.push(where('userId', '==', filters.userId));

  const q = query(collection(db, COLLECTION), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromFirestore(d.id, d.data()));
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return fromFirestore(snap.id, snap.data());
}

export async function updateBookingStatus(id: string, status: BookingStatus, adminComment?: string): Promise<void> {
  const data: Record<string, unknown> = { status, updatedAt: Timestamp.now() };
  if (adminComment !== undefined) data.adminComment = adminComment;
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function getBookedDatesForEquipment(equipmentId: string): Promise<{ start: Date; end: Date }[]> {
  const q = query(
    collection(db, COLLECTION),
    where('equipmentId', '==', equipmentId),
    where('status', 'in', ['new', 'confirmed'])
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      start: (data.startDate as Timestamp).toDate(),
      end: (data.endDate as Timestamp).toDate(),
    };
  });
}
