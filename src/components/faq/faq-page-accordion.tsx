"use client";

import FaqAccordion from "@/components/faq/faq-accordion";

/** @deprecated Préférez `FaqAccordion` avec variant="page" */
export default function FaqPageAccordion() {
  return <FaqAccordion variant="page" initialOpenIndex={0} />;
}
