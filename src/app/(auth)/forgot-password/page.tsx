"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Mail, ShieldCheck, CheckCircle, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "An error occurred");
      } else {
        setSuccess(true);
        toast.success("Reset link sent!");
      }
    } catch {
      setError("An unexpected error occurred");
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
            <ShieldCheck className="h-3 w-3" />
            Password Reset
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Reset Password
          </h1>
          <p className="text-gray-400">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/30">
          {success ? (
            <div className="text-center py-8 animate-scale-in">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Check Your Email
              </h3>
              <p className="text-gray-400 mb-6">
                We&apos;ve sent a password reset link to{" "}
                <span className="text-violet-300 font-medium">{email}</span>
              </p>
              <Link href="/login">
                <Button variant="primary" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-400 text-xs font-bold">!</span>
                  </div>
                  {error}
                </div>
              )}

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
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-lg shadow-violet-500/25"
                loading={loading}
              >
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-400">
              Remember your password?{" "}
              <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}