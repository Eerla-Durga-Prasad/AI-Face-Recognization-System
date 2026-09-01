"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Bell, Check, X } from "lucide-react";

export default function NotificationBell() {
  const { profile } = useAuth();

  return (
    <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
    </button>
  );
}
