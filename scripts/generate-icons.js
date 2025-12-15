const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const iconsDir = path.resolve(__dirname, '../public/icons');
const sizes = [16, 48, 128];

// App colors: purple (primary) and pink (secondary)
const primaryColor = '#8B5CF6'; // Purple
const secondaryColor = '#EC4899'; // Pink
const backgroundColor = '#FFFFFF';

async function generateIcon(size) {
  // Create an icon with purple→pink gradient: a square with borders and a "P" in the center
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${size}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="${backgroundColor}" rx="${size * 0.2}"/>
      <rect x="${size * 0.1}" y="${size * 0.1}" width="${size * 0.8}" height="${size * 0.8}"
            fill="none" stroke="url(#grad${size})" stroke-width="${size * 0.08}" rx="${size * 0.15}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.5}"
            font-weight="bold" fill="url(#grad${size})" text-anchor="middle"
            dominant-baseline="central">P</text>
    </svg>
  `;

  const buffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  const outputPath = path.join(iconsDir, `icon${size}.png`);
  await fs.writeFile(outputPath, buffer);
  console.log(`✅ Gerado: icon${size}.png (${size}x${size})`);
}

async function generateActiveIcon(size) {
  // Active icon: background with purple→pink gradient and white "P"
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="activeGrad${size}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#activeGrad${size})" rx="${size * 0.2}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.5}"
            font-weight="bold" fill="white" text-anchor="middle"
            dominant-baseline="central">P</text>
    </svg>
  `;

  const buffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  const outputPath = path.join(iconsDir, `icon-active${size}.png`);
  await fs.writeFile(outputPath, buffer);
  console.log(`✅ Gerado: icon-active${size}.png (${size}x${size})`);
}

async function generateIcons() {
  console.log('🎨 Generating icons...');

  await fs.ensureDir(iconsDir);

  // Generate normal icons
  for (const size of sizes) {
    await generateIcon(size);
  }

  // Generate active icons
  for (const size of sizes) {
    await generateActiveIcon(size);
  }

  console.log('✅ All icons generated!');
}

generateIcons().catch(err => {
  console.error('❌ Error generating icons:', err);
  process.exit(1);
});
