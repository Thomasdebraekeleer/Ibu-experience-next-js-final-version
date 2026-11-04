import type { PublicCoconId } from "@/config/booking/public-places";

export type PublicCoconImage = {
  url: string;
};

export type CoconMediaGalleries = Partial<Record<PublicCoconId, { images: PublicCoconImage[] }>>;

export type CoconMediaResponse =
  | {
      ok: true;
      placeId: string;
      galleries: CoconMediaGalleries;
    }
  | { ok: false; reason: string };
