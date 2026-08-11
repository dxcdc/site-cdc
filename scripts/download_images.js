import fs from 'fs';
import path from 'path';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  user: process.env.DB_USER || 'cdc_user',
  password: process.env.DB_PASSWORD || 'cdc_password',
  database: process.env.DB_NAME || 'site_cdc_db',
});

const BUCKET_BASE_URL = 'https://storage.googleapis.com/cdc-site/';
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

async function downloadFile(relativeUrl) {
  if (!relativeUrl) return;

  const targetPath = path.join(UPLOADS_DIR, relativeUrl);
  const targetDir = path.dirname(targetPath);

  if (fs.existsSync(targetPath)) {
    return true;
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const fullUrl = relativeUrl.startsWith('http') ? relativeUrl : `${BUCKET_BASE_URL}${relativeUrl}`;

  try {
    const response = await fetch(fullUrl);
    if (!response.ok) {
      console.warn(`⚠️ HTTP ${response.status} ao baixar: ${fullUrl}`);
      return false;
    }
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(targetPath, Buffer.from(buffer));
    console.log(`✅ Salvo: ${relativeUrl}`);
    return true;
  } catch (err) {
    console.error(`❌ Erro ao baixar ${fullUrl}:`, err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando download das mídias do bucket GCP para a pasta ./uploads...');

  const queries = [
    { table: 'capa', column: 'url_img' },
    { table: 'noticias', column: 'imagem_capa' },
    { table: 'parceiro', column: 'url_imagem' },
    { table: 'programas', column: 'url_image_capa' },
    { table: 'programa_imagens', column: 'url_imagem' },
    { table: 'linha_do_tempo_imagens', column: 'url_imagem' },
    { table: 'organizacao_imagens', column: 'imagem_url' },
    { table: 'transparencia', column: 'url_imagem' },
    { table: 'lideranca', column: 'url_imagem' },
    { table: 'publicacao', column: 'url_imagem' },
    { table: 'publicacao_imagens', column: 'url_imagem' },
    { table: 'dados_bancarios', column: 'url_imagem' }
  ];

  let successCount = 0;
  let failCount = 0;

  for (const item of queries) {
    console.log(`\n🔍 Buscando imagens da tabela '${item.table}'...`);
    const res = await pool.query(`SELECT ${item.column} FROM ${item.table} WHERE ${item.column} IS NOT NULL AND ${item.column} != '';`);
    
    for (const row of res.rows) {
      const imgPath = row[item.column];
      const result = await downloadFile(imgPath);
      if (result) successCount++; else failCount++;
    }
  }

  console.log(`\n🎉 Download concluído!`);
  console.log(`✅ Sucesso: ${successCount} arquivos`);
  console.log(`⚠️ Falhas: ${failCount} arquivos`);
  await pool.end();
}

main().catch(err => {
  console.error('❌ Erro no script de download:', err);
  process.exit(1);
});
