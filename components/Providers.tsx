'use client';

import { AppProvider } from '@/lib/appStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
