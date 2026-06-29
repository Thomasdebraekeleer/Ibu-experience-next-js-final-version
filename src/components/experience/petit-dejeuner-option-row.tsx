"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const PETIT_DEJEUNER_IMG =
  "/assets/img/inner-project/portfolio-details-ibu-bien-etre/Petit déjeuné local.webp";

type Props = {
  /** Marge au-dessus du bloc */
  marginTop?: string;
  /** Activer les traductions (hub /experiences uniquement pour le Lot 4E) */
  localize?: boolean;
};

export default function PetitDejeunerOptionRow({
  marginTop = "40px",
  localize = false,
}: Props) {
  const t = useTranslations("experiences.options.breakfast");

  const title = localize ? t("title") : "Petit déjeuner local (25eur)";
  const paragraph1 = localize
    ? t("paragraph1")
    : "Commencez la journée du bon pied avec un petit déjeuner pensé comme une pause gourmande : Petit pain à réchauffer, produits laitiers et charcuteries sélectionnées auprès d'artisans et de producteurs de la région, fruits de saison, jus et douceurs qui mettent en avant le terroir tout en restant légers.";
  const paragraph2 = localize
    ? t("paragraph2")
    : "Chaque assiette révèle des saveurs honnêtes et des produits frais, pour un réveil en douceur avant de profiter pleinement de votre séjour IBÙ.";
  const imageAlt = localize ? t("imageAlt") : "Petit déjeuner local";

  return (
    <div className="row" style={{ marginTop }}>
      <div className="col-xl-6 col-lg-6 order-2 order-lg-1">
        <div className="showcase-details-2-grid-img mb-30">
          <Image
            src={PETIT_DEJEUNER_IMG}
            alt={imageAlt}
            width={1200}
            height={900}
            style={{ height: "auto", width: "100%" }}
          />
        </div>
      </div>
      <div className="col-xl-6 col-lg-6 order-1 order-lg-2">
        <div className="mb-30">
          <h5
            className="visite-chai-title"
            style={{
              fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
              fontWeight: "500",
              color: "#053725",
              marginTop: "10px",
              marginBottom: "24px",
              lineHeight: "1.4",
              display: "block",
              textTransform: "none",
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            {title}
          </h5>
          <div className="showcase-details-2-content-right tp_title_anim">
            <p
              style={{
                fontSize: "clamp(1.05rem, 2.2vw, 1.2rem)",
                lineHeight: "1.75",
                marginBottom: "1rem",
              }}
            >
              {paragraph1}
            </p>
            <p
              style={{
                fontSize: "clamp(1.05rem, 2.2vw, 1.2rem)",
                lineHeight: "1.75",
                marginBottom: 0,
              }}
            >
              {paragraph2}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
