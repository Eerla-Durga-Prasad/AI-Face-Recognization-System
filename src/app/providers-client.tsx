"use client";

import { Toaster } from "sonner";

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-right" richColors closeButton theme="system" />
      {children}
    </>
  );
}
