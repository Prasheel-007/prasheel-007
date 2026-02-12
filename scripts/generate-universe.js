const fs = require("fs");

// ---------- CONFIG ----------
const WIDTH = 900;
const HEIGHT = 500;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const TOTAL_WEEKS = 52;

// ---------- UTILS ----------
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// Fake weekly commit data (next step we replace with real GitHub data)
let weeks = Array.from({ length: TOTAL_WEEKS }, () => ({
  commits: Math.floor(randomBetween(0, 50))
}));

// Convert commits to planet properties
let planets = weeks.map((week, i) => {
  const baseOrbit = 80;
  return {
    size: 4 + week.commits * 0.15,
    orbit: baseOrbit + i * 6,
    speed: 40 + i * 1.2,
    hue: 180 + week.commits * 2
  };
});

// ---------- SVG START ----------
let svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">

<defs>
  <!-- Glass Blur -->
  <filter id="glassBlur">
    <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
  </filter>

  <!-- Soft Glow -->
  <filter id="glow">
    <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
    <feMerge>
      <feMergeNode in="coloredBlur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
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

<!-- Starfield Layer 1 (Far) -->
<g opacity="0.3" style="animation: driftSlow 120s linear infinite;">
  ${Array.from({ length: 100 }).map(() => `
    <circle cx="${Math.random() * WIDTH}"
            cy="${Math.random() * HEIGHT}"
            r="${Math.random() * 1.5}"
            fill="white" />
  `).join("")}
</g>

<!-- Starfield Layer 2 (Near) -->
<g opacity="0.5" style="animation: driftMedium 60s linear infinite;">
  ${Array.from({ length: 60 }).map(() => `
    <circle cx="${Math.random() * WIDTH}"
            cy="${Math.random() * HEIGHT}"
            r="${Math.random() * 2}"
            fill="white" />
  `).join("")}
</g>

<!-- Core -->
<circle cx="${CENTER_X}" cy="${CENTER_Y}" r="40"
        fill="cyan"
        opacity="0.7"
        filter="url(#glow)">
  <animate attributeName="r"
           values="38;44;38"
           dur="3s"
           repeatCount="indefinite"/>
</circle>
`;

// ---------- PLANETS ----------
planets.forEach((planet) => {
  svg += `
  <g style="transform-origin:${CENTER_X}px ${CENTER_Y}px;
            animation: rotate ${planet.speed}s linear infinite;">
    <circle cx="${CENTER_X + planet.orbit}"
            cy="${CENTER_Y}"
            r="${planet.size}"
            fill="hsl(${planet.hue}, 80%, 60%)"
            opacity="0.85" />
  </g>
  `;
});

// ---------- GLASS PANEL ----------
svg += `
<!-- Glass Floating Panel -->
<g filter="url(#glassBlur)">
  <rect x="250"
        y="150"
        width="400"
        height="200"
        rx="20"
        fill="white"
        opacity="0.08"/>
</g>

<rect x="250"
      y="150"
      width="400"
      height="200"
      rx="20"
      fill="white"
      opacity="0.05"
      stroke="white"
      stroke-opacity="0.2"/>

</svg>
`;

// ---------- SAVE FILE ----------
fs.writeFileSync("assets/universe.svg", svg);

console.log("Universe SVG generated successfully.");
