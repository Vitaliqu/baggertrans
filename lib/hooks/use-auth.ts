'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import type { User } from 'firebase/auth';
import { onAuthChange, getUserProfile } from '@/lib/firebase/auth';
import type { UserProfile } from '@/types';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthState(): AuthContextValue {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        const p = await getUserProfile(u.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return { user, profile, loading, isAdmin: profile?.role === 'admin' };
}
