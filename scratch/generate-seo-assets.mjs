import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Icon (512x512)
const iconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0F17"/>
      <stop offset="100%" stop-color="#182232"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#818CF8"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#3B82F6" stop-opacity="0.8"/>
    </linearGradient>
  </defs>
  
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  <rect x="16" y="16" width="480" height="480" rx="96" fill="none" stroke="url(#accentGrad)" stroke-width="4" stroke-opacity="0.3"/>
  
  <!-- Stylized Globe / Cargo Grid -->
  <g transform="translate(256, 256)">
    <circle r="140" fill="none" stroke="url(#accentGrad)" stroke-width="8" opacity="0.9"/>
    <ellipse rx="140" ry="55" fill="none" stroke="url(#accentGrad)" stroke-width="6" opacity="0.6"/>
    <ellipse rx="55" ry="140" fill="none" stroke="url(#accentGrad)" stroke-width="6" opacity="0.6"/>
    <line x1="-140" y1="0" x2="140" y2="0" stroke="url(#accentGrad)" stroke-width="6" opacity="0.6"/>
    <line x1="0" y1="-140" x2="0" y2="140" stroke="url(#accentGrad)" stroke-width="6" opacity="0.6"/>
    
    <!-- Central P / Signal Node -->
    <circle r="36" fill="#0B0F17" stroke="url(#accentGrad)" stroke-width="6"/>
    <polygon points="-8,-16 12,0 -8,16" fill="url(#accentGrad)"/>
  </g>
</svg>
`;

// 2. OpenGraph Banner (1200x630)
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#07090E"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E1B4B"/>
    </linearGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="50%" stop-color="#818CF8"/>
      <stop offset="100%" stop-color="#C084FC"/>
    </linearGradient>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.07"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02"/>
    </linearGradient>
  </defs>

  <!-- Dark Rich Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Subtle Mesh Overlay Lines -->
  <g stroke="#38BDF8" stroke-opacity="0.08" stroke-width="1">
    <line x1="0" y1="100" x2="1200" y2="100"/>
    <line x1="0" y1="200" x2="1200" y2="200"/>
    <line x1="0" y1="300" x2="1200" y2="300"/>
    <line x1="0" y1="400" x2="1200" y2="400"/>
    <line x1="0" y1="500" x2="1200" y2="500"/>
    <line x1="200" y1="0" x2="200" y2="630"/>
    <line x1="400" y1="0" x2="400" y2="630"/>
    <line x1="600" y1="0" x2="600" y2="630"/>
    <line x1="800" y1="0" x2="800" y2="630"/>
    <line x1="1000" y1="0" x2="1000" y2="630"/>
  </g>

  <!-- Glowing accent orb -->
  <circle cx="950" cy="180" r="280" fill="#38BDF8" opacity="0.12" filter="blur(60px)"/>
  <circle cx="200" cy="450" r="220" fill="#818CF8" opacity="0.1" filter="blur(50px)"/>

  <!-- Content Card container -->
  <rect x="80" y="80" width="1040" height="470" rx="24" fill="url(#cardBg)" stroke="#38BDF8" stroke-opacity="0.2" stroke-width="1.5"/>

  <!-- Header Brand Pill -->
  <rect x="130" y="130" width="210" height="42" rx="21" fill="#38BDF8" fill-opacity="0.1" stroke="#38BDF8" stroke-opacity="0.3"/>
  <text x="235" y="157" font-family="sans-serif" font-size="16" font-weight="700" fill="#38BDF8" text-anchor="middle" letter-spacing="2">CARGO PORTSAI</text>

  <!-- Main Headline -->
  <text x="130" y="245" font-family="sans-serif" font-size="54" font-weight="800" fill="#F8FAFC" letter-spacing="-1">
    AI Export Market Intelligence
  </text>
  <text x="130" y="310" font-family="sans-serif" font-size="54" font-weight="800" fill="url(#textGrad)" letter-spacing="-1">
    for Global Exporters &amp; MSMEs
  </text>

  <!-- Subtitle -->
  <text x="130" y="375" font-family="sans-serif" font-size="22" font-weight="400" fill="#94A3B8">
    Identify high-demand international markets, HS category matching, tariff rates,
  </text>
  <text x="130" y="410" font-family="sans-serif" font-size="22" font-weight="400" fill="#94A3B8">
    and export readiness documentation instantly.
  </text>

  <!-- Domain Tag -->
  <rect x="130" y="460" font-family="sans-serif" width="280" height="44" rx="10" fill="#0F172A" stroke="#334155"/>
  <text x="150" y="488" font-family="monospace" font-size="18" font-weight="600" fill="#38BDF8">cargo.portsai.in</text>
</svg>
`;

async function main() {
  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon.png'));

  await sharp(Buffer.from(iconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  await sharp(Buffer.from(iconSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  await sharp(Buffer.from(iconSvg))
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  await sharp(Buffer.from(iconSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));

  console.log('SEO image assets created successfully in public/');
}

main().catch(console.error);
