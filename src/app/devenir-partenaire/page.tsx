import React from "react";
import { Metadata } from "next";
import BecomePartnerMain from "@/pages/become-partner/become-partner-main";

export const metadata: Metadata = {
  title: "IBÙ Experience - Devenir Partenaire",
  description: "Rejoignez le réseau IBÙ Experience et proposez des expériences uniques",
};

const DevenirPartenairePage = () => {
  return <BecomePartnerMain />;
};

export default DevenirPartenairePage;
