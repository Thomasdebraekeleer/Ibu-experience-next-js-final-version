import React from "react";
import { Facebook, Instagram, Linkdin } from "../svg";

const social_data = [
  {
    id: 1,
    icon: <Linkdin />,
    link: "https://www.linkedin.com/company/ib%C3%B9-experience/?viewAsMember=true",
  },
  {
    id: 2,
    icon: <Instagram />,
    link: "https://www.instagram.com/ibu_experience/",
  },
  {
    id: 3,
    icon: <Facebook />,
    link: "https://www.facebook.com/people/IB%C3%99-Experience/61571861925403/#",
  },
];

export default function Social() {
  return (
    <>
      {social_data.map((item) => (
        <a href={item.link} key={item.id} target="_blank" rel="noopener noreferrer">
          <span>{item.icon}</span>
        </a>
      ))}
    </>
  );
}
