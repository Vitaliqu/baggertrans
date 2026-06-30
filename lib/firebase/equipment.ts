import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import type { Equipment, EquipmentCategory, EquipmentStatus } from '@/types';

const COLLECTION = 'equipment';

function fromFirestore(id: string, data: Record<string, unknown>): Equipment {
  return {
    id,
    name: data.name as string,
    nameUk: data.nameUk as string,
    category: data.category as EquipmentCategory,
    description: data.description as string,
    images: (data.images as string[]) || [],
    specs: (data.specs as Record<string, string>) || {},
    pricePerDay: data.pricePerDay as number,
    pricePerWeek: data.pricePerWeek as number | undefined,
    pricePerMonth: data.pricePerMonth as number | undefined,
    status: data.status as EquipmentStatus,
    featured: Boolean(data.featured),
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  };
}

export async function getEquipment(filters?: {
  category?: EquipmentCategory;
  status?: EquipmentStatus;
  featured?: boolean;
  limitCount?: number;
}): Promise<Equipment[]> {
  const constraints: QueryConstraint[] = [];
  const hasWhereFilter = !!(filters?.category || filters?.status || filters?.featured !== undefined);

  if (filters?.category) constraints.push(where('category', '==', filters.category));
  if (filters?.status) constraints.push(where('status', '==', filters.status));
  if (filters?.featured !== undefined) constraints.push(where('featured', '==', filters.featured));

  // ORDER BY on a different field than WHERE requires a composite Firestore index.
  // Apply server-side ordering only when there are no WHERE clauses; otherwise sort client-side.
  if (!hasWhereFilter) {
    constraints.push(orderBy('createdAt', 'desc'));
    if (filters?.limitCount) constraints.push(limit(filters.limitCount));
  }

  const q = query(collection(db, COLLECTION), ...constraints);
  const snap = await getDocs(q);
  let results = snap.docs.map((d) => fromFirestore(d.id, d.data()));

  if (hasWhereFilter) {
    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    if (filters?.limitCount) results = results.slice(0, filters.limitCount);
  }

  return results;
}

export async function getEquipmentById(id: string): Promise<Equipment | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return fromFirestore(snap.id, snap.data());
}

export async function createEquipment(data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return ref.id;
}

export async function updateEquipment(id: string, data: Partial<Omit<Equipment, 'id' | 'createdAt'>>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteEquipment(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
