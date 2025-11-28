#!/usr/bin/env node

/**
 * Update image references to use WebP format
 * This script finds and replaces image references in TSX/JSX files
 */

const fs = require('fs');
const path = require('path');

// Directories to search
const SEARCH_DIRECTORIES = [
  'app',
  'components',
];

// File extensions to process
const FILE_EXTENSIONS = ['.tsx', '.jsx', '.ts', '.js'];

// Image extensions to replace
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];

// Statistics
let stats = {
  filesScanned: 0,
  filesModified: 0,
  referencesUpdated: 0,
};

/**
 * Get all files recursively
 */
function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and .next
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        getAllFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file);
      if (FILE_EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Update image references in file
 */
function updateImageReferences(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let fileUpdated = false;
    let updatesInFile = 0;

    // Pattern 1: src="/images/file.jpg"
    IMAGE_EXTENSIONS.forEach(ext => {
      const pattern = new RegExp(`src="(/images/[^"]+)\\.${ext}"`, 'g');
      const matches = content.match(pattern);
      
      if (matches) {
        matches.forEach(match => {
          // Check if WebP version exists
          const imagePath = match.match(/src="([^"]+)"/)[1];
          const webpPath = imagePath.replace(`.${ext}`, '.webp');
          const fullWebpPath = path.join('public', webpPath);
          
          if (fs.existsSync(fullWebpPath)) {
            // Replace with picture tag for better compatibility
            const imgTag = match.replace(/src="[^"]+"/, `src="${imagePath}"`);
            const pictureTag = `<picture>
  <source srcSet="${webpPath}" type="image/webp" />
  ${imgTag}
</picture>`;
            
            // For now, just replace with webp directly (simpler)
            content = content.replace(match, match.replace(`.${ext}`, '.webp'));
            updatesInFile++;
            fileUpdated = true;
          }
        });
      }
    });

    // Pattern 2: src='/images/file.jpg'
    IMAGE_EXTENSIONS.forEach(ext => {
      const pattern = new RegExp(`src='(/images/[^']+)\\.${ext}'`, 'g');
      const matches = content.match(pattern);
      
      if (matches) {
        matches.forEach(match => {
          const imagePath = match.match(/src='([^']+)'/)[1];
          const webpPath = imagePath.replace(`.${ext}`, '.webp');
          const fullWebpPath = path.join('public', webpPath);
          
          if (fs.existsSync(fullWebpPath)) {
            content = content.replace(match, match.replace(`.${ext}`, '.webp'));
            updatesInFile++;
            fileUpdated = true;
          }
        });
      }
    });

    // Pattern 3: src={"/images/file.jpg"}
    IMAGE_EXTENSIONS.forEach(ext => {
      const pattern = new RegExp(`src=\\{"(/images/[^"]+)\\.${ext}"\\}`, 'g');
      const matches = content.match(pattern);
      
      if (matches) {
        matches.forEach(match => {
          const imagePath = match.match(/src=\{"([^"]+)"\}/)[1];
          const webpPath = imagePath.replace(`.${ext}`, '.webp');
          const fullWebpPath = path.join('public', webpPath);
          
          if (fs.existsSync(fullWebpPath)) {
            content = content.replace(match, match.replace(`.${ext}`, '.webp'));
            updatesInFile++;
            fileUpdated = true;
          }
        });
      }
    });

    // Write back if modified
    if (fileUpdated && content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ Updated: ${filePath} (${updatesInFile} references)`);
      stats.filesModified++;
      stats.referencesUpdated += updatesInFile;
    }

  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Main function
 */
function updateAllReferences() {
  console.log('🚀 Starting image reference update to WebP...\n');

  // Get all files
  let allFiles = [];
  for (const dir of SEARCH_DIRECTORIES) {
    const files = getAllFiles(dir);
    allFiles = allFiles.concat(files);
  }

  stats.filesScanned = allFiles.length;

  if (allFiles.length === 0) {
    console.log('⚠️  No files found to process.');
    return;
  }

  console.log(`📊 Found ${allFiles.length} files to scan\n`);

  // Process each file
  for (const filePath of allFiles) {
    updateImageReferences(filePath);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('✨ Update Complete!');
  console.log('='.repeat(60));
  console.log(`📊 Statistics:`);
  console.log(`   Files scanned: ${stats.filesScanned}`);
  console.log(`   Files modified: ${stats.filesModified}`);
  console.log(`   References updated: ${stats.referencesUpdated}`);
  
  if (stats.filesModified > 0) {
    console.log('\n🎉 Image references updated to WebP format!');
    console.log('📝 Next steps:');
    console.log('   1. Test the website to ensure images load correctly');
    console.log('   2. Check browser console for any errors');
    console.log('   3. Verify images display properly on all pages');
  } else {
    console.log('\n⚠️  No references were updated.');
    console.log('   - Make sure WebP files exist in public/images/');
    console.log('   - Run: npm run convert-to-webp first');
  }
}

// Run update
updateAllReferences();
