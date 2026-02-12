const fs = require("fs");

const WIDTH = 900;
const HEIGHT = 500;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const TOTAL_WEEKS = 52;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// Fake data (we replace later with real GitHub data)
let weeks = Array.from({ length: TOTAL_WEEKS }, () => ({
  commits: Math.floor(randomBetween(0, 50))
}));

let planets = weeks.map((week, i) => {
  const baseOrbit = 70;
  return {
    size: 4 + week.commits * 0.18,
    orbit: baseOrbit + i * 5,
    speed: 50 + i * 1.5,
    hue: 190 + week.commits * 2,
    opacity: 0.4 + (week.commits / 50)
  };
});

let svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">

<defs>
  <!-- Glow -->
  <filter id="glow">
    <feGaussianBlur stdDeviation="8" result="blur"/>
    <feMerge>
      <feMergeNode in="blur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>

  <!-- Glass Blur -->
  <filter id="glassBlur">
    <feGaussianBlur stdDeviation="10"/>
  </filter>

  <!-- Nebula Gradient -->
  <radialGradient id="nebula" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#1a2a6c" stop-opacity="0.6"/>
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

<!-- Nebula Glow -->
<circle cx="${CENTER_X}" cy="${CENTER_Y}" r="300" fill="url(#nebula)" opacity="0.4"/>

<!-- Starfield Far -->
<g opacity="0.3" style="animation: driftSlow 140s linear infinite;">
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
  <circle cx="${CENTER_X}" cy="${CENTER_Y}"
          r="${p.orbit}"
          fill="none"
          stroke="white"
          stroke-opacity="0.05"/>
`).join("")}

<!-- Core -->
<circle cx="${CENTER_X}" cy="${CENTER_Y}" r="45"
        fill="cyan"
        opacity="0.8"
        filter="url(#glow)">
  <animate attributeName="r"
           values="42;50;42"
           dur="4s"
           repeatCount="indefinite"/>
</circle>
`;

// Planets
planets.forEach((planet) => {
  svg += `
  <g style="transform-origin:${CENTER_X}px ${CENTER_Y}px;
            animation: rotate ${planet.speed}s linear infinite;">
    <circle cx="${CENTER_X + planet.orbit}"
            cy="${CENTER_Y}"
            r="${planet.size}"
            fill="hsl(${planet.hue}, 80%, 60%)"
            opacity="${planet.opacity}" />
  </g>
  `;
});

// Glass Panel
svg += `
<g filter="url(#glassBlur)">
  <rect x="250"
        y="150"
        width="400"
        height="200"
        rx="25"
        fill="white"
        opacity="0.07"/>
</g>

<rect x="250"
      y="150"
      width="400"
      height="200"
      rx="25"
      fill="white"
      opacity="0.05"
      stroke="white"
      stroke-opacity="0.2"/>
</svg>
`;

fs.writeFileSync("assets/universe.svg", svg);

console.log("Upgraded Universe generated.");
