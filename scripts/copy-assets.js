const fs = require('fs');
const path = require('path');

console.log('📋 Copying assets to dist/...');

// Create necessary directories
const dirs = ['dist/icons', 'dist/content', 'dist/background', 'dist/popup', 'dist/panel'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copy manifest
if (fs.existsSync('public/manifest.json')) {
  fs.copyFileSync('public/manifest.json', 'dist/manifest.json');
  console.log('✅ manifest.json copied');
} else {
  console.error('❌ public/manifest.json not found');
}

// Copy icons
if (fs.existsSync('public/icons')) {
  const icons = fs.readdirSync('public/icons');
  icons.forEach(icon => {
    const src = path.join('public/icons', icon);
    const dest = path.join('dist/icons', icon);
    fs.copyFileSync(src, dest);
  });
  console.log(`✅ ${icons.length} icon(s) copied`);
} else {
  console.warn('⚠️  public/icons folder not found (creating placeholders)');
  // Create empty placeholders
  ['icon16.png', 'icon48.png', 'icon128.png'].forEach(icon => {
    fs.writeFileSync(path.join('dist/icons', icon), '');
  });
}

// Copy CSS
if (fs.existsSync('src/content/overlay.css')) {
  fs.copyFileSync('src/content/overlay.css', 'dist/content/overlay.css');
  console.log('✅ overlay.css copied');
}

// Copy popup CSS
if (fs.existsSync('public/popup.css')) {
  fs.copyFileSync('public/popup.css', 'dist/popup.css');
  console.log('✅ popup.css copied');
}

// Copy popup HTML
if (fs.existsSync('public/popup.html')) {
  fs.copyFileSync('public/popup.html', 'dist/popup.html');
  console.log('✅ popup.html copied');
}

// Popup JS is compiled by build-bundle.js, no need to copy

// Copy panel CSS
if (fs.existsSync('src/panel/panel.css')) {
  fs.copyFileSync('src/panel/panel.css', 'dist/panel/panel.css');
  console.log('✅ panel.css copied');
}

// Remove export {} from service worker (Chrome doesn't support ES6 modules in service workers)
const serviceWorkerPath = 'dist/background/service-worker.js';
if (fs.existsSync(serviceWorkerPath)) {
  let content = fs.readFileSync(serviceWorkerPath, 'utf8');
  // Remove export {} at the end of the file
  content = content.replace(/\n\s*export\s*\{\s*\};?\s*$/, '');
  fs.writeFileSync(serviceWorkerPath, content, 'utf8');
  console.log('✅ service-worker.js: export {} removed');
}

// Check compiled files (extractor.js and overlay.js are bundled inside inspector.js)
const requiredFiles = [
  'dist/background/service-worker.js',
  'dist/content/inspector.js'
];

let allPresent = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.error(`❌ ${file} NOT found`);
    allPresent = false;
  }
});

if (allPresent) {
  console.log('\n✅ Build complete!');
  console.log('📝 Next steps:');
  console.log('1. Open Chrome and go to chrome://extensions/');
  console.log('2. Enable "Developer mode"');
  console.log('3. Click "Load unpacked"');
  console.log('4. Select the dist/ folder from this project');
} else {
  console.error('\n❌ Incomplete build! Run "npx tsc" first.');
  process.exit(1);
}
