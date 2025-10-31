import fs from 'fs';
import path from 'path';

const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

export const getImages = (dir: string, allFiles: string[] = []) => {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const fileStat = fs.lstatSync(filePath);

    if (fileStat.isDirectory()) {
      getImages(filePath, allFiles);
    } else if (validImageExtensions.some(ext => file.toLowerCase().endsWith(ext))) {
      allFiles.push(filePath.replace('public', ''));
    }
  });

  return allFiles;
};
