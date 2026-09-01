"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ShieldCheck,
  FileText,
  GraduationCap,
  Settings,
  Bell,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  UserCircle,
  ChevronDown,
  Home,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/students", icon: Users },
  { name: "Attendance", href: "/attendance", icon: CalendarCheck },
  { name: "Face Recognition", href: "/face-recognition", icon: ShieldCheck },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Departments", href: "/departments", icon: GraduationCap },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, signOut, faceVerified } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && user && !faceVerified) {
      router.push("/face-verify");
    }
  }, [user, loading, faceVerified, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-violet-300 font-medium">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const firstName = profile?.full_name?.split(" ")[0] || "User";

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-x-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#0d0d1a]/90 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              FaceTrack AI
            </span>
            <button
              className="ml-auto md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-violet-500/10 text-violet-300 shadow-sm shadow-violet-500/5"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive
                        ? "text-violet-400"
                        : "text-gray-500 group-hover:text-gray-300"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User menu */}
          <div className="p-4 border-t border-white/5">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <Avatar name={profile?.full_name || "User"} size="sm" />
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {profile?.full_name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize truncate">
                    {profile?.role}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
              </button>

              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                  <Link
                    href="/profile"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setSidebarOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm text-gray-300 transition-colors"
                  >
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-sm text-red-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="md:pl-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-4 py-3 md:px-8">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-gray-300" />
            </button>

            {/* Back to Home */}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl hover:bg-white/[0.08] transition-colors text-sm text-gray-400 hover:text-white"
            >
              <Home className="h-4 w-4" />
              <span className="hidden md:inline">Home</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 mx-4 hidden md:block max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    setUserMenuOpen(false);
                  }}
                  className="relative p-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Bell className="h-5 w-5 text-gray-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full" />
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                    <div className="p-4 border-b border-white/5">
                      <p className="text-sm font-semibold text-white">Notifications</p>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03]">
                        <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                          <ShieldCheck className="h-4 w-4 text-violet-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-white truncate">Face verification completed</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03]">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <Users className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-white truncate">New student registered</p>
                          <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03]">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-4 w-4 text-amber-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-white truncate">Monthly report generated</p>
                          <p className="text-xs text-gray-500">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotifOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Avatar name={profile?.full_name || "User"} size="sm" />
                  <span className="hidden sm:block text-sm font-medium text-gray-300 max-w-[100px] truncate">
                    {firstName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                    <div className="p-3 border-b border-white/5">
                      <p className="text-sm font-medium text-white">{profile?.full_name}</p>
                      <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setSidebarOpen(false);
                      }}
                      className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleSignOut();
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}