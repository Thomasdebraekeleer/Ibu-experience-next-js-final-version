import type { LucideIcon } from "lucide-react";
import {
  BedDouble,
  Car,
  Coffee,
  CookingPot,
  Droplets,
  Sun,
  Wind,
  Sparkles,
  ShowerHead,
  Croissant,
} from "lucide-react";
import type { PublicAmenityKey } from "@/lib/booking/place-catalog-types";

export const AMENITY_ICONS: Record<PublicAmenityKey, LucideIcon> = {
  doubleBed: BedDouble,
  kitchenette: CookingPot,
  bathroom: Droplets,
  parking: Car,
  airConditioning: Wind,
  terrace: Sun,
  coffeeMachine: Coffee,
  essentials: Sparkles,
  bedLinen: BedDouble,
  shower: ShowerHead,
  breakfast: Croissant,
};
