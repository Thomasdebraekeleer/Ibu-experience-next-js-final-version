"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PublicCoconId } from "@/config/booking/public-places";
import type { CoconMediaGalleries, CoconMediaResponse } from "./cocon-media-types";

type State = {
  loading: boolean;
  galleries: CoconMediaGalleries;
  error: boolean;
};

export function useCoconGalleries(
  placeId: string | null,
  coconIds: PublicCoconId[],
  enabled: boolean
) {
  const sortedKey = useMemo(
    () => [...coconIds].sort().join(","),
    [coconIds]
  );

  const [state, setState] = useState<State>({
    loading: false,
    galleries: {},
    error: false,
  });

  const fetchedKeyRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  const retry = useCallback(() => {
    fetchedKeyRef.current = null;
    setRetryToken((n) => n + 1);
    setState((s) => ({ ...s, error: false }));
  }, []);

  useEffect(() => {
    if (!enabled || !placeId || coconIds.length === 0) {
      abortRef.current?.abort();
      return;
    }

    const fetchKey = `${placeId}|${sortedKey}|${retryToken}`;
    if (fetchedKeyRef.current === fetchKey) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((s) => ({ ...s, loading: true, error: false }));

    const params = new URLSearchParams({
      placeId,
      coconIds: [...coconIds].sort().join(","),
    });

    void fetch(`/api/booking/cocon-media?${params.toString()}`, {
      signal: controller.signal,
      cache: "default",
    })
      .then(async (res) => {
        const body = (await res.json()) as CoconMediaResponse;
        if (controller.signal.aborted) return;
        if (!body.ok) {
          setState({ loading: false, galleries: {}, error: true });
          fetchedKeyRef.current = fetchKey;
          return;
        }
        setState({
          loading: false,
          galleries: body.galleries,
          error: false,
        });
        fetchedKeyRef.current = fetchKey;
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setState({ loading: false, galleries: {}, error: true });
        fetchedKeyRef.current = fetchKey;
      });

    return () => controller.abort();
  }, [enabled, placeId, sortedKey, retryToken]);

  return { ...state, retry };
}
