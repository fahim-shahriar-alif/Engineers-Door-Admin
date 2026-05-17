"use client";

// Preview mode: SessionProvider removed since auth is bypassed.
// Restore SessionProvider from next-auth/react when connecting real auth.
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
