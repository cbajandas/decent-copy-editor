#!/usr/bin/env node

/**
 * Build script for creating distributable packages
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const platform = process.platform;
const args = process.argv.slice(2);

console.log('🚀 Building Decent Copy Editor for distribution...\n');

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}
if (fs.existsSync('release')) {
  fs.rmSync('release', { recursive: true, force: true });
}

try {
  // Build the application
  console.log('📦 Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Create distributables based on platform or argument
  let buildCommand = 'npm run dist';
  
  if (args.includes('--win') || platform === 'win32') {
    buildCommand = 'npm run dist:win';
    console.log('🖥️  Building for Windows...');
  } else if (args.includes('--mac') || platform === 'darwin') {
    buildCommand = 'npm run dist:mac';
    console.log('🍎 Building for macOS...');
  } else if (args.includes('--linux') || platform === 'linux') {
    buildCommand = 'npm run dist:linux';
    console.log('🐧 Building for Linux...');
  } else {
    console.log('📱 Building for all platforms...');
  }

  execSync(buildCommand, { stdio: 'inherit' });

  console.log('\n✅ Build completed successfully!');
  console.log('📁 Check the "release" folder for distributable files.');
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
