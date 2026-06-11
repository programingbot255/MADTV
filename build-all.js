const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting MAD WATCH TV build coordinator...');

try {
  // 1. Setup Logo folder in public/
  console.log('Checking and setting up logo for Vite public directory...');
  if (!fs.existsSync('public/logo')) {
    fs.mkdirSync('public/logo', { recursive: true });
  }
  if (fs.existsSync('logo/Logo-PNG.png')) {
    fs.copyFileSync('logo/Logo-PNG.png', 'public/logo/Logo-PNG.png');
    console.log('Successfully copied logo to public/logo/Logo-PNG.png');
  }

  // 2. Run Vite build
  console.log('Running vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('Vite build completed successfully.');

  // 3. Run Postbuild (Copies to dist/)
  console.log('Running postbuild script...');
  if (fs.existsSync('postbuild.js')) {
    require('./postbuild.js');
    console.log('Postbuild completed.');
  } else {
    console.log('Warning: postbuild.js not found.');
  }

  // 4. Run Build (Copies to www/)
  console.log('Running build script to generate www/ directory...');
  if (fs.existsSync('build.js')) {
    require('./build.js');
    console.log('Build script completed successfully.');
  } else {
    console.log('Warning: build.js not found.');
  }

  console.log('MAD WATCH TV Build process finished successfully!');
} catch (error) {
  console.error('An error occurred during build coordinator execution:', error);
  process.exit(1);
}
