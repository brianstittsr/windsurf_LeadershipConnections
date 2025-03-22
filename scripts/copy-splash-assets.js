const fs = require('fs-extra');
const path = require('path');

// Define source and destination paths
const sourcePath = path.join(__dirname, '../appear-free/assets');
const destPath = path.join(__dirname, '../public/appear-free/assets');

// Create the destination directory if it doesn't exist
fs.ensureDirSync(destPath);

// Copy assets from appear-free to public directory
fs.copySync(sourcePath, destPath, { overwrite: true });

console.log('Splash screen assets copied successfully to public/appear-free/assets');
