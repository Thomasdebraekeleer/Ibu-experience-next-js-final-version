import React from "react";
import { Metadata } from "next";
import ExperiencesMain from "@/pages/experiences/experiences-main";

export const metadata: Metadata = {
  title: "VBU Experience - Nos Expériences",
  description: "Découvrez nos expériences uniques et immersives",
};

const Experiences = () => {
  return (
    <ExperiencesMain />
  );
};

export default Experiences;
