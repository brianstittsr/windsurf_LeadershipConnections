const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const rootDir = __dirname;
const startupDir = path.join(rootDir, 'startup-nextjs-main');
const backupDir = path.join(rootDir, 'original-project-backup');
const tempDir = path.join(rootDir, 'temp-migration');

// Create temp directory for migration
console.log('Setting up temporary directory for migration...');
fs.ensureDirSync(tempDir);

// Backup current project (excluding startup-nextjs-main directory)
console.log('Backing up current project...');
fs.ensureDirSync(backupDir);

// Read all files and directories in the root
const rootItems = fs.readdirSync(rootDir);

// Copy each item to backup, excluding the startup-nextjs-main directory and the backup directory itself
rootItems.forEach(item => {
  const itemPath = path.join(rootDir, item);
  if (
    item !== 'startup-nextjs-main' && 
    item !== path.basename(backupDir) && 
    item !== path.basename(tempDir) && 
    item !== 'migrate-project.js' &&
    item !== 'migrate-project-v2.js'
  ) {
    fs.copySync(itemPath, path.join(backupDir, item));
  }
});

console.log('Backup completed to:', backupDir);

// Save splash page and related components
console.log('Preserving splash page components...');
const splashPagePath = path.join(rootDir, 'app/splash/page.tsx');
const splashComponentPath = path.join(rootDir, 'app/components/SplashScreen');
const splashAssetsPath = path.join(rootDir, 'public/appear-free');

// Copy startup-nextjs-main to temp directory
console.log('Copying startup-nextjs-main to temporary directory...');
fs.copySync(startupDir, tempDir);

// Create splash page directory and component in temp directory
console.log('Integrating splash page into new project structure...');
fs.ensureDirSync(path.join(tempDir, 'app/splash'));
fs.ensureDirSync(path.join(tempDir, 'components/SplashScreen'));
fs.ensureDirSync(path.join(tempDir, 'public/appear-free/assets/img'));

// Copy splash assets to temp directory
if (fs.existsSync(splashAssetsPath)) {
  fs.copySync(splashAssetsPath, path.join(tempDir, 'public/appear-free'));
}

// Copy splash page to temp directory
if (fs.existsSync(splashPagePath)) {
  const splashPageContent = fs.readFileSync(splashPagePath, 'utf8');
  fs.writeFileSync(
    path.join(tempDir, 'app/splash/page.tsx'),
    splashPageContent.replace(
      "import SplashScreen from '../components/SplashScreen';", 
      "import SplashScreen from '@/components/SplashScreen';"
    )
  );
}

// Copy splash component files to temp directory
if (fs.existsSync(splashComponentPath)) {
  const splashComponentFiles = fs.readdirSync(splashComponentPath);
  splashComponentFiles.forEach(file => {
    const filePath = path.join(splashComponentPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Update import paths in SplashScreen.tsx
    if (file === 'SplashScreen.tsx') {
      fs.writeFileSync(
        path.join(tempDir, 'components/SplashScreen', file),
        fileContent
          .replace(/from '\.\.\/\.\.\/\.\.\/public\/appear-free\/assets\/img\//g, "from '../../public/appear-free/assets/img/")
      );
    } else {
      fs.copySync(filePath, path.join(tempDir, 'components/SplashScreen', file));
    }
  });
}

// Create index.tsx for SplashScreen component in temp directory
fs.writeFileSync(
  path.join(tempDir, 'components/SplashScreen/index.tsx'),
  "import SplashScreen from './SplashScreen';\n\nexport default SplashScreen;"
);

// Create middleware for splash page redirection in temp directory
console.log('Creating middleware for splash page redirection...');
fs.writeFileSync(
  path.join(tempDir, 'middleware.ts'),
  `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked \`async\` if using \`await\` inside
export function middleware(request: NextRequest) {
  // Check if the user has visited the splash page before
  const hasSplashCookie = request.cookies.has('splash_viewed');
  
  // If the user is requesting the home page and hasn't seen the splash page yet
  if (request.nextUrl.pathname === '/' && !hasSplashCookie) {
    // Create a response that redirects to the splash page
    const response = NextResponse.redirect(new URL('/splash', request.url));
    
    // Set a cookie to remember that the user has seen the splash page
    response.cookies.set('splash_viewed', 'true', {
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    
    return response;
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/splash'],
};`
);

// Update package.json to include all necessary dependencies
console.log('Updating package.json with all necessary dependencies...');
const originalPackageJson = require('./package.json');
const startupPackageJson = require('./startup-nextjs-main/package.json');

// Create a new package.json with merged dependencies
const newPackageJson = {
  ...startupPackageJson,
  name: "leadership-connections",
  version: originalPackageJson.version,
  dependencies: {
    ...startupPackageJson.dependencies,
    "react-alice-carousel": originalPackageJson.dependencies["react-alice-carousel"] || "^2.9.1",
    "react-select": originalPackageJson.dependencies["react-select"] || "^5.10.1"
  }
};

// Write updated package.json to temp directory
fs.writeFileSync(
  path.join(tempDir, 'package.json'),
  JSON.stringify(newPackageJson, null, 2)
);

// Now move the temp directory contents to the root
console.log('Moving new project structure to root directory...');

// First, clean up the root directory (excluding backups and temp directories)
rootItems.forEach(item => {
  const itemPath = path.join(rootDir, item);
  if (
    item !== 'startup-nextjs-main' && 
    item !== path.basename(backupDir) && 
    item !== path.basename(tempDir) && 
    item !== 'migrate-project.js' &&
    item !== 'migrate-project-v2.js' &&
    item !== 'node_modules' &&
    item !== '.git'
  ) {
    fs.removeSync(itemPath);
  }
});

// Copy temp directory contents to root
const tempItems = fs.readdirSync(tempDir);
tempItems.forEach(item => {
  const sourcePath = path.join(tempDir, item);
  const destPath = path.join(rootDir, item);
  fs.copySync(sourcePath, destPath);
});

// Clean up temp directory
fs.removeSync(tempDir);

console.log('Migration completed successfully!');
console.log('Please run "npm install" to install all dependencies.');
console.log('Then run "npm run dev" to start the development server.');
