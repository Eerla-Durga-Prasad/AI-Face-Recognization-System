import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/app/providers";
import AuthGuard from "@/app/auth-guard";
import "./../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FaceTrack AI - Smart Attendance Management",
  description: "AI-powered student attendance management system with real-time facial recognition",
  keywords: ["face recognition", "attendance", "AI", "student management", "facial recognition"],
  authors: [{ name: "FaceTrack AI Team" }],
  openGraph: {
    title: "FaceTrack AI - Smart Attendance Management",
    description: "AI-powered student attendance management system",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AuthGuard>{children}</AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
