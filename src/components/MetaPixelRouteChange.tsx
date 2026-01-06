'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/metaPixel';

/**
 * Composant pour tracker les changements de route (navigation SPA)
 * Envoie un événement PageView à chaque changement d'URL
 */
export default function MetaPixelRouteChange() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Ne track pas en développement
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Track le PageView lors du changement de route
    pageview();
  }, [pathname, searchParams]);

  return null;
}

