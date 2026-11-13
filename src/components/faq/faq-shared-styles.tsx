export default function FaqSharedStyles() {
  return (
    <style jsx global>{`
      .ibu-faq-hero-title {
        font-size: clamp(1.5rem, 3vw, 2.25rem) !important;
        font-weight: 600 !important;
        line-height: 1.25 !important;
        letter-spacing: -0.02em !important;
        max-width: 42rem;
        color: var(--tp-common-black-2);
      }

      .ibu-home-faq-section .ibu-faq-hero-title {
        margin-bottom: 0;
      }

      .ibu-faq-hero-lead {
        max-width: 640px;
        margin: 18px 0 0;
        font-size: 18px;
        line-height: 1.55;
        color: #5d5d63;
      }

      .ibu-home-faq-section .ibu-faq-hero-lead {
        margin-bottom: 36px;
      }

      .ibu-faq-section {
        padding-top: 20px;
      }

      .ibu-faq-page .ibu-faq-accordion-wrap.tp-service-2-accordion-box,
      .ibu-home-faq-section .ibu-faq-accordion-wrap.tp-service-2-accordion-box {
        height: auto;
        overflow: visible;
      }

      .ibu-faq-accordion .ibu-faq-item {
        border-bottom: 1px solid rgba(25, 25, 26, 0.12);
        margin-bottom: 0;
      }

      .ibu-faq-accordion .ibu-faq-trigger {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        padding: 32px 56px 32px 0;
        font-size: clamp(1.15rem, 2.2vw, 1.65rem);
        font-weight: 600;
        line-height: 1.35;
        color: var(--tp-common-black);
        background: none;
        border: none;
        width: 100%;
        text-align: left;
        position: relative;
        transition: color 0.3s ease;
      }

      .ibu-faq-accordion .ibu-faq-item.is-open .ibu-faq-trigger {
        color: #053725;
      }

      .ibu-faq-index {
        flex-shrink: 0;
        font-size: 0.85rem;
        font-weight: 500;
        letter-spacing: 0.12em;
        color: rgba(5, 55, 37, 0.55);
        padding-top: 0.35em;
        min-width: 2rem;
      }

      .ibu-faq-question {
        flex: 1;
      }

      .ibu-faq-accordion .accordion-icon {
        position: absolute;
        top: 50%;
        right: 4px;
        transform: translateY(-50%);
      }

      .ibu-faq-accordion .ibu-faq-item.is-open .accordion-icon::before {
        transform: translate(-50%, -50%) rotate(90deg);
      }

      .ibu-faq-panel .accordion-body {
        padding: 0 0 36px 2.85rem;
      }

      .ibu-faq-answer-inner p {
        color: #5d5d63;
        font-size: 17px;
        line-height: 1.65;
        margin-bottom: 16px;
      }

      .ibu-faq-answer-inner p:last-child {
        margin-bottom: 0;
      }

      .ibu-faq-list,
      .ibu-faq-places {
        margin: 0 0 20px;
        padding: 0;
        list-style: none;
      }

      .ibu-faq-list li {
        position: relative;
        padding-left: 1.25rem;
        margin-bottom: 10px;
        color: #5d5d63;
        font-size: 17px;
        line-height: 1.55;
      }

      .ibu-faq-list li::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0.65em;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #053725;
      }

      .ibu-faq-subsection {
        margin-top: 24px;
      }

      .ibu-faq-subsection-title {
        margin-bottom: 14px;
        font-size: 17px;
        color: var(--tp-common-black);
      }

      .ibu-faq-places li {
        margin-bottom: 18px;
      }

      .ibu-faq-places li strong {
        display: block;
        color: var(--tp-common-black);
        font-weight: 600;
        margin-bottom: 6px;
        font-size: 17px;
      }

      .ibu-faq-places li span {
        display: block;
        color: #5d5d63;
        font-size: 16px;
        line-height: 1.6;
      }

      @media (max-width: 767px) {
        .ibu-faq-accordion .ibu-faq-trigger {
          padding-right: 44px;
          gap: 12px;
        }

        .ibu-faq-panel .accordion-body {
          padding-left: 0;
        }

        .ibu-faq-index {
          display: none;
        }
      }
    `}</style>
  );
}
