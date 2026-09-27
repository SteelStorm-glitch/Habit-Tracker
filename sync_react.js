const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'frontend', 'dist');
const wwwDir = path.join(rootDir, 'www');

console.log('📦 Syncing React build to www/ and root...');

if (!fs.existsSync(distDir)) {
  console.error('❌ frontend/dist does not exist. Please run npm run build first.');
  process.exit(1);
}

// Clean stale assets folders before copy to prevent build clutter
const rootAssets = path.join(rootDir, 'assets');
const wwwAssets = path.join(wwwDir, 'assets');
[rootAssets, wwwAssets].forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// Helper to copy directory recursively
function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive(distDir, wwwDir);
console.log('✓ Synced to www/');

copyRecursive(distDir, rootDir);
console.log('✓ Synced to root/');

// Generate standalone index.html so opening directly via file:// works without CORS issues
const distAssetsDir = path.join(distDir, 'assets');
if (fs.existsSync(distAssetsDir)) {
  const assetFiles = fs.readdirSync(distAssetsDir);
  const newJs = assetFiles.find(f => f.endsWith('.js'));
  const newCss = assetFiles.find(f => f.endsWith('.css'));

  if (newJs && newCss) {
    const cssContent = fs.readFileSync(path.join(distAssetsDir, newCss), 'utf8');
    const jsContent = fs.readFileSync(path.join(distAssetsDir, newJs), 'utf8');

    const standaloneHtml = `<!doctype html>
<html lang="ru" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#121316" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <title>Habit Tracker</title>
    <link rel="icon" type="image/svg+xml" href="favicon.svg" />
    <link rel="stylesheet" href="./assets/${newCss}" />
    <style>
${cssContent}
    </style>
  </head>
  <body class="bg-[#121316] text-neutral-100 antialiased select-none">
    <div id="root"></div>
    <script type="module">
${jsContent}
    </script>
  </body>
</html>`;

    fs.writeFileSync(path.join(rootDir, 'index.html'), standaloneHtml, 'utf8');
    fs.writeFileSync(path.join(wwwDir, 'index.html'), standaloneHtml, 'utf8');
    console.log('✓ Standalone offline index.html generated for root/ and www/');
  }
}

try {
  console.log('🔄 Running Capacitor sync...');
  execSync('npx cap sync', { stdio: 'inherit' });
  console.log('✅ All synced successfully to Capacitor Android!');
} catch (e) {
  console.log('⚠️ Capacitor sync skipped or errored:', e.message);
}
