import { IMenuDT } from "@/types/menu-d-t";

export type NavLabelKey =
  | "home"
  | "experience"
  | "reservation"
  | "about"
  | "partner"
  | "contact";

type MenuItemConfig = {
  id: number;
  labelKey: NavLabelKey;
  link: string;
};

const MENU_ITEMS: MenuItemConfig[] = [
  { id: 1, labelKey: "home", link: "/accueil" },
  { id: 2, labelKey: "experience", link: "/experiences" },
  { id: 3, labelKey: "reservation", link: "/reservations" },
  { id: 4, labelKey: "about", link: "/a-propos" },
  { id: 5, labelKey: "partner", link: "/devenir-partenaire" },
  { id: 6, labelKey: "contact", link: "/contact" },
];

export type MenuTranslator = (key: `nav.${NavLabelKey}`) => string;

export function getMenuData(t: MenuTranslator): IMenuDT[] {
  return MENU_ITEMS.map((item) => ({
    id: item.id,
    link: item.link,
    title: t(`nav.${item.labelKey}`),
  }));
}

/** @deprecated Legacy export for unused template component mobile-menus-2.tsx */
export const mobile_menu_data: {
  id: number;
  title: string;
  link: string;
  dropdown_menus: { title: string; link: string }[];
}[] = MENU_ITEMS.map((item) => ({
  id: item.id,
  title: item.labelKey,
  link: item.link,
  dropdown_menus: [],
}));
