"use client";

import { useEffect, useState } from "react";
import type { PlaceCatalogCocon, PlaceCatalogResponse } from "./place-catalog-types";

export function usePlaceCatalog(placeId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cocons, setCocons] = useState<PlaceCatalogCocon[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);

    void fetch(`/api/booking/place-catalog?placeId=${encodeURIComponent(placeId)}`, {
      signal: controller.signal,
      cache: "default",
    })
      .then(async (res) => {
        const body = (await res.json()) as PlaceCatalogResponse;
        if (!body.ok) {
          setError(true);
          setCocons([]);
          return;
        }
        setCocons(body.cocons);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [placeId]);

  return { loading, error, cocons };
}
