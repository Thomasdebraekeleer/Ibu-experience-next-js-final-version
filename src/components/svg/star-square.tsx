import React from "react";

export default function StarSquare() {
  return (
    <svg
      width="70"
      height="70"
      viewBox="0 0 56.6 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>
          {`
            .cls-1 {
              fill: none;
              stroke: currentColor;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-width: 2px;
            }
          `}
        </style>
      </defs>
      <g id="Layer_1" data-name="Layer 1">
        <g>
          <path className="cls-1" d="M55.6,41.4c0,3.2-2.6,5.9-5.9,5.9s-5.9-2.6-5.9-5.9c0-1.4.5-2.7,1.4-3.8-.3-.6-.5-1.4-.5-2.1,0-1.7.9-3.2,2.2-4.1-.4-.5-.6-1.2-.6-1.9,0-1.9,1.6-3.5,3.5-3.5s3.5,1.5,3.5,3.5c0,.7-.2,1.3-.6,1.9,1.3.9,2.2,2.4,2.2,4.1,0,.8-.2,1.5-.5,2.1.7,1,1.2,2.3,1.2,3.8Z"/>
          <polyline className="cls-1" points="49.7 22.6 49.7 15.2 25.3 1 1 15.2 1 59 34 59"/>
          <line className="cls-1" x1="49.7" y1="52.6" x2="49.7" y2="44.2"/>
          <polyline className="cls-1" points="34 59 11.6 59 11.6 24.2 25.3 16.2 39.1 24.2 39.1 52.6"/>
          <rect className="cls-1" x="34" y="52.6" width="20.7" height="6.4"/>
          <rect className="cls-1" x="11.6" y="45.6" width="7.5" height="13.4"/>
        </g>
      </g>
    </svg>
  );
}
