"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: any | null;
  faceVerified: boolean;
  signIn: (email: string, password: string) => Promise<{ data?: any; error: any }>;
  signUp: (email: string, password: string, metadata: any) => Promise<{ data?: any; error: any }>;
  signOut: () => Promise<void>;
  setFaceVerified: (verified: boolean) => void;
}

const STORAGE_KEY = "facetrack_face_verified";

function getStoredFaceVerified(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function setStoredFaceVerified(value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (value) {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  profile: null,
  faceVerified: false,
  signIn: async () => ({ data: null, error: null }),
  signUp: async () => ({ data: null, error: null }),
  signOut: async () => {},
  setFaceVerified: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [faceVerified, setFaceVerifiedState] = useState(false);

  useEffect(() => {
    setFaceVerifiedState(getStoredFaceVerified());
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(data);
      }

      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(data);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (err: any) {
      return { data: null, error: err };
    }
  };

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      return { data, error };
    } catch (err: any) {
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setFaceVerifiedState(false);
    setStoredFaceVerified(false);
  };

  const setFaceVerified = (verified: boolean) => {
    setFaceVerifiedState(verified);
    setStoredFaceVerified(verified);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        profile,
        faceVerified,
        signIn,
        signUp,
        signOut,
        setFaceVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
