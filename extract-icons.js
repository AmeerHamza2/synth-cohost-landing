const sharp = require('sharp');
const path = require('path');

async function compositeIcons() {
  try {
    const iconsPath = path.join(__dirname, 'public', '001icons.png');
    const backgroundPath = path.join(__dirname, 'public', 'Background fot icons.png');
    const outputPath = path.join(__dirname, 'public', 'icons.png');

    // Get metadata for both images
    const iconsMeta = await sharp(iconsPath).metadata();
    const bgMeta = await sharp(backgroundPath).metadata();
    
    console.log('Icons image dimensions:', iconsMeta.width, 'x', iconsMeta.height);
    console.log('Background image dimensions:', bgMeta.width, 'x', bgMeta.height);

    // Use the full 001icons.png and composite it with blend mode
    const iconRow = await sharp(iconsPath)
      .resize(bgMeta.width, bgMeta.height, { fit: 'cover' })
      .toBuffer();

    // Composite icons onto background
    const result = await sharp(backgroundPath)
      .composite([
        {
          input: iconRow,
          gravity: 'center'
        }
      ])
      .toFile(outputPath);

    console.log('Icons composited successfully to:', outputPath);
  } catch (error) {
    console.error('Error compositing icons:', error);
  }
}

compositeIcons();
