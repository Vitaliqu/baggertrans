import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './config';
import type { UserProfile } from '@/types';

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function signUp(email: string, password: string, displayName: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', cred.user.uid), {
    uid: cred.user.uid,
    email,
    displayName,
    role: 'user',
    favorites: [],
    createdAt: Timestamp.now(),
  });
  return cred;
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid: data.uid,
    email: data.email,
    displayName: data.displayName,
    phone: data.phone,
    role: data.role || 'user',
    favorites: data.favorites || [],
    createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
  };
}

export async function isAdmin(uid: string): Promise<boolean> {
  const profile = await getUserProfile(uid);
  return profile?.role === 'admin';
}

export async function toggleFavorite(uid: string, equipmentId: string): Promise<string[]> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
  const favorites: string[] = snap.data().favorites || [];
  const updated = favorites.includes(equipmentId)
    ? favorites.filter((id) => id !== equipmentId)
    : [...favorites, equipmentId];
  await setDoc(ref, { favorites: updated }, { merge: true });
  return updated;
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
