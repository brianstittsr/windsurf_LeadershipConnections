const https = require('https');
const fs = require('fs');
const path = require('path');

const imageUrls = [
  'https://leadershipconnectionsnc.weebly.com/uploads/1/4/0/6/140631762/groupphoto-on-bench_orig.jpg'
];

const imagesDir = path.join(__dirname, '..', 'public', 'images');

// Create directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Download images
imageUrls.forEach((url) => {
  const filename = 'GroupPhotoOnBench.jpg';
  const filepath = path.join(imagesDir, filename);
  
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
