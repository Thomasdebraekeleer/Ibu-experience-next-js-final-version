"use client";

import { usePathname } from "@/i18n/navigation";

export default function useIsHomepage() {
  const pathname = usePathname();

  return pathname === "/accueil";
}
