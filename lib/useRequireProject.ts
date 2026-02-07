'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from './appStore';

export function useRequireProject() {
  const { activeProjectId, isLoaded } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !activeProjectId) {
      router.replace('/');
    }
  }, [isLoaded, activeProjectId, router]);

  return { isReady: isLoaded && !!activeProjectId };
}
