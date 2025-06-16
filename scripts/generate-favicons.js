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
      
      // Calcular el padding para los iconos maskable/recortados (ej. 20% del tamaño)
      const padding = Math.floor(size * 0.20);
      const innerSize = size - (padding * 2);

      await sharp(inputFile)
        .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }) // Redimensionar el isotipo para que quepa en el espacio reducido
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Fondo transparente
        })
        .toFile(outputFile);
      console.log(`Generated ${outputFile}`);
    }
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons(); 