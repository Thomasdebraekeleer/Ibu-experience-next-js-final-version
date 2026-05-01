"use client";

import { useLayoutEffect, useRef, useState } from "react";

type Props = {
  text: string;
};

export default function ExpandableReviewText({ text }: Props) {
  const pRef = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

  useLayoutEffect(() => {
    const el = pRef.current;
    if (!el) return;
    if (open) {
      setShowToggle(true);
      return;
    }
    setShowToggle(el.scrollHeight > el.clientHeight + 2);
  }, [text, open]);

  return (
    <div style={{ marginBottom: "14px", maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}>
      <p
        ref={pRef}
        style={{
          margin: 0,
          fontSize: "clamp(0.82rem, 1.95vw, 0.95rem)",
          lineHeight: 1.62,
          color: "#444",
          textAlign: "center",
          ...(open
            ? {
                display: "block",
                overflow: "visible",
              }
            : {
                display: "-webkit-box",
                WebkitBoxOrient: "vertical" as const,
                WebkitLineClamp: 3,
                overflow: "hidden",
              }),
        }}
      >
        &ldquo;{text}&rdquo;
      </p>
      {showToggle ? (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          style={{
            marginTop: "10px",
            background: "none",
            border: "none",
            color: "#053725",
            cursor: "pointer",
            fontSize: "clamp(0.78rem, 1.85vw, 0.875rem)",
            fontWeight: 600,
            textDecoration: "underline",
            padding: "4px 8px",
          }}
        >
          {open ? "Voir moins" : "Voir plus"}
        </button>
      ) : null}
    </div>
  );
}
