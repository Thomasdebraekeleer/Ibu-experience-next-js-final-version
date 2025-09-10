import { IMenuDT } from "@/types/menu-d-t";


const menu_data:IMenuDT[] = [
  {
    id: 1,
    title: 'ACCUEIL',
    link: '/accueil',
  },
  {
    id: 2,
    title: 'EXPÉRIENCES',
    link: '/experiences',
    dropdown_menus: [
      {
        title: 'IBÙ Bien-être',
        link: '/experiences/ibu-bien-etre',
      },
      {
        title: 'IBÙ Signature',
        link: '/experiences/ibu-signature',
      },
    ],
  },
  {
    id: 3,
    title: 'RÉSERVATION',
    link: '/reservations',
  },
  {
    id: 4,
    title: 'À PROPOS',
    link: '/a-propos',
  },
  {
    id: 5,
    title: 'DEVENIR PARTENAIRE',
    link: '/devenir-partenaire',
  },
  {
    id: 6,
    title: 'CONTACT',
    link: '/contact',
  },

];



export default menu_data;

// mobile menus 
export const mobile_menu_data:{
  id: number;
  title: string;
  link: string;
  dropdown_menus: {
      title: string;
      link: string;
  }[];
}[] = [
  {
    id:1,
    title: 'ACCUEIL',
    link: '/accueil',
    dropdown_menus:[]
  },
  {
    id: 2,
    title: 'EXPÉRIENCES',
    link: '/experiences',
    dropdown_menus: [
      {
        title: 'IBÙ Bien-être',
        link: '/experiences/ibu-bien-etre',
      },
      {
        title: 'IBÙ Signature',
        link: '/experiences/ibu-signature',
      },
    ],
  },
  {
    id: 3,
    title: 'RÉSERVATION',
    link: '/reservations',
    dropdown_menus:[]
  },
  {
    id: 4,
    title: 'À PROPOS',
    link: '/a-propos',
    dropdown_menus:[]
  },
  {
    id: 5,
    title: 'DEVENIR PARTENAIRE',
    link: '/devenir-partenaire',
    dropdown_menus:[]
  },
  {
    id: 6,
    title: 'CONTACT',
    link: '/contact',
    dropdown_menus:[]
  }
]