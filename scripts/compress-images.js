const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const MAX_SIZE_MB = 2; // Target max size in MB
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const MIN_SIZE_TO_COMPRESS_MB = 0.5; // Only compress files larger than 500KB
const MIN_SIZE_TO_COMPRESS_BYTES = MIN_SIZE_TO_COMPRESS_MB * 1024 * 1024;
const QUALITY_START = 85; // Starting quality
const QUALITY_MIN = 60; // Minimum quality to try

// Track statistics
let stats = {
  totalFiles: 0,
  compressedFiles: 0,
  skippedFiles: 0,
  totalSizeBefore: 0,
  totalSizeAfter: 0,
  errors: 0
};

async function compressImage(filePath) {
  try {
    const fileStats = fs.statSync(filePath);
    const fileSizeMB = fileStats.size / (1024 * 1024);
    
    stats.totalFiles++;
    stats.totalSizeBefore += fileStats.size;

    // Skip if file is already small enough
    if (fileStats.size < MIN_SIZE_TO_COMPRESS_BYTES) {
      console.log(`⏭️  Skipping ${path.basename(filePath)} (${fileSizeMB.toFixed(2)}MB - already optimized)`);
      stats.skippedFiles++;
      stats.totalSizeAfter += fileStats.size;
      return;
    }

    console.log(`\n🔄 Compressing ${path.basename(filePath)} (${fileSizeMB.toFixed(2)}MB)...`);

    const ext = path.extname(filePath).toLowerCase();
    let quality = QUALITY_START;
    let compressed = false;
    let outputBuffer;

    // Create a temporary file path
    const tempPath = filePath + '.tmp';

    // Try compressing with decreasing quality until we hit target size
    while (quality >= QUALITY_MIN && !compressed) {
      const image = sharp(filePath);
      const metadata = await image.metadata();

      if (ext === '.png') {
        // Convert PNG to JPG for better compression (unless it has transparency)
        if (metadata.hasAlpha) {
          outputBuffer = await image
            .png({ quality, compressionLevel: 9 })
            .toBuffer();
        } else {
          // Convert to JPEG for better compression
          const newPath = filePath.replace('.png', '.jpg');
          outputBuffer = await image
            .jpeg({ quality, mozjpeg: true })
            .toBuffer();
          
          if (outputBuffer.length <= MAX_SIZE_BYTES) {
            fs.writeFileSync(newPath, outputBuffer);
            fs.unlinkSync(filePath); // Remove original PNG
            console.log(`✅ Converted PNG to JPG and compressed to ${(outputBuffer.length / (1024 * 1024)).toFixed(2)}MB at quality ${quality}`);
            compressed = true;
            stats.totalSizeAfter += outputBuffer.length;
            stats.compressedFiles++;
            return;
          }
        }
      } else {
        // JPEG compression
        outputBuffer = await image
          .jpeg({ quality, mozjpeg: true })
          .toBuffer();
      }

      if (outputBuffer.length <= MAX_SIZE_BYTES) {
        fs.writeFileSync(tempPath, outputBuffer);
        fs.renameSync(tempPath, filePath);
        const newSizeMB = outputBuffer.length / (1024 * 1024);
        const savings = ((fileStats.size - outputBuffer.length) / fileStats.size * 100).toFixed(1);
        console.log(`✅ Compressed to ${newSizeMB.toFixed(2)}MB at quality ${quality} (${savings}% reduction)`);
        compressed = true;
        stats.totalSizeAfter += outputBuffer.length;
        stats.compressedFiles++;
        return;
      }

      quality -= 5; // Decrease quality and try again
    }

    if (!compressed) {
      // If we couldn't get it small enough, use the smallest we achieved
      console.log(`⚠️  Could not compress below ${MAX_SIZE_MB}MB, using quality ${QUALITY_MIN}`);
      fs.writeFileSync(tempPath, outputBuffer);
      fs.renameSync(tempPath, filePath);
      stats.totalSizeAfter += outputBuffer.length;
      stats.compressedFiles++;
    }

  } catch (error) {
    console.error(`❌ Error compressing ${filePath}:`, error.message);
    stats.errors++;
    // Keep original file size in stats
    const fileStats = fs.statSync(filePath);
    stats.totalSizeAfter += fileStats.size;
  }
}

async function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        await compressImage(fullPath);
      }
    }
  }
}

async function main() {
  const imageDirs = [
    path.join(__dirname, '..', 'public', 'images', 'programs'),
    path.join(__dirname, '..', 'public', 'images', 'hero')
  ];
  
  console.log('🚀 Starting image compression...');
  console.log(`🎯 Target max size: ${MAX_SIZE_MB}MB`);
  console.log(`📏 Minimum size to compress: ${MIN_SIZE_TO_COMPRESS_MB}MB\n`);

  const startTime = Date.now();
  for (const dir of imageDirs) {
    console.log(`\n📁 Processing directory: ${dir}`);
    await processDirectory(dir);
  }
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  // Print statistics
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPRESSION SUMMARY');
  console.log('='.repeat(60));
  console.log(`📁 Total files processed: ${stats.totalFiles}`);
  console.log(`✅ Files compressed: ${stats.compressedFiles}`);
  console.log(`⏭️  Files skipped (already optimized): ${stats.skippedFiles}`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log(`\n💾 Total size before: ${(stats.totalSizeBefore / (1024 * 1024)).toFixed(2)}MB`);
  console.log(`💾 Total size after: ${(stats.totalSizeAfter / (1024 * 1024)).toFixed(2)}MB`);
  const totalSavings = stats.totalSizeBefore - stats.totalSizeAfter;
  const savingsPercent = ((totalSavings / stats.totalSizeBefore) * 100).toFixed(1);
  console.log(`📉 Total savings: ${(totalSavings / (1024 * 1024)).toFixed(2)}MB (${savingsPercent}%)`);
  console.log(`⏱️  Time taken: ${duration}s`);
  console.log('='.repeat(60));
}

main().catch(console.error);
