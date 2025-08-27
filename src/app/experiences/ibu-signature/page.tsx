import React from "react";
import { Metadata } from "next";
import IBUSignatureMain from "@/pages/experiences/ibu-signature/ibu-signature-main";

export const metadata: Metadata = {
  title: "VBU Experience - IBÙ Signature",
  description: "Découvrez nos expériences signature exclusives et personnalisées",
};

const IBUSignature = () => {
  return (
    <IBUSignatureMain />
  );
};

export default IBUSignature;
