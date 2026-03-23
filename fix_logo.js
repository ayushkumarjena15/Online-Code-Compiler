import sharp from 'sharp';

async function processImage() {
  try {
    const { info } = await sharp('public/logo.png').trim().toBuffer({ resolveWithObject: true });
    
    // Add 25% padding to the trimmed image width
    const padding = Math.round(info.width * 0.25);
    
    await sharp('public/logo.png')
      .trim()
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: '#ffffff'
      })
      .flatten({ background: '#ffffff' })
      .png()
      .toFile('public/logo-white.png');
      
    console.log("Successfully generated public/logo-white.png with white background and balanced padding.");
  } catch (err) {
    console.error("Error processing image:", err);
  }
}

processImage();
