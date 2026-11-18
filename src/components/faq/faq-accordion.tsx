"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/plugins/scroll-trigger";
import { useLocale } from "next-intl";
import {
  FaqItemContent,
  FaqSection,
  getFaqItems,
} from "@/content/faq-items";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function FaqAnswerBody({ item }: { item: FaqItemContent }) {
  return (
    <div className="ibu-faq-answer-inner">
      {item.paragraphs?.map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
      ))}
      {item.bullets && item.bullets.length > 0 && (
        <ul className="ibu-faq-list">
          {item.bullets.map((bullet) => (
            <li key={bullet.slice(0, 48)}>{bullet}</li>
          ))}
        </ul>
      )}
      {item.sections?.map((section: FaqSection) => (
        <div className="ibu-faq-subsection" key={section.title}>
          <p className="ibu-faq-subsection-title">
            <em>{section.title}</em>
          </p>
          {section.kind === "bullets" && (
            <ul className="ibu-faq-list">
              {section.bullets.map((bullet) => (
                <li key={bullet.slice(0, 48)}>{bullet}</li>
              ))}
            </ul>
          )}
          {section.kind === "places" && (
            <ul className="ibu-faq-places">
              {section.places.map((place) => (
                <li key={place.title}>
                  <strong>{place.title}</strong>
                  <span>{place.description}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

type FaqRowProps = {
  item: FaqItemContent;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
};

function FaqAccordionRow({ item, index, isOpen, onToggle }: FaqRowProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    const inner = innerRef.current;
    if (!body || !inner) return;

    if (isOpen) {
      gsap.killTweensOf(body);
      const targetHeight = inner.scrollHeight;
      gsap.fromTo(
        body,
        { height: 0, opacity: 0.6 },
        {
          height: targetHeight,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          onComplete: () => {
            gsap.set(body, { height: "auto" });
          },
        }
      );
    } else {
      gsap.killTweensOf(body);
      const currentHeight = body.offsetHeight;
      gsap.fromTo(
        body,
        { height: currentHeight, opacity: 1 },
        {
          height: 0,
          opacity: 0,
          duration: 0.38,
          ease: "power2.inOut",
        }
      );
    }
  }, [isOpen]);

  const paddedIndex = String(index + 1).padStart(2, "0");

  return (
    <article
      className={`accordion-items ibu-faq-item${isOpen ? " is-open" : ""}`}
      data-faq-item
    >
      <h2 className="accordion-header">
        <button
          type="button"
          className={`accordion-buttons ibu-faq-trigger${isOpen ? "" : " collapsed"}`}
          aria-expanded={isOpen}
          onClick={onToggle}
        >
          <span className="ibu-faq-index">{paddedIndex}</span>
          <span className="ibu-faq-question">{item.question}</span>
          <span className="accordion-icon" aria-hidden />
        </button>
      </h2>
      <div
        ref={bodyRef}
        className="ibu-faq-panel"
        style={{ height: 0, overflow: "hidden" }}
        aria-hidden={!isOpen}
      >
        <div ref={innerRef} className="accordion-body">
          <FaqAnswerBody item={item} />
        </div>
      </div>
    </article>
  );
}

export type FaqAccordionProps = {
  variant?: "page" | "embedded";
  initialOpenIndex?: number | null;
};

export default function FaqAccordion({
  variant = "page",
  initialOpenIndex,
}: FaqAccordionProps) {
  const locale = useLocale();
  const items = getFaqItems(locale);
  const defaultOpen =
    initialOpenIndex !== undefined
      ? initialOpenIndex
      : variant === "page"
        ? 0
        : null;
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpenIndex(defaultOpen);
  }, [locale, defaultOpen]);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  useGSAP(
    () => {
      const rows = listRef.current?.querySelectorAll("[data-faq-item]");
      if (!rows?.length) return;

      gsap.set(rows, { autoAlpha: 0, y: 36 });

      ScrollTrigger.batch(rows, {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
            overwrite: true,
          });
        },
        once: true,
      });

      ScrollTrigger.refresh();
    },
    { scope: listRef, dependencies: [locale], revertOnUpdate: true }
  );

  const list = (
    <div
      ref={listRef}
      className="fq-faq-wrapper ibu-faq-accordion tp-service-2-accordion-box ibu-faq-accordion-wrap"
    >
      {items.map((item, index) => (
        <FaqAccordionRow
          key={item.question}
          item={item}
          index={index}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );

  if (variant === "embedded") {
    return list;
  }

  return (
    <section className="ibu-faq-section fq-faq-area pb-140">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-11">{list}</div>
        </div>
      </div>
    </section>
  );
}
