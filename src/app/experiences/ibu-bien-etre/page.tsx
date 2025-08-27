import React from "react";
import { Metadata } from "next";
import IBUBienEtreMain from "@/pages/experiences/ibu-bien-etre/ibu-bien-etre-main";

export const metadata: Metadata = {
  title: "VBU Experience - IBÙ Bien-être",
  description: "Découvrez nos expériences de bien-être et de relaxation",
};

const IBUBienEtre = () => {
  return (
    <IBUBienEtreMain />
  );
};

export default IBUBienEtre;
