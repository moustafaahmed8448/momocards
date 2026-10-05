/** Jagged fracture lines radiating from the monogram. */
const CRACKS = [
  "M60 60 L47 45 L55 37 L43 27",
  "M60 60 L73 46 L65 39 L77 29",
  "M60 60 L55 77 L64 85 L59 96",
  "M60 60 L69 69 L62 77 L73 86",
];

/** Irregular wax blobs around the rim — reads as molten wax, zero filter cost. */
const DRIPS = [
  { cx: 30, cy: 74, r: 7 },
  { cx: 45, cy: 87, r: 6 },
  { cx: 76, cy: 86, r: 8 },
  { cx: 91, cy: 71, r: 6.5 },
  { cx: 87, cy: 39, r: 5.5 },
  { cx: 36, cy: 37, r: 5 },
];

interface WaxSealProps {
  monogram: string;
}

export default function WaxSeal({ monogram }: WaxSealProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className="mo-seal h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="waxBody" cx="38%" cy="30%" r="74%">
          <stop offset="0%" stopColor="var(--m-seal-hi)" />
          <stop offset="44%" stopColor="var(--m-seal)" />
          <stop offset="100%" stopColor="var(--m-seal-deep)" />
        </radialGradient>
        <radialGradient id="waxSheen" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Wax body */}
      <g fill="url(#waxBody)">
        <circle cx="60" cy="60" r="42" />
        {DRIPS.map((d) => (
          <circle key={`${d.cx}-${d.cy}`} cx={d.cx} cy={d.cy} r={d.r} />
        ))}
      </g>

      {/* Specular sheen + rim shading */}
      <ellipse cx="47" cy="45" rx="26" ry="21" fill="url(#waxSheen)" />
      <circle
        cx="60"
        cy="60"
        r="41"
        fill="none"
        stroke="var(--m-lining)"
        strokeOpacity="0.7"
        strokeWidth="1.6"
      />

      {/* Embossed ring */}
      <circle
        cx="60"
        cy="58"
        r="30"
        fill="none"
        stroke="var(--m-seal-hi)"
        strokeOpacity="0.38"
        strokeWidth="1.6"
      />
      <circle
        cx="60"
        cy="58"
        r="26.5"
        fill="none"
        stroke="var(--m-seal-deep)"
        strokeOpacity="0.85"
        strokeWidth="1.2"
      />

      {/* Embossed monogram: shadow pass + highlight pass */}
      <text
        x="60"
        y="60.5"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-amiri"
        fontSize="34"
        fontWeight="700"
        fill="var(--m-seal-deep)"
        fillOpacity="0.6"
      >
        {monogram}
      </text>
      <text
        x="60"
        y="57.5"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-amiri"
        fontSize="34"
        fontWeight="700"
        fill="var(--m-seal-hi)"
        fillOpacity="0.95"
      >
        {monogram}
      </text>

      {/* Fracture — `pathLength="1"` lets CSS animate the draw
          with unit dash values, no JS, no layout thrash. */}
      <g className="mo-crack">
        {CRACKS.map((d) => (
          <path
            key={d}
            d={d}
            pathLength="1"
            fill="none"
            stroke="var(--m-paper-hi)"
            strokeOpacity="0.92"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        ))}
      </g>
    </svg>
  );
}