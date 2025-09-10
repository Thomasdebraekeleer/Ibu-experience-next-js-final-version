import React from "react";
import { Metadata } from "next";
import HomeMain from "@/pages/homes/home-1";

export const metadata: Metadata = {
  title: "IBÙ Experience - Accueil",
  description: "Découvrez IBÙ Experience - Des expériences uniques au cœur de la nature belge",
};

const AccueilPage = () => {
  return <HomeMain />;
};

export default AccueilPage;
