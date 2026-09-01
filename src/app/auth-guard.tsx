"use client";

import { type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const publicRoutes = ["/login", "/register", "/forgot-password", "/face-verify"];
const authOnlyRoutes = ["/login", "/register", "/forgot-password"];

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading, faceVerified } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading) setReady(true);
  }, [loading]);

  useEffect(() => {
    if (!ready) return;

    if (!user) {
      const isPublic = publicRoutes.some((route) => pathname.startsWith(route)) || pathname === "/";
      if (!isPublic && pathname !== "/") {
        router.replace("/login");
      }
    } else {
      const isAuthOnly = authOnlyRoutes.some((route) => pathname.startsWith(route));
      if (isAuthOnly && faceVerified) {
        router.replace("/dashboard");
        return;
      }
      if (!faceVerified && !pathname.startsWith("/face-verify")) {
        router.replace("/face-verify");
        return;
      }
      if (faceVerified && (pathname === "/" || pathname === "/login" || pathname === "/register" || pathname === "/forgot-password")) {
        router.replace("/dashboard");
        return;
      }
    }
  }, [user, loading, faceVerified, ready, router, pathname]);

  if (!ready || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-violet-300 font-medium">Loading FaceTrack AI...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    const isPublic = publicRoutes.some((route) => pathname.startsWith(route)) || pathname === "/";
    if (!isPublic) return null;
  }

  if (user && !faceVerified) {
    if (!pathname.startsWith("/face-verify") && !pathname.startsWith("/login") && !pathname.startsWith("/register") && !pathname.startsWith("/forgot-password")) {
      return null;
    }
  }

  return <>{children}</>;
}