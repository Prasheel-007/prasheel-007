const fs = require("fs");

const WIDTH = 900;
const HEIGHT = 500;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const TOTAL_WEEKS = 52;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// Temporary fake commit data (Step A will replace this)
let weeks = Array.from({ length: TOTAL_WEEKS }, () => ({
  commits: Math.floor(randomBetween(0, 50))
}));

let planets = weeks.map((week, i) => {
  const baseOrbit = 70;
  return {
    size: 4 + week.commits * 0.18,
    orbit: baseOrbit + i * 5,
    speed: 40 + i * 1.2,
    hue: 190 + week.commits * 2,
    opacity: 0.4 + (week.commits / 60)
  };
});

let svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">

<defs>
  <!-- Glow -->
  <filter id="glow">
    <feGaussianBlur stdDeviation="10" result="blur"/>
    <feMerge>
      <feMergeNode in="blur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>

  <!-- Glass Blur -->
  <filter id="glassBlur">
    <feGaussianBlur stdDeviation="12"/>
  </filter>

  <!-- Nebula Gradient -->
  <radialGradient id="nebula" cx="50%" cy="50%" r="60%">
    <stop offset="0%" stop-color="#1a2a6c" stop-opacity="0.7"/>
    <stop offset="100%" stop-color="#0b0f1a" stop-opacity="0"/>
  </radialGradient>
</defs>

<style>
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes driftSlow {
  from { transform: translateX(0px); }
  to { transform: translateX(-200px); }
}

@keyframes driftMedium {
  from { transform: translateX(0px); }
  to { transform: translateX(-300px); }
}
</style>

<!-- Space Background -->
<rect width="100%" height="100%" fill="#0b0f1a"/>

<!-- Nebula -->
<circle cx="${CENTER_X}" cy="${CENTER_Y}" r="320"
        fill="url(#nebula)"
        opacity="0.5"/>

<!-- Starfield Far -->
<g opacity="0.3" style="animation: driftSlow 150s linear infinite;">
  ${Array.from({ length: 100 }).map(() => `
    <circle cx="${Math.random() * WIDTH}"
            cy="${Math.random() * HEIGHT}"
            r="${Math.random() * 1.5}"
            fill="white" />
  `).join("")}
</g>

<!-- Starfield Near -->
<g opacity="0.6" style="animation: driftMedium 80s linear infinite;">
  ${Array.from({ length: 60 }).map(() => `
    <circle cx="${Math.random() * WIDTH}"
            cy="${Math.random() * HEIGHT}"
            r="${Math.random() * 2}"
            fill="white" />
  `).join("")}
</g>

<!-- Orbit Rings -->
${planets.map(p => `
  <ellipse cx="${CENTER_X}" cy="${CENTER_Y}"
           rx="${p.orbit}"
           ry="${p.orbit * 0.75}"
           fill="none"
           stroke="white"
           stroke-opacity="0.06"/>
`).join("")}

<!-- Core Halo -->
<circle cx="${CENTER_X}" cy="${CENTER_Y}" r="95"
        fill="cyan"
        opacity="0.08"
        filter="url(#glow)"/>

<!-- Core -->
<circle cx="${CENTER_X}" cy="${CENTER_Y}" r="45"
        fill="cyan"
        opacity="0.85"
        filter="url(#glow)">
  <animate attributeName="r"
           values="42;52;42"
           dur="4s"
           repeatCount="indefinite"/>
</circle>
`;

// Planets (Elliptical + Mixed Direction)
planets.forEach((planet, index) => {

  const direction = index % 2 === 0 ? "normal" : "reverse";
  const scaleY = 0.75;

  svg += `
  <g style="
      transform-origin:${CENTER_X}px ${CENTER_Y}px;
      animation: rotate ${planet.speed}s linear infinite;
      animation-direction: ${direction};
    ">
    <ellipse
      cx="${CENTER_X + planet.orbit}"
      cy="${CENTER_Y}"
      rx="${planet.size}"
      ry="${planet.size * scaleY}"
      fill="hsl(${planet.hue}, 80%, 60%)"
      opacity="${planet.opacity}"
    />
  </g>
  `;
});

// Glass Panel (Softer + Premium)
svg += `
<g filter="url(#glassBlur)">
  <rect x="250"
        y="150"
        width="400"
        height="200"
        rx="30"
        fill="white"
        opacity="0.04"/>
</g>

<rect x="250"
      y="150"
      width="400"
      height="200"
      rx="30"
      fill="white"
      opacity="0.03"
      stroke="white"
      stroke-opacity="0.25"/>
</svg>
`;

fs.writeFileSync("assets/universe.svg", svg);

console.log("Universe depth version generated.");
