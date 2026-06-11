const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'dist');

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Ensure destDir exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy other files
const filesToCopy = [
  'index.html',
  'script.js',
  'style.css',
  'channels.m3u',
  'IP-TV.m3u',
  'LICENSE'
];

for (const file of filesToCopy) {
  const srcFile = path.join(srcDir, file);
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, path.join(destDir, file));
    console.log(`Copied ${file} to dist/`);
  }
}

// Apply cache busting to copied files in dist/
let version = '1.1.2';
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(srcDir, 'package.json'), 'utf8'));
  version = pkg.version || '1.1.2';
} catch (e) {
  console.warn('Could not read package.json for cache busting:', e);
}
const timestamp = Date.now();
const cacheBustSuffix = `?v=${version}_${timestamp}`;

const destHtmlPath = path.join(destDir, 'index.html');
if (fs.existsSync(destHtmlPath)) {
  let html = fs.readFileSync(destHtmlPath, 'utf8');
  html = html.replace(/href="style\.css"/g, `href="style.css${cacheBustSuffix}"`);
  html = html.replace(/src="script\.js"/g, `src="script.js${cacheBustSuffix}"`);
  fs.writeFileSync(destHtmlPath, html, 'utf8');
  console.log(`Cache-busted index.html template with suffix ${cacheBustSuffix}`);
}

// Copy folders
const foldersToCopy = ['logo'];
for (const folder of foldersToCopy) {
  const srcFolder = path.join(srcDir, folder);
  if (fs.existsSync(srcFolder)) {
    copyDirSync(srcFolder, path.join(destDir, folder));
    console.log(`Copied directory ${folder} to dist/`);
  }
}
