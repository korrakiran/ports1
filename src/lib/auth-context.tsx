'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useRouter } from 'next/navigation';
import type { PublicUser } from '@shared/types';
import { ApiError, authApi } from './api';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface AuthState {
  user: PublicUser | null;
  /** True until the initial session check resolves — guards against flashing
   *  the signed-out UI to a user who is in fact signed in. */
  loading: boolean;
  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Session persistence: the cookie is httpOnly, so the only way to know whether
  // one is valid is to ask the server on mount.
  useEffect(() => {
    let cancelled = false;

    authApi
      .me()
      .then(({ user: me }) => {
        if (!cancelled) setUser(me);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const { user: created } = await authApi.signup(name, email, password);
    setUser(created);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: loggedIn } = await authApi.login(email, password);
    setUser(loggedIn);
  }, []);

  const googleLogin = useCallback(async (idToken: string) => {
    const { user: loggedIn } = await authApi.googleLogin(idToken);
    setUser(loggedIn);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Clearing local state matters more than the network call succeeding.
    }
    setUser(null);
    router.push('/');
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, signup, login, googleLogin, logout }),
    [user, loading, signup, login, googleLogin, logout]
  );

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '154628435729-pbamo5ktlta3rnk5ru4nhejijm9kv26q.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>.');
  return ctx;
}

/** Redirects to login when the session check finishes with no user. */
export function useRequireAuth(): { user: PublicUser | null; loading: boolean } {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  return { user, loading };
}

export { ApiError };
