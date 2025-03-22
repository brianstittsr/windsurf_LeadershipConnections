const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// List of component directories
const componentDirs = fs.readdirSync(path.join(__dirname, 'app/components'));

// Process each component directory
componentDirs.forEach(dir => {
  const indexFile = path.join(__dirname, 'app/components', dir, 'index.tsx');
  
  // Check if index.tsx exists
  if (fs.existsSync(indexFile)) {
    const content = fs.readFileSync(indexFile, 'utf8');
    
    // Check if the file contains the problematic import
    if (content.includes('../../components copy')) {
      console.log(`Fixing imports in ${dir}/index.tsx`);
      
      // Extract the component names from the import statement
      const importMatch = content.match(/import\s+\{\s*(.*?)\s*\}\s+from\s+"\.\.\/\.\.\/components copy"/);
      
      if (importMatch && importMatch[1]) {
        const components = importMatch[1].split(',').map(comp => comp.trim());
        
        // Create new import statements
        const newImports = components.map(comp => `import { ${comp} } from "../${comp}";`).join('\n');
        
        // Replace the old import with the new ones
        const newContent = content.replace(/import\s+\{.*?\}\s+from\s+"\.\.\/\.\.\/components copy";/, newImports);
        
        // Write the updated content back to the file
        fs.writeFileSync(indexFile, newContent);
        
        // Add the file to git
        try {
          execSync(`git add "${indexFile}"`, { stdio: 'inherit' });
        } catch (error) {
          console.error(`Error adding ${indexFile} to git:`, error);
        }
      }
    }
  }
});

console.log('All imports fixed!');
