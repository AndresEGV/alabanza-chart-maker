#!/usr/bin/env node

/**
 * Script para generar todos los favicons necesarios
 * Requiere: npm install sharp
 * 
 * Ejecutar: node scripts/generate-favicons.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`
===========================================
GENERADOR DE FAVICONS
===========================================

Para generar todos los favicons necesarios, sigue estos pasos:

1. Instala las herramientas necesarias:
   npm install -g svgexport

2. Genera los PNGs desde el SVG:
   
   # Favicon estándar
   svgexport public/favicon.svg public/favicon-16x16.png 16:16
   svgexport public/favicon.svg public/favicon-32x32.png 32:32
   
   # Apple Touch Icon (con fondo)
   svgexport public/favicon.svg public/apple-touch-icon.png 180:180 "svg {background: white;}"
   
   # Android Chrome icons
   svgexport public/favicon.svg public/android-chrome-192x192.png 192:192
   svgexport public/favicon.svg public/android-chrome-512x512.png 512:512
   
   # Safari Pinned Tab (copia del SVG)
   cp public/favicon.svg public/safari-pinned-tab.svg

3. Para Windows/Microsoft:
   svgexport public/favicon.svg public/mstile-150x150.png 150:150

4. Genera el favicon.ico (requiere ImageMagick):
   convert public/favicon-16x16.png public/favicon-32x32.png public/favicon.ico

===========================================
TAMAÑOS REQUERIDOS:
===========================================
✓ favicon.svg          - Navegadores modernos
✓ favicon.ico          - Navegadores legacy
✓ favicon-16x16.png    - Navegadores estándar
✓ favicon-32x32.png    - Navegadores alta resolución
✓ apple-touch-icon.png - iOS (180x180)
✓ android-chrome-*.png - Android (192x192, 512x512)
✓ safari-pinned-tab.svg - Safari macOS
✓ mstile-150x150.png   - Windows tiles

===========================================
`);

// Crear estructura de ejemplo para favicon con fondo para Apple
const appleTouchIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <!-- White background for Apple devices -->
  <rect width="180" height="180" fill="white"/>
  
  <!-- Musical note icon -->
  <g fill="#71717A" stroke="#71717A" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" transform="translate(30, 30)">
    <!-- Vertical line -->
    <path d="M45 20 L45 100" fill="none"/>
    <!-- Top beam -->
    <path d="M45 20 L105 5 L105 85" fill="none"/>
    <!-- Left note -->
    <circle cx="35" cy="100" r="15" fill="#71717A" stroke="none"/>
    <!-- Right note -->
    <circle cx="95" cy="85" r="15" fill="#71717A" stroke="none"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon-source.svg'), appleTouchIconSVG);
console.log('✓ Creado apple-touch-icon-source.svg con fondo blanco');