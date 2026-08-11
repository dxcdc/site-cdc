import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log("=================================================================");
console.log("🗄️ PERSPECTIVA 1: AUDITORIA DE INTEGRIDADE DE DADOS E MÍDIAS");
console.log("=================================================================\n");

const uploadsDir = path.join(process.cwd(), 'uploads');
let totalReferences = 0;
let validReferences = 0;
let missingFiles = [];

function checkFileExistsLocally(relativePath) {
  if (!relativePath) return true; // ignora vazios válidos
  totalReferences++;
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  const fullPath = path.join(uploadsDir, cleanPath);
  if (fs.existsSync(fullPath)) {
    validReferences++;
    return true;
  } else {
    missingFiles.push(cleanPath);
    return false;
  }
}

async function auditDataAndMedia() {
  console.log("1. 📰 Auditando imagens de capa das Notícias...");
  const noticiasImages = JSON.parse(execSync(
    `docker exec site_cdc_postgres psql -U cdc_user -d site_cdc_db -t -c "SELECT json_agg(imagem_capa) FROM noticias WHERE imagem_capa IS NOT NULL AND imagem_capa != '';"`,
    { encoding: 'utf-8' }
  ).trim() || '[]');
  noticiasImages.forEach(checkFileExistsLocally);

  console.log("2. 📌 Auditando imagens de capa dos Programas...");
  const programasImages = JSON.parse(execSync(
    `docker exec site_cdc_postgres psql -U cdc_user -d site_cdc_db -t -c "SELECT json_agg(url_image_capa) FROM programas WHERE url_image_capa IS NOT NULL AND url_image_capa != '';"`,
    { encoding: 'utf-8' }
  ).trim() || '[]');
  programasImages.forEach(checkFileExistsLocally);

  console.log("3. 🤝 Auditando logotipos dos Parceiros...");
  const parceirosImages = JSON.parse(execSync(
    `docker exec site_cdc_postgres psql -U cdc_user -d site_cdc_db -t -c "SELECT json_agg(url_imagem) FROM parceiro WHERE url_imagem IS NOT NULL AND url_imagem != '';"`,
    { encoding: 'utf-8' }
  ).trim() || '[]');
  parceirosImages.forEach(checkFileExistsLocally);

  console.log("4. 🖼️ Auditando Banners e Capas...");
  const capaImages = JSON.parse(execSync(
    `docker exec site_cdc_postgres psql -U cdc_user -d site_cdc_db -t -c "SELECT json_agg(url_img) FROM capa WHERE url_img IS NOT NULL AND url_img != '';"`,
    { encoding: 'utf-8' }
  ).trim() || '[]');
  capaImages.forEach(checkFileExistsLocally);

  console.log("5. 📜 Auditando imagens da Transparência...");
  const transparenciaImages = JSON.parse(execSync(
    `docker exec site_cdc_postgres psql -U cdc_user -d site_cdc_db -t -c "SELECT json_agg(url_imagem) FROM transparencia WHERE url_imagem IS NOT NULL AND url_imagem != '';"`,
    { encoding: 'utf-8' }
  ).trim() || '[]');
  transparenciaImages.forEach(checkFileExistsLocally);

  console.log("6. 👥 Auditando fotos das Lideranças...");
  const liderancaImages = JSON.parse(execSync(
    `docker exec site_cdc_postgres psql -U cdc_user -d site_cdc_db -t -c "SELECT json_agg(url_imagem) FROM lideranca WHERE url_imagem IS NOT NULL AND url_imagem != '';"`,
    { encoding: 'utf-8' }
  ).trim() || '[]');
  liderancaImages.forEach(checkFileExistsLocally);

  console.log("7. 📚 Auditando imagens das Publicações...");
  const publicacaoImages = JSON.parse(execSync(
    `docker exec site_cdc_postgres psql -U cdc_user -d site_cdc_db -t -c "SELECT json_agg(url_imagem) FROM publicacao WHERE url_imagem IS NOT NULL AND url_imagem != '';"`,
    { encoding: 'utf-8' }
  ).trim() || '[]');
  publicacaoImages.forEach(checkFileExistsLocally);

  console.log("8. 🏦 Auditando imagens dos Dados Bancários...");
  const dadosBancariosImages = JSON.parse(execSync(
    `docker exec site_cdc_postgres psql -U cdc_user -d site_cdc_db -t -c "SELECT json_agg(url_imagem) FROM dados_bancarios WHERE url_imagem IS NOT NULL AND url_imagem != '';"`,
    { encoding: 'utf-8' }
  ).trim() || '[]');
  dadosBancariosImages.forEach(checkFileExistsLocally);

  console.log("\n=================================================================");
  console.log(`📊 RESULTADO DA AUDITORIA DE MÍDIAS: ${validReferences} DE ${totalReferences} ARQUIVOS EXISTEM NO DISCO (${Math.round((validReferences/totalReferences)*100)}%)`);
  if (missingFiles.length > 0) {
    console.log(`\n⚠️ Arquivos ausentes em uploads/ (${missingFiles.length}):`);
    missingFiles.slice(0, 10).forEach(f => console.log(`   - ${f}`));
    if (missingFiles.length > 10) console.log(`   ... e mais ${missingFiles.length - 10} arquivos.`);
  }
  console.log("=================================================================\n");
}

auditDataAndMedia();
