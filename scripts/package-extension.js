const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Creating extension package for publication...\n');

// Check if dist/ exists
if (!fs.existsSync('dist')) {
  console.error('❌ dist/ folder not found. Run "npm run build" first.');
  process.exit(1);
}

// Read version from manifest
const manifestPath = path.join('dist', 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('❌ manifest.json not found in dist/');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const version = manifest.version || '1.0.0';
const name = manifest.name.toLowerCase().replace(/\s+/g, '-');

const zipFileName = `${name}-v${version}.zip`;
const zipPath = path.join(process.cwd(), zipFileName);

// Remove previous ZIP if it exists
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
  console.log('🗑️  Removing previous ZIP...');
}

// Create ZIP
try {
  console.log('📦 Creating ZIP file...');
  process.chdir('dist');
  execSync(`zip -r ../${zipFileName} . -x "*.DS_Store" "*.git*"`, { stdio: 'inherit' });
  process.chdir('..');

  // Check file size
  const stats = fs.statSync(zipPath);
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log('\n✅ Package created successfully!');
  console.log(`📁 File: ${zipFileName}`);
  console.log(`📊 Size: ${fileSizeInMB} MB`);
  console.log(`📝 Version: ${version}`);
  console.log('\n📤 Next steps:');
  console.log('1. Go to: https://chrome.google.com/webstore/devconsole');
  console.log('2. Click "New Item"');
  console.log(`3. Upload file: ${zipFileName}`);
  console.log('\n');
} catch (error) {
  console.error('❌ Error creating ZIP:', error.message);
  process.exit(1);
}
