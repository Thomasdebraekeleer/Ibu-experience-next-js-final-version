import { IMenuDT } from "@/types/menu-d-t";


const menu_data:IMenuDT[] = [
  {
    id: 1,
    title: 'HOME',
    link: '/home',
  },
  {
    id: 2,
    title: 'EXPERIENCES',
    link: '/experiences',
    dropdown_menus: [
      {
        title: 'IBÙ Signature',
        link: '/experiences/ibu-signature',
      },
      {
        title: 'IBÙ Bien-être',
        link: '/experiences/ibu-bien-etre',
      },
    ],
  },
  {
    id: 3,
    title: 'RESERVATIONS',
    link: '#',
  },
  {
    id: 4,
    title: 'ABOUT',
    link: '#',
  },
  {
    id: 5,
    title: 'BECOME A PARTNER',
    link: '#',
  },
  {
    id: 6,
    title: 'CONTACT',
    link: '#',
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
    title: 'HOME',
    link: '/home',
    dropdown_menus:[]
  },
  {
    id: 2,
    title: 'EXPERIENCES',
    link: '/experiences',
    dropdown_menus: [
      {
        title: 'IBÙ Signature',
        link: '/experiences/ibu-signature',
      },
      {
        title: 'IBÙ Bien-être',
        link: '/experiences/ibu-bien-etre',
      },
    ],
  },
  {
    id: 3,
    title: 'RESERVATIONS',
    link: '#',
    dropdown_menus:[]
  },
  {
    id: 4,
    title: 'ABOUT',
    link: '#',
    dropdown_menus:[]
  },
  {
    id: 5,
    title: 'BECOME A PARTNER',
    link: '#',
    dropdown_menus:[]
  },
  {
    id: 6,
    title: 'CONTACT',
    link: '#',
    dropdown_menus:[]
  }
]