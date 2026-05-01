import Image from "next/image";

const PETIT_DEJEUNER_IMG =
  "/assets/img/inner-project/portfolio-details-ibu-bien-etre/Petit déjeuné local.webp";

type Props = {
  /** Marge au-dessus du bloc */
  marginTop?: string;
};

export default function PetitDejeunerOptionRow({ marginTop = "40px" }: Props) {
  return (
    <div className="row" style={{ marginTop }}>
      <div className="col-xl-6 col-lg-6">
        <div className="showcase-details-2-grid-img mb-30">
          <Image
            src={PETIT_DEJEUNER_IMG}
            alt="Petit déjeuner local"
            width={1200}
            height={900}
            style={{ height: "auto", width: "100%" }}
          />
        </div>
      </div>
      <div className="col-xl-6 col-lg-6">
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
            Petit déjeuner local (15eur)
          </h5>
          <div className="showcase-details-2-content-right tp_title_anim">
            <p
              style={{
                fontSize: "clamp(1.05rem, 2.2vw, 1.2rem)",
                lineHeight: "1.75",
                marginBottom: "1rem",
              }}
            >
              Commencez la journée du bon pied avec un petit déjeuner pensé comme une pause
              gourmande : pains et viennoiseries, produits laitiers et charcuteries sélectionnées
              auprès d&apos;artisans et de producteurs de la région, fruits de saison, jus et
              douceurs qui mettent en avant le terroir tout en restant légers.
            </p>
            <p
              style={{
                fontSize: "clamp(1.05rem, 2.2vw, 1.2rem)",
                lineHeight: "1.75",
                marginBottom: 0,
              }}
            >
              Chaque assiette révèle des saveurs honnêtes et des produits frais, pour un réveil en
              douceur avant de profiter pleinement de votre séjour IBÙ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
