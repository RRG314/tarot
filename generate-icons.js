#!/usr/bin/env node

// Simple icon generator for PWA
// Creates placeholder PNG icons using canvas or fallback SVG

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, 'icons');

// Ensure directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Create SVG icon template
function createSVGIcon(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2d1b4e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a0a2e;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.15}"/>
  <g transform="translate(${size/2}, ${size/2})">
    <!-- Mystical star symbol -->
    <path d="M 0,-${size * 0.3} L ${size * 0.08},-${size * 0.08} L ${size * 0.3},0 L ${size * 0.08},${size * 0.08} L 0,${size * 0.3} L -${size * 0.08},${size * 0.08} L -${size * 0.3},0 L -${size * 0.08},-${size * 0.08} Z"
          fill="#d4af37" opacity="0.9"/>
    <!-- Inner circle -->
    <circle cx="0" cy="0" r="${size * 0.15}" fill="none" stroke="#d4af37" stroke-width="${size * 0.015}" opacity="0.7"/>
    <!-- Moon crescent -->
    <path d="M ${size * 0.05},-${size * 0.25} A ${size * 0.12} ${size * 0.12} 0 1 1 ${size * 0.05},${size * 0.25} A ${size * 0.08} ${size * 0.08} 0 1 0 ${size * 0.05},-${size * 0.25}"
          fill="#f4e4bc" opacity="0.8"/>
  </g>
  <text x="${size/2}" y="${size * 0.85}" font-family="serif" font-size="${size * 0.12}" fill="#d4af37" text-anchor="middle" opacity="0.8">TAROT</text>
</svg>`;
}

// Try to use sharp for PNG conversion, fallback to SVG
async function generateIcons() {
  let sharp;
  try {
    sharp = require('sharp');
    console.log('Using sharp for PNG generation...');
  } catch (e) {
    console.log('Sharp not available, creating SVG icons as fallback...');
  }

  for (const size of sizes) {
    const svgContent = createSVGIcon(size);
    const svgPath = path.join(iconDir, `icon-${size}x${size}.svg`);

    // Always save SVG version
    fs.writeFileSync(svgPath, svgContent);
    console.log(`Created ${svgPath}`);

    // Convert to PNG if sharp is available
    if (sharp) {
      try {
        const pngPath = path.join(iconDir, `icon-${size}x${size}.png`);
        await sharp(Buffer.from(svgContent))
          .resize(size, size)
          .png()
          .toFile(pngPath);
        console.log(`Created ${pngPath}`);
      } catch (error) {
        console.log(`Could not create PNG for ${size}x${size}, keeping SVG`);
      }
    }
  }

  // Create screenshot placeholders
  const wideScreenshot = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <rect width="1280" height="720" fill="#0f0f23"/>
  <text x="640" y="360" font-family="serif" font-size="48" fill="#d4af37" text-anchor="middle">Mystic Tarot PWA</text>
</svg>`;

  const narrowScreenshot = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
  <rect width="720" height="1280" fill="#0f0f23"/>
  <text x="360" y="640" font-family="serif" font-size="48" fill="#d4af37" text-anchor="middle">Mystic Tarot PWA</text>
</svg>`;

  fs.writeFileSync(path.join(iconDir, 'screenshot-wide.svg'), wideScreenshot);
  fs.writeFileSync(path.join(iconDir, 'screenshot-narrow.svg'), narrowScreenshot);

  if (sharp) {
    try {
      await sharp(Buffer.from(wideScreenshot))
        .resize(1280, 720)
        .png()
        .toFile(path.join(iconDir, 'screenshot-wide.png'));

      await sharp(Buffer.from(narrowScreenshot))
        .resize(720, 1280)
        .png()
        .toFile(path.join(iconDir, 'screenshot-narrow.png'));

      console.log('Created screenshot files');
    } catch (error) {
      console.log('Could not create screenshot PNGs, keeping SVGs');
    }
  }

  console.log('\n✓ Icon generation complete!');
  console.log('Note: If PNG files were not created, install sharp: npm install sharp');
}

generateIcons().catch(console.error);
