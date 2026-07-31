/* scripts/migrate_image_paths.js */
/**
 * Copia imagens de ./uploads para ./frontend/public/assets preservando subpastas.
 *
 * USO:
 *   node scripts/migrate_image_paths.js
 *
 * QUANDO USAR:
 *   Esta estratégia (uploads → public/assets) só faz sentido se você optar
 *   por servir imagens dinâmicas pelo Next.js em vez do backend Express.
 *
 *   Se o backend Express estiver configurado para servir /uploads,
 *   este script é desnecessário para a operação normal.
 *   Ele é útil como fallback ou durante migrações.
 *
 * IMPORTANTE:
 *   - Execute no host, não dentro de um container Docker.
 *   - Os arquivos em ./uploads devem ser acessíveis no host.
 *   - O script é idempotente: pode ser executado múltiplas vezes sem dano.
 *   - Arquivos existentes são SOBRESCRITOS se o source for mais recente.
 *   - Não apaga arquivos em assets/ que não existem mais em uploads/.
 */

const fs = require('fs');
const path = require('path');

const uploadsDir = path.resolve(process.cwd(), 'uploads');
const assetsDir = path.resolve(process.cwd(), 'frontend', 'public', 'assets');

let copiedCount = 0;
let skippedCount = 0;
let errorCount = 0;

if (!fs.existsSync(uploadsDir)) {
  console.error('🚫 uploads directory not found:', uploadsDir);
  process.exit(1);
}

/**
 * Copia recursivamente todos os arquivos de srcDir para destDir,
 * preservando a estrutura de subpastas.
 */
function copyRecursive(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`📁 Created directory: ${destDir}`);
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      try {
        const srcStat = fs.statSync(srcPath);
        const destExists = fs.existsSync(destPath);

        if (destExists) {
          const destStat = fs.statSync(destPath);
          // Pula se o destino já é tão recente quanto a origem
          if (destStat.mtimeMs >= srcStat.mtimeMs) {
            skippedCount++;
            continue;
          }
        }

        fs.copyFileSync(srcPath, destPath);
        copiedCount++;
        console.log(`✅ Copied: ${path.relative(uploadsDir, srcPath)}`);
      } catch (err) {
        errorCount++;
        console.error(`❌ Error copying ${entry.name}:`, err.message);
      }
    }
  }
}

console.log('🚀 Starting migration: uploads → frontend/public/assets\n');
console.log(`Source:      ${uploadsDir}`);
console.log(`Destination: ${assetsDir}\n`);

copyRecursive(uploadsDir, assetsDir);

console.log('\n📊 Summary:');
console.log(`  ✅ Copied:  ${copiedCount} files`);
console.log(`  ⏭️  Skipped: ${skippedCount} files (already up-to-date)`);
console.log(`  ❌ Errors:  ${errorCount} files`);
console.log('\n🎉 Migration completed.');

if (errorCount > 0) {
  console.warn('\n⚠️  Some files failed to copy. Check errors above.');
  process.exit(1);
}
