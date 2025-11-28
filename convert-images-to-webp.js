#!/usr/bin/env node

/**
 * Convert all images to WebP format for faster website loading
 * This script finds all images and creates WebP versions
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Directories to search for images
const IMAGE_DIRECTORIES = [
  'public/images',
  'public/assets',
];

// Image extensions to convert
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];

// WebP quality settings
const WEBP_QUALITY = 85; // 85% quality for good balance

// Statistics
let stats = {
  totalImages: 0,
  converted: 0,
  skipped: 0,
  errors: 0,
  originalSize: 0,
  webpSize: 0,
};

/**
 * Get all image files recursively
 */
function getAllImageFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    console.log(`⚠️  Directory not found: ${dir}`);
    return fileList;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Convert image to WebP
 */
async function convertToWebP(imagePath) {
  try {
    const ext = path.extname(imagePath);
    const webpPath = imagePath.replace(ext, '.webp');

    // Skip if WebP already exists
    if (fs.existsSync(webpPath)) {
      console.log(`  ⏭️  Skipped (already exists): ${path.basename(webpPath)}`);
      stats.skipped++;
      return;
    }

    // Get original file size
    const originalStats = fs.statSync(imagePath);
    stats.originalSize += originalStats.size;

    // Convert to WebP
    await sharp(imagePath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath);

    // Get WebP file size
    const webpStats = fs.statSync(webpPath);
    stats.webpSize += webpStats.size;

    const savings = ((originalStats.size - webpStats.size) / originalStats.size * 100).toFixed(1);
    const originalKB = (originalStats.size / 1024).toFixed(1);
    const webpKB = (webpStats.size / 1024).toFixed(1);

    console.log(`  ✅ Converted: ${path.basename(imagePath)} → ${path.basename(webpPath)}`);
    console.log(`     ${originalKB}KB → ${webpKB}KB (${savings}% smaller)`);
    
    stats.converted++;
  } catch (error) {
    console.error(`  ❌ Error converting ${imagePath}:`, error.message);
    stats.errors++;
  }
}

/**
 * Main conversion function
 */
async function convertAllImages() {
  console.log('🚀 Starting image conversion to WebP...\n');

  // Get all image files
  let allImages = [];
  for (const dir of IMAGE_DIRECTORIES) {
    const images = getAllImageFiles(dir);
    allImages = allImages.concat(images);
  }

  stats.totalImages = allImages.length;

  if (allImages.length === 0) {
    console.log('⚠️  No images found to convert.');
    return;
  }

  console.log(`📊 Found ${allImages.length} images to process\n`);

  // Convert each image
  for (const imagePath of allImages) {
    await convertToWebP(imagePath);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('✨ Conversion Complete!');
  console.log('='.repeat(60));
  console.log(`📊 Statistics:`);
  console.log(`   Total images found: ${stats.totalImages}`);
  console.log(`   ✅ Converted: ${stats.converted}`);
  console.log(`   ⏭️  Skipped: ${stats.skipped}`);
  console.log(`   ❌ Errors: ${stats.errors}`);
  
  if (stats.converted > 0) {
    const totalSavings = ((stats.originalSize - stats.webpSize) / stats.originalSize * 100).toFixed(1);
    const originalMB = (stats.originalSize / 1024 / 1024).toFixed(2);
    const webpMB = (stats.webpSize / 1024 / 1024).toFixed(2);
    const savedMB = (originalMB - webpMB).toFixed(2);
    
    console.log(`\n💾 Storage Savings:`);
    console.log(`   Original size: ${originalMB} MB`);
    console.log(`   WebP size: ${webpMB} MB`);
    console.log(`   Saved: ${savedMB} MB (${totalSavings}% reduction)`);
  }
  
  console.log('\n🎉 All images converted to WebP format!');
  console.log('📝 Next steps:');
  console.log('   1. Update image references in your code');
  console.log('   2. Test the website to ensure images load correctly');
  console.log('   3. Consider removing original images to save space');
}

// Check if sharp is installed
try {
  require.resolve('sharp');
} catch (e) {
  console.error('❌ Error: sharp package not found!');
  console.error('\nPlease install it first:');
  console.error('  npm install sharp --save-dev');
  console.error('\nThen run this script again.');
  process.exit(1);
}

// Run conversion
convertAllImages().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
