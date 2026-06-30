'use client';

import { AuthContext, useAuthState } from '@/lib/hooks/use-auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = useAuthState();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
