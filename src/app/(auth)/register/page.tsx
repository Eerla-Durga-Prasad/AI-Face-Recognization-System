"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "admin" | "teacher" | "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { signUp, user, faceVerified } = useAuth();
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
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        role: formData.role,
      });

      if (error) {
        console.error("Supabase Auth Sign Up Error:", {
          message: error.message,
          name: error.name,
          status: error.status,
          code: error.code,
        });

        let msg = error.message;
        if (!msg || msg === "{}") {
          if (error.status === 500) {
            msg = "Database error saving new user. (The Supabase handle_new_user database trigger failed to insert the profile).";
          } else if (error.name === "AuthRetryableFetchError" || error.message?.includes("Failed to fetch")) {
            msg = "Network error: Unable to reach the Supabase Auth server (ERR_NAME_NOT_RESOLVED or blocked).";
          } else {
            msg = error.name || "Failed to create account";
          }
        }
        setError(msg);
      } else if (data?.user && !data?.session) {
        setSuccessMessage("Registration successful! Please check your email inbox to confirm your account before signing in.");
      } else {
        router.push("/face-verify");
      }
    } catch (err: any) {
      console.error("Unexpected signup error:", err);
      setError(err?.message || "An unexpected error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950 p-4 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
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

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-xs font-medium mb-6">
            <UserPlus className="h-3 w-3" />
            Create Account
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Get Started
          </h1>
          <p className="text-gray-400">
            Join FaceTrack AI today
          </p>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/30">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm leading-relaxed">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm leading-relaxed">
                {successMessage}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all"
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all"
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["student", "teacher", "admin"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role as any })}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium capitalize transition-all border",
                      formData.role === role
                        ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/25"
                        : "bg-white/[0.03] border-white/10 text-gray-300 hover:border-violet-500/50 hover:text-white"
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-violet-500/25"
              loading={loading}
            >
              Create Account
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
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