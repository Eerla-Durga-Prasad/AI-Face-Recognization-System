import type { ReactNode } from "react";
import { ThemeProvider } from "@/context/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import ProvidersClient from "@/app/providers-client";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <ProvidersClient>{children}</ProvidersClient>
      </AuthProvider>
    </ThemeProvider>
  );
}
