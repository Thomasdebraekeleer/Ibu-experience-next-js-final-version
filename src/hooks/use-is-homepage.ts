'use client';
import { usePathname } from 'next/navigation';

export default function useIsHomepage() {
  const pathname = usePathname();
  
  // Retourne true si on est sur la page d'accueil (/) ou sur une page home
  return pathname === '/' || pathname === '/home' || pathname.startsWith('/home-');
}
