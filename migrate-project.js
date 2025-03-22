const fs = require('fs-extra');
const path = require('path');

// Paths
const rootDir = __dirname;
const startupDir = path.join(rootDir, 'startup-nextjs-main');
const backupDir = path.join(rootDir, 'original-project-backup');

// Backup current project (excluding startup-nextjs-main directory)
console.log('Backing up current project...');
fs.ensureDirSync(backupDir);

// Read all files and directories in the root
const rootItems = fs.readdirSync(rootDir);

// Copy each item to backup, excluding the startup-nextjs-main directory and the backup directory itself
rootItems.forEach(item => {
  const itemPath = path.join(rootDir, item);
  if (item !== 'startup-nextjs-main' && item !== path.basename(backupDir) && item !== 'migrate-project.js') {
    fs.copySync(itemPath, path.join(backupDir, item));
  }
});

console.log('Backup completed to:', backupDir);

// Save splash page and related components
console.log('Preserving splash page components...');
const splashPagePath = path.join(rootDir, 'app/splash/page.tsx');
const splashComponentPath = path.join(rootDir, 'app/components/SplashScreen');
const splashAssetsPath = path.join(rootDir, 'public/appear-free');

const tempSplashPage = fs.readFileSync(splashPagePath, 'utf8');
const tempSplashComponent = {};
const splashComponentFiles = fs.readdirSync(splashComponentPath);
splashComponentFiles.forEach(file => {
  const filePath = path.join(splashComponentPath, file);
  tempSplashComponent[file] = fs.readFileSync(filePath, 'utf8');
});

// Copy startup-nextjs-main to root
console.log('Copying startup-nextjs-main to root directory...');
const startupItems = fs.readdirSync(startupDir);

// Delete existing files in root that will be replaced (excluding backup and startup-nextjs-main)
rootItems.forEach(item => {
  const itemPath = path.join(rootDir, item);
  if (
    startupItems.includes(item) && 
    item !== 'startup-nextjs-main' && 
    item !== path.basename(backupDir) && 
    item !== 'migrate-project.js'
  ) {
    fs.removeSync(itemPath);
  }
});

// Copy startup files to root
startupItems.forEach(item => {
  const sourcePath = path.join(startupDir, item);
  const destPath = path.join(rootDir, item);
  if (item !== '.git' && !fs.existsSync(destPath)) {
    fs.copySync(sourcePath, destPath);
  }
});

// Create splash page directory and component
console.log('Integrating splash page into new project structure...');
fs.ensureDirSync(path.join(rootDir, 'app/splash'));
fs.ensureDirSync(path.join(rootDir, 'components/SplashScreen'));
fs.ensureDirSync(path.join(rootDir, 'public/appear-free/assets/img'));

// Copy splash assets
if (fs.existsSync(splashAssetsPath)) {
  fs.copySync(splashAssetsPath, path.join(rootDir, 'public/appear-free'));
}

// Write splash page
fs.writeFileSync(
  path.join(rootDir, 'app/splash/page.tsx'),
  tempSplashPage.replace(
    "import SplashScreen from '../components/SplashScreen';", 
    "import SplashScreen from '@/components/SplashScreen';"
  )
);

// Write splash component files
Object.entries(tempSplashComponent).forEach(([file, content]) => {
  fs.writeFileSync(
    path.join(rootDir, 'components/SplashScreen', file),
    content.replace(
      "import shape1 from '../../../public/appear-free/assets/img/shape-1.svg';",
      "import shape1 from '../../public/appear-free/assets/img/shape-1.svg';"
    ).replace(
      "import shape2 from '../../../public/appear-free/assets/img/shape-2.svg';",
      "import shape2 from '../../public/appear-free/assets/img/shape-2.svg';"
    ).replace(
      "import shape3 from '../../../public/appear-free/assets/img/shape-3.svg';",
      "import shape3 from '../../public/appear-free/assets/img/shape-3.svg';"
    ).replace(
      "import shape4 from '../../../public/appear-free/assets/img/shape-4.svg';",
      "import shape4 from '../../public/appear-free/assets/img/shape-4.svg';"
    ).replace(
      "import shape5 from '../../../public/appear-free/assets/img/shape-5.svg';",
      "import shape5 from '../../public/appear-free/assets/img/shape-5.svg';"
    ).replace(
      "import shape6 from '../../../public/appear-free/assets/img/shape-6.svg';",
      "import shape6 from '../../public/appear-free/assets/img/shape-6.svg';"
    ).replace(
      "import img1 from '../../../public/appear-free/assets/img/img-1.svg';",
      "import img1 from '../../public/appear-free/assets/img/img-1.svg';"
    )
  );
});

// Create index.tsx for SplashScreen component
fs.writeFileSync(
  path.join(rootDir, 'components/SplashScreen/index.tsx'),
  "import SplashScreen from './SplashScreen';\n\nexport default SplashScreen;"
);

// Create middleware for splash page redirection
console.log('Creating middleware for splash page redirection...');
fs.writeFileSync(
  path.join(rootDir, 'middleware.ts'),
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
const originalPackageJson = require('./original-project-backup/package.json');
const startupPackageJson = require('./startup-nextjs-main/package.json');
const newPackageJson = require('./package.json');

// Merge dependencies
newPackageJson.dependencies = {
  ...newPackageJson.dependencies,
  ...originalPackageJson.dependencies,
  "react-alice-carousel": originalPackageJson.dependencies["react-alice-carousel"],
  "react-select": originalPackageJson.dependencies["react-select"]
};

// Update name and version
newPackageJson.name = "leadership-connections";
newPackageJson.version = originalPackageJson.version;

// Write updated package.json
fs.writeFileSync(
  path.join(rootDir, 'package.json'),
  JSON.stringify(newPackageJson, null, 2)
);

console.log('Migration completed successfully!');
console.log('Please run "npm install" to install all dependencies.');
console.log('Then run "npm run dev" to start the development server.');
