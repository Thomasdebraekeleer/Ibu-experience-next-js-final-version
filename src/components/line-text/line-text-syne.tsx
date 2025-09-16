import React from "react";
import Marquee from "react-fast-marquee";
import { StarSquare } from "../svg";

// marquee text
const marquee_text = [
  "Vivez l'expérience IBÙ!",
  "Vivez l'expérience IBÙ!",
  "Vivez l'expérience IBÙ!",
  "Vivez l'expérience IBÙ!",
];

// prop type 
type IProps = {
  cls?: string;
};

export default function LineTextSyne({cls=""}:IProps) {
  return (
    <div className={`tp-line-text-wrap tp-line-text-wrap-2 ${cls}`}>
      <div className="tp-line-text-slide">
        <Marquee speed={100} autoFill={true}>
          {marquee_text.map((text, index) => (
            <div key={index} className="tp-line-content">
              <h4 
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 400,
                  fontSize: "80px",
                  lineHeight: 1,
                  textTransform: "uppercase",
                  color: "#ffffff",
                  letterSpacing: "-1.8px",
                  margin: 0,
                  padding: 0,
                  // Forcer la police et éviter tous les conflits CSS
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none"
                }}
              >
                <span 
                  className="d-none d-md-inline-block mr-40"
                  style={{
                    display: "inline-block",
                    marginRight: "40px"
                  }}
                >
                  <StarSquare />
                </span>
                {text}
              </h4>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
