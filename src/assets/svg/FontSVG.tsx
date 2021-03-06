import { memo } from "react";

interface FontSVGProps {
  type: "italic" | "font" | "bold" | "underline" | "edit" | "trash" | "check" | "add";
  currentColor?: string;
}
const FontSVG: React.FC<FontSVGProps> = ({ type, currentColor }) => {
  if (type === "font") {
    return (
      <svg viewBox="0 -256 1792 1792" width="100%" height="100%">
        <g transform="matrix(1,0,0,-1,60.745762,1262.644)">
          <path d="M 725,977 555,527 q 73,-1 153.5,-2 80.5,-1 119,-1.5 Q 866,523 880,523 l 29,2 q -32,95 -92,241 -53,132 -92,211 z M 21,-128 H 0 l 2,79 q 22,7 80,18 89,16 110,31 20,16 48,68 l 237,616 280,724 h 75 53 l 11,-21 205,-480 q 103,-242 124,-297 39,-102 96,-235 26,-58 65,-164 24,-67 65,-149 22,-49 35,-57 22,-19 69,-23 47,-6 103,-27 6,-39 6,-57 0,-14 -1,-26 -80,0 -192,8 -93,8 -189,8 -79,0 -135,-2 l -200,-11 -58,-2 q 0,45 4,78 l 131,28 q 56,13 68,23 12,12 12,27 0,15 -6,32 l -47,114 -92,228 -450,2 Q 480,340 405,131 382,67 382,47 q 0,-31 17,-43 26,-21 103,-32 3,0 13.5,-2 10.5,-2 30,-5 19.5,-3 40.5,-6 1,-28 1,-58 0,-17 -2,-27 -66,0 -349,20 l -48,-8 q -81,-14 -167,-14 z" />
        </g>
      </svg>
    );
  } else if (type === "italic") {
    return (
      <svg viewBox="0 -256 1792 1792" width="100%" height="100%">
        <g transform="matrix(1,0,0,-1,387.25424,1270.2373)">
          <path
            d="m 0,-126 17,85 q 4,1 77,20 76,19 116,39 29,37 41,101 l 27,139 56,268 12,64 q 8,44 17,84.5 9,40.5 16,67 7,26.5 12.5,46.5 5.5,20 9,30.5 3.5,10.5 3.5,11.5 l 29,157 16,63 22,135 8,50 v 38 q -41,22 -144,28 -28,2 -38,4 l 19,103 317,-14 q 39,-2 73,-2 66,0 214,9 33,2 68,4.5 35,2.5 36,2.5 -2,-19 -6,-38 -7,-29 -13,-51 -55,-19 -109,-31 -64,-16 -101,-31 -12,-31 -24,-88 -9,-44 -13,-82 Q 714,888 692,781 L 631,470 593,312 550,77 538,32 q -2,-7 1,-27 64,-15 119,-21 36,-5 66,-10 -1,-29 -7,-58 -7,-31 -9,-41 -18,0 -23,-1 -24,-2 -42,-2 -9,0 -28,3 -19,4 -145,17 l -198,2 q -41,1 -174,-11 -74,-7 -98,-9 z"
            style={{ fill: currentColor || "#333" }}
          />
        </g>
      </svg>
    );
  } else if (type === "bold") {
    return (
      <svg viewBox="0 -256 1792 1792" width="100%" height="100%">
        <g transform="matrix(1,0,0,-1,189.83051,1285.4237)">
          <path
            d="m 555,15 q 76,-32 140,-32 131,0 216,41 85,41 122,113 38,70 38,181 0,114 -41,180 -58,94 -141,126 -80,32 -247,32 -74,0 -101,-10 V 502 l -1,-173 3,-270 q 0,-15 12,-44 z m -14,746 q 43,-7 109,-7 175,0 264,65 89,65 89,224 0,112 -85,187 -84,75 -255,75 -52,0 -130,-13 0,-44 2,-77 7,-122 6,-279 l -1,-98 q 0,-43 1,-77 z M 0,-128 2,-34 q 45,9 68,12 77,12 123,31 17,27 21,51 9,66 9,194 l -2,497 q -5,256 -9,404 -1,87 -11,109 -1,4 -12,12 -18,12 -69,15 -30,2 -114,13 l -4,83 260,6 380,13 45,1 q 5,0 14,0.5 9,0.5 14,0.5 1,0 21.5,-0.5 20.5,-0.5 40.5,-0.5 h 74 q 88,0 191,-27 43,-13 96,-39 57,-29 102,-76 44,-47 65,-104 21,-57 21,-122 0,-70 -32,-128 -32,-58 -95,-105 -26,-20 -150,-77 177,-41 267,-146 92,-106 92,-236 0,-76 -29,-161 -21,-62 -71,-117 -66,-72 -140,-108 -73,-36 -203,-60 -82,-15 -198,-11 l -197,4 q -84,2 -298,-11 -33,-3 -272,-11 z"
            style={{ fill: currentColor || "#333" }}
          />
        </g>
      </svg>
    );
  } else if (type === "underline") {
    return (
      <svg viewBox="0 -256 1792 1792" width="100%" height="100%">
        <g transform="matrix(1,0,0,-1,129.08475,1285.4237)">
          <path
            d="m 48,1313 q -37,2 -45,4 l -3,88 q 13,1 40,1 60,0 112,-4 132,-7 166,-7 86,0 168,3 116,4 146,5 56,0 86,2 l -1,-14 2,-64 v -9 q -60,-9 -124,-9 -60,0 -79,-25 -13,-14 -13,-132 0,-13 0.5,-32.5 0.5,-19.5 0.5,-25.5 l 1,-229 14,-280 q 6,-124 51,-202 35,-59 96,-92 88,-47 177,-47 104,0 191,28 56,18 99,51 48,36 65,64 36,56 53,114 21,73 21,229 0,79 -3.5,128 -3.5,49 -11,122.5 -7.5,73.5 -13.5,159.5 l -4,59 q -5,67 -24,88 -34,35 -77,34 l -100,-2 -14,3 2,86 h 84 l 205,-10 q 76,-3 196,10 l 18,-2 q 6,-38 6,-51 0,-7 -4,-31 -45,-12 -84,-13 -73,-11 -79,-17 -15,-15 -15,-41 0,-7 1.5,-27 1.5,-20 1.5,-31 8,-19 22,-396 6,-195 -15,-304 -15,-76 -41,-122 -38,-65 -112,-123 -75,-57 -182,-89 -109,-33 -255,-33 -167,0 -284,46 -119,47 -179,122 -61,76 -83,195 -16,80 -16,237 v 333 q 0,188 -17,213 -25,36 -147,39 z M 1536,-96 v 64 q 0,14 -9,23 -9,9 -23,9 H 32 Q 18,0 9,-9 0,-18 0,-32 v -64 q 0,-14 9,-23 9,-9 23,-9 h 1472 q 14,0 23,9 9,9 9,23 z"
            style={{ fill: currentColor || "#333" }}
          />
        </g>
      </svg>
    );
  } else if (type === "edit") {
    return (
      <svg viewBox="0 -256 1850 1850" width="100%" height="100%">
        <g transform="matrix(1,0,0,-1,30.372881,1373.7966)">
          <path d="M 888,352 1004,468 852,620 736,504 v -56 h 96 v -96 h 56 z m 440,720 q -16,16 -33,-1 L 945,721 q -17,-17 -1,-33 16,-16 33,1 l 350,350 q 17,17 1,33 z m 80,-594 V 288 Q 1408,169 1323.5,84.5 1239,0 1120,0 H 288 Q 169,0 84.5,84.5 0,169 0,288 v 832 Q 0,1239 84.5,1323.5 169,1408 288,1408 h 832 q 63,0 117,-25 15,-7 18,-23 3,-17 -9,-29 l -49,-49 q -14,-14 -32,-8 -23,6 -45,6 H 288 q -66,0 -113,-47 -47,-47 -47,-113 V 288 q 0,-66 47,-113 47,-47 113,-47 h 832 q 66,0 113,47 47,47 47,113 v 126 q 0,13 9,22 l 64,64 q 15,15 35,7 20,-8 20,-29 z M 1312,1216 1600,928 928,256 H 640 v 288 z m 444,-132 -92,-92 -288,288 92,92 q 28,28 68,28 40,0 68,-28 l 152,-152 q 28,-28 28,-68 0,-40 -28,-68 z" />
        </g>
      </svg>
    );
  } else if (type === "trash") {
    return (
      <svg viewBox="0 -256 1792 1792" width="100%" height="100%">
        <g transform="matrix(1,0,0,-1,197.42373,1255.0508)">
          <path d="M 512,800 V 224 q 0,-14 -9,-23 -9,-9 -23,-9 h -64 q -14,0 -23,9 -9,9 -9,23 v 576 q 0,14 9,23 9,9 23,9 h 64 q 14,0 23,-9 9,-9 9,-23 z m 256,0 V 224 q 0,-14 -9,-23 -9,-9 -23,-9 h -64 q -14,0 -23,9 -9,9 -9,23 v 576 q 0,14 9,23 9,9 23,9 h 64 q 14,0 23,-9 9,-9 9,-23 z m 256,0 V 224 q 0,-14 -9,-23 -9,-9 -23,-9 h -64 q -14,0 -23,9 -9,9 -9,23 v 576 q 0,14 9,23 9,9 23,9 h 64 q 14,0 23,-9 9,-9 9,-23 z M 1152,76 v 948 H 256 V 76 Q 256,54 263,35.5 270,17 277.5,8.5 285,0 288,0 h 832 q 3,0 10.5,8.5 7.5,8.5 14.5,27 7,18.5 7,40.5 z M 480,1152 h 448 l -48,117 q -7,9 -17,11 H 546 q -10,-2 -17,-11 z m 928,-32 v -64 q 0,-14 -9,-23 -9,-9 -23,-9 h -96 V 76 q 0,-83 -47,-143.5 -47,-60.5 -113,-60.5 H 288 q -66,0 -113,58.5 Q 128,-11 128,72 v 952 H 32 q -14,0 -23,9 -9,9 -9,23 v 64 q 0,14 9,23 9,9 23,9 h 309 l 70,167 q 15,37 54,63 39,26 79,26 h 320 q 40,0 79,-26 39,-26 54,-63 l 70,-167 h 309 q 14,0 23,-9 9,-9 9,-23 z" />
        </g>
      </svg>
    );
  } else if (type === "check") {
    return (
      <svg viewBox="0 -256 1792 1792" width="100%" height="100%">
        <g transform="matrix(1,0,0,-1,75.932203,1368.9492)">
          <path d="M 1408,606 V 288 Q 1408,169 1323.5,84.5 1239,0 1120,0 H 288 Q 169,0 84.5,84.5 0,169 0,288 v 832 Q 0,1239 84.5,1323.5 169,1408 288,1408 h 832 q 63,0 117,-25 15,-7 18,-23 3,-17 -9,-29 l -49,-49 q -10,-10 -23,-10 -3,0 -9,2 -23,6 -45,6 H 288 q -66,0 -113,-47 -47,-47 -47,-113 V 288 q 0,-66 47,-113 47,-47 113,-47 h 832 q 66,0 113,47 47,47 47,113 v 254 q 0,13 9,22 l 64,64 q 10,10 23,10 6,0 12,-3 20,-8 20,-29 z m 231,489 -814,-814 q -24,-24 -57,-24 -33,0 -57,24 L 281,711 q -24,24 -24,57 0,33 24,57 l 110,110 q 24,24 57,24 33,0 57,-24 l 263,-263 647,647 q 24,24 57,24 33,0 57,-24 l 110,-110 q 24,-24 24,-57 0,-33 -24,-57 z" />
        </g>
      </svg>
    );
  } else if (type === "add") {
    return (
      <svg viewBox="0 -256 1792 1792" width="100%" height="100%">
        <g transform="matrix(1,0,0,-1,205.01695,1368.9492)">
          <path d="M 1408,800 V 608 q 0,-40 -28,-68 -28,-28 -68,-28 H 896 V 96 Q 896,56 868,28 840,0 800,0 H 608 Q 568,0 540,28 512,56 512,96 V 512 H 96 Q 56,512 28,540 0,568 0,608 v 192 q 0,40 28,68 28,28 68,28 h 416 v 416 q 0,40 28,68 28,28 68,28 h 192 q 40,0 68,-28 28,-28 28,-68 V 896 h 416 q 40,0 68,-28 28,-28 28,-68 z" />
        </g>
      </svg>
    );
  } else {
    return <></>;
  }
};

export default memo(FontSVG);
