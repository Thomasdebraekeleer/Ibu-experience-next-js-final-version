import React from "react";
import { Metadata } from "next";
import AboutMain from "@/pages/about/about-main";

export const metadata: Metadata = {
  title: "IBÙ Experience - À Propos",
  description: "Découvrez l'histoire et la mission d'IBÙ Experience",
};

const AProposPage = () => {
  return <AboutMain />;
};

export default AProposPage;
