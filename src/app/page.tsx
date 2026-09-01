"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  Users,
  Camera,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  CheckCircle2,
  Star,
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center animate-pulse">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav
        className={cn(
          "fixed w-full z-50 transition-all duration-300",
          scrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:border-gray-800"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/25">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                FaceTrack AI
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">
                How It Works
              </a>
              <a href="#about" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">
                About
              </a>
              <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">
                Sign In
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#about" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>About</a>
              <Link href="/login" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-indigo-50 to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-semibold mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              AI-Powered Attendance System
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-6 animate-slide-up">
              Smart Attendance,
              <br />
              <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 bg-clip-text text-transparent">
                Zero Effort
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Revolutionize your classroom with AI-powered facial recognition.
              Mark attendance in seconds, eliminate proxy calls, and gain
              actionable insights with FaceTrack AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto group shadow-xl shadow-primary-500/25">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto border-gray-200 dark:border-gray-700">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500 dark:text-gray-400 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Free tier available
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Secure & private
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 relative animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-3xl blur-2xl" />
            <div className="relative glass-card rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl text-white">
                    <Camera className="h-5 w-5" />
                  </div>
                </div>
                <div className="w-20" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: "Alice", initial: "A", color: "from-primary-400 to-accent-400" },
                  { name: "Bob", initial: "B", color: "from-emerald-400 to-teal-400" },
                  { name: "Carol", initial: "C", color: "from-amber-400 to-orange-400" },
                  { name: "Dave", initial: "D", color: "from-violet-400 to-purple-400" },
                  { name: "Eve", initial: "E", color: "from-rose-400 to-pink-400" },
                  { name: "Frank", initial: "F", color: "from-cyan-400 to-blue-400" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center hover:scale-105 transition-transform duration-300"
                  >
                    <div className="text-center">
                      <div className={cn("w-10 h-10 bg-gradient-to-br", s.color, "rounded-full mx-auto mb-1.5 flex items-center justify-center text-white font-bold text-sm")}>
                        {s.initial}
                      </div>
                      <span className="text-[10px] text-gray-400">{s.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-12 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Students Tracked", icon: <Users className="h-6 w-6" /> },
              { value: "99.2%", label: "Recognition Accuracy", icon: <ShieldCheck className="h-6 w-6" /> },
              { value: "500+", label: "Institutions", icon: <Globe className="h-6 w-6" /> },
              { value: "24/7", label: "Support", icon: <Zap className="h-6 w-6" /> },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-2xl mb-3">
                  <span className="text-primary-600 dark:text-primary-400">{stat.icon}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage attendance efficiently with cutting-edge AI technology
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Camera className="h-8 w-8" />,
                title: "Real-time Recognition",
                description: "Advanced facial recognition that works in real-time with 99.2% accuracy",
                color: "from-primary-500 to-cyan-500",
              },
              {
                icon: <ShieldCheck className="h-8 w-8" />,
                title: "Anti-Spoofing",
                description: "Advanced liveness detection prevents photo and screen spoofing",
                color: "from-emerald-500 to-teal-500",
              },
              {
                icon: <BarChart3 className="h-8 w-8" />,
                title: "Analytics Dashboard",
                description: "Comprehensive analytics with beautiful charts and insights",
                color: "from-violet-500 to-purple-500",
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: "Attendance Tracking",
                description: "Track attendance patterns and identify trends easily",
                color: "from-amber-500 to-orange-500",
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Instant Reports",
                description: "Generate PDF and Excel reports with a single click",
                color: "from-rose-500 to-pink-500",
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Multi-Role Support",
                description: "Separate dashboards for Admin, Teachers, and Students",
                color: "from-blue-500 to-indigo-500",
              },
            ].map((feature, i) => (
              <Card key={i} hover className="group">
                <div className={cn("text-white mb-4 p-3 rounded-xl bg-gradient-to-br", feature.color, "group-hover:scale-110 transition-transform duration-300")}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Three simple steps to automate your attendance management
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 rounded-full" />
            {[
              {
                step: "01",
                title: "Register Students",
                description: "Add student details with photos. Our AI captures face embeddings automatically for future recognition.",
              },
              {
                step: "02",
                title: "Start Scanner",
                description: "Open webcam in class. The system recognizes faces and marks attendance automatically in real-time.",
              },
              {
                step: "03",
                title: "Analyze Data",
                description: "View detailed reports, attendance percentages, and export data anytime from your dashboard.",
              },
            ].map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full text-white text-xl font-bold mb-6 relative z-10 shadow-lg shadow-primary-500/25">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About College Section */}
      <section id="about" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                About Our College
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                FaceTrack AI is deployed across our institution to streamline attendance management.
                Our AI-powered system eliminates manual attendance taking, reduces errors, and provides
                valuable insights into student participation and engagement.
              </p>
              <div className="space-y-4">
                {[
                  "AI-powered facial recognition for automatic attendance",
                  "Real-time monitoring and instant notifications",
                  "Comprehensive analytics and reporting",
                  "Secure and privacy-compliant data handling",
                  "Mobile-responsive design for all devices",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-3xl blur-2xl" />
              <div className="relative glass-card rounded-3xl p-8 shadow-xl">
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white">
                      <Users className="h-10 w-10" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">College Campus</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-white dark:bg-gray-800">
                    <p className="text-2xl font-bold text-primary-600">5</p>
                    <p className="text-xs text-gray-500">Departments</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white dark:bg-gray-800">
                    <p className="text-2xl font-bold text-accent-600">98%</p>
                    <p className="text-xs text-gray-500">Accuracy</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white dark:bg-gray-800">
                    <p className="text-2xl font-bold text-emerald-600">24/7</p>
                    <p className="text-xs text-gray-500">Monitoring</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center bg-gradient-to-r from-primary-600 to-accent-600 border-0 text-white p-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Transform Your Attendance System?
            </h2>
            <p className="text-xl mb-8 text-white/80">
              Join thousands of institutions using FaceTrack AI for smarter attendance management
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-gray-100 shadow-lg w-full sm:w-auto"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white border-2 border-white/30 hover:bg-white/10 w-full sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  FaceTrack AI
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI-powered student attendance management system built for the future of education.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <a href="#" className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-primary-600 transition-colors" aria-label="Facebook">
                  <FaFacebook className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-primary-600 transition-colors" aria-label="Twitter">
                  <FaTwitter className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-primary-600 transition-colors" aria-label="LinkedIn">
                  <FaLinkedin className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-primary-600 transition-colors" aria-label="Instagram">
                  <FaInstagram className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><a href="#features" className="hover:text-primary-600 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-primary-600 transition-colors">How It Works</a></li>
                <li><a href="#about" className="hover:text-primary-600 transition-colors">About</a></li>
                <li><Link href="/login" className="hover:text-primary-600 transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><a href="#" className="hover:text-primary-600 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Campus Address</li>
                <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 234 567 890</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@facetrack.ai</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 FaceTrack AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
