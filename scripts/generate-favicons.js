import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [16, 32, 192, 512];
const inputFile = join(__dirname, '../public/images/Isotipo.png');
const outputDir = join(__dirname, '../public/images');

async function generateFavicons() {
  try {
    for (const size of sizes) {
      const outputFile = join(outputDir, `favicon-${size}x${size}.png`);
      await sharp(inputFile)
        .resize(size, size)
        .toFile(outputFile);
      console.log(`Generated ${outputFile}`);
    }
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons(); 