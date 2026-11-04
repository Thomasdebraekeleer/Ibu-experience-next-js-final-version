export type LodgifyRoomImage = {
  text?: string | null;
  url?: string | null;
};

export type LodgifyRoomMedia = {
  id?: number;
  name?: string;
  image_url?: string | null;
  images?: LodgifyRoomImage[];
};
