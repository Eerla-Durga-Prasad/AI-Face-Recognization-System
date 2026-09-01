"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.PropsWithChildren<Record<string, any>>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
