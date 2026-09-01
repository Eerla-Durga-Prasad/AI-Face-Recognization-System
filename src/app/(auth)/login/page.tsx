"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, user, faceVerified } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && faceVerified) {
      router.replace("/dashboard");
    } else if (user && !faceVerified) {
      router.replace("/face-verify");
    }
  }, [user, faceVerified, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        console.error("Supabase Auth Sign In Error:", {
          message: error.message,
          name: error.name,
          status: error.status,
          code: error.code,
        });

        let msg = error.message;
        if (!msg || msg === "{}") {
          msg = error.name || "Failed to sign in";
        }
        setError(msg);
      } else {
        router.push("/face-verify");
        router.refresh();
      }
    } catch (err: any) {
      console.error("Unexpected signin error:", err);
      setError(err?.message || "An unexpected error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950 p-4 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              FaceTrack AI
            </span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-6">
            <Sparkles className="h-3 w-3" />
            AI-Powered Attendance
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Welcome back
          </h1>
          <p className="text-gray-400">
            Sign in to your FaceTrack AI account
          </p>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 text-xs font-bold">!</span>
                </div>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-violet-500/25 group"
              loading={loading}
            >
              Sign In
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Create one
              </Link>
            </p>
            <div className="mt-3">
              <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600">
            Secure login powered by FaceTrack AI
          </p>
        </div>
      </div>
    </div>
  );
}