const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "..", "public", "thumbnails", "presentations");
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

// 1. Pitch Deck Card SVG
const pitchCardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
  <rect width="400" height="240" rx="8" fill="#0f172a"/>
  <!-- Slide aspect ratio box -->
  <g transform="translate(40, 20)">
    <rect width="320" height="180" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <rect x="25" y="35" width="80" height="10" rx="3" fill="#38bdf8"/>
    <rect x="25" y="55" width="220" height="18" rx="4" fill="#ffffff"/>
    <rect x="25" y="80" width="160" height="8" rx="2" fill="#94a3b8"/>
    <!-- Metric cards -->
    <rect x="25" y="105" width="80" height="45" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>
    <rect x="35" y="115" width="40" height="6" rx="2" fill="#38bdf8"/>
    <rect x="35" y="127" width="50" height="12" rx="2" fill="#ffffff"/>
    
    <rect x="120" y="105" width="80" height="45" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>
    <rect x="130" y="115" width="40" height="6" rx="2" fill="#38bdf8"/>
    <rect x="130" y="127" width="50" height="12" rx="2" fill="#ffffff"/>
    
    <rect x="215" y="105" width="80" height="45" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>
    <rect x="225" y="115" width="40" height="6" rx="2" fill="#38bdf8"/>
    <rect x="225" y="127" width="50" height="12" rx="2" fill="#ffffff"/>
  </g>
</svg>`;
fs.writeFileSync(path.join(baseDir, "pitch-deck.svg"), pitchCardSvg);

// 2. QBR Card SVG
const qbrCardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
  <rect width="400" height="240" rx="8" fill="#f8fafc"/>
  <g transform="translate(40, 20)">
    <rect width="320" height="180" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="0" y="0" width="320" height="35" rx="6" fill="#1e3a8a"/>
    <rect x="20" y="12" width="120" height="10" rx="3" fill="#ffffff"/>
    <rect x="20" y="55" width="160" height="14" rx="3" fill="#0f172a"/>
    <!-- Financial bar chart -->
    <rect x="20" y="85" width="280" height="75" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
    <rect x="40" y="125" width="24" height="30" rx="2" fill="#3b82f6"/>
    <rect x="80" y="110" width="24" height="45" rx="2" fill="#10b981"/>
    <rect x="120" y="118" width="24" height="37" rx="2" fill="#3b82f6"/>
    <rect x="160" y="95" width="24" height="60" rx="2" fill="#10b981"/>
    <rect x="200" y="105" width="24" height="50" rx="2" fill="#3b82f6"/>
    <rect x="240" y="90" width="24" height="65" rx="2" fill="#10b981"/>
  </g>
</svg>`;
fs.writeFileSync(path.join(baseDir, "qbr.svg"), qbrCardSvg);

// 3. Product Launch Card SVG
const productCardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
  <rect width="400" height="240" rx="8" fill="#3b0764"/>
  <g transform="translate(40, 20)">
    <rect width="320" height="180" rx="6" fill="#4c1d95" stroke="#7e22ce" stroke-width="1.5"/>
    <rect x="25" y="30" width="90" height="8" rx="2" fill="#f59e0b"/>
    <rect x="25" y="48" width="200" height="20" rx="4" fill="#ffffff"/>
    <rect x="25" y="75" width="140" height="8" rx="2" fill="#e9d5ff"/>
    <!-- Feature cards -->
    <rect x="25" y="100" width="80" height="55" rx="4" fill="#581c87" stroke="#f59e0b" stroke-width="1"/>
    <circle cx="45" cy="118" r="8" fill="#f59e0b"/>
    <rect x="35" y="135" width="50" height="6" rx="2" fill="#ffffff"/>

    <rect x="120" y="100" width="80" height="55" rx="4" fill="#581c87" stroke="#f59e0b" stroke-width="1"/>
    <circle cx="140" cy="118" r="8" fill="#f59e0b"/>
    <rect x="130" y="135" width="50" height="6" rx="2" fill="#ffffff"/>

    <rect x="215" y="100" width="80" height="55" rx="4" fill="#581c87" stroke="#f59e0b" stroke-width="1"/>
    <circle cx="235" cy="118" r="8" fill="#f59e0b"/>
    <rect x="225" y="135" width="50" height="6" rx="2" fill="#ffffff"/>
  </g>
</svg>`;
fs.writeFileSync(path.join(baseDir, "product-launch.svg"), productCardSvg);

console.log("Card SVGs created!");
