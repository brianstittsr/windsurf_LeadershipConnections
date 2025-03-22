const https = require('https');
const fs = require('fs');
const path = require('path');

const imageUrls = [
  'https://leadershipconnectionsnc.weebly.com/uploads/1/4/0/6/140631762/lcnclogo-1_1.jpeg',
  'https://leadershipconnectionsnc.weebly.com/uploads/1/4/0/6/140631762/pxl-20230401-143655534_orig.jpg',
  'https://leadershipconnectionsnc.weebly.com/uploads/1/4/0/6/140631762/pxl-20230401-143708398_orig.jpg',
  'https://leadershipconnectionsnc.weebly.com/uploads/1/4/0/6/140631762/pxl-20230401-143715766_orig.jpg',
  'https://leadershipconnectionsnc.weebly.com/uploads/1/4/0/6/140631762/pxl-20230401-143722878_orig.jpg'
];

const publicDir = path.join(__dirname, '..', 'public');
const imagesDir = path.join(publicDir, 'images');

// Create directories if they don't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// Download images
imageUrls.forEach((url, index) => {
  const filename = index === 0 ? 'lcnclogo_1.jpeg' : `slider${index}.jpg`;
  const filepath = index === 0 ? path.join(publicDir, filename) : path.join(imagesDir, filename);
  
  https.get(url, (response) => {
    const fileStream = fs.createWriteStream(filepath);
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
      console.log(`Downloaded: ${filename}`);
      fileStream.close();
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${url}: ${err.message}`);
  });
});
