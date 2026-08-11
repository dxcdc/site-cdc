import fs from 'fs';
import { execFileSync } from 'child_process';
import path from 'path';

const SITE_URL = 'https://super.cdc.org.br';
const API_URL = `${SITE_URL}/api/noticias`;
const PAGE_SIZE = 12;

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const formatDate = (value) => new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Recife',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
}).format(new Date(value));

const response = await fetch(API_URL);
if (!response.ok) throw new Error(`Falha ao consultar notícias: HTTP ${response.status}`);
const payload = await response.json();
const news = payload.data ?? [];
if (!news.length) throw new Error('A API não retornou notícias.');

const detailChecks = await Promise.all(news.map(async (item) => {
  const detailResponse = await fetch(`${API_URL}/${item.id}`);
  return [item.id, detailResponse.status];
}));
const detailStatus = new Map(detailChecks);
const totalPages = Math.ceil(news.length / PAGE_SIZE);
const newsWithoutCover = news.filter((item) => !item.imagem_capa);
const missingCovers = newsWithoutCover.length;
const missingCoverLinks = newsWithoutCover.map((item) => {
  const url = `${SITE_URL}/noticias/${item.id}`;
  return `<li><b>${escapeHtml(item.titulo.trim())}</b> — <a href="${url}">${url}</a></li>`;
}).join('');
const generatedAt = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Recife', dateStyle: 'short', timeStyle: 'short',
}).format(new Date());

const rows = news.map((item, index) => {
  const page = Math.floor(index / PAGE_SIZE) + 1;
  const url = `${SITE_URL}/noticias/${item.id}`;
  const cover = item.imagem_capa ? 'Capa cadastrada' : 'Observação¹';
  const apiOk = detailStatus.get(item.id) === 200;
  return `
    <tr>
      <td class="center"><span class="checkbox"></span></td>
      <td class="center"><b>${index + 1}</b></td>
      <td class="center">${page}</td>
      <td class="center">${formatDate(item.data_publicacao)}</td>
      <td><b>${escapeHtml(item.titulo.trim())}</b><div class="route"><a href="${url}">${url}</a></div></td>
      <td>${cover}</td>
      <td class="center ${apiOk ? 'ok' : 'error'}">${apiOk ? 'OK' : `HTTP ${detailStatus.get(item.id)}`}</td>
    </tr>`;
}).join('');

const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Checklist completo de notícias — ONG CDC</title>
  <style>
    @page { size: A4 landscape; margin: 10mm 11mm 13mm; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #1f2937; font: 9px/1.3 Arial, sans-serif; }
    header { border-bottom: 3px solid #FE9A03; display: flex; justify-content: space-between; align-items: end; padding-bottom: 8px; margin-bottom: 10px; }
    h1 { font-size: 17px; margin: 0 0 2px; text-transform: uppercase; }
    header p { margin: 0; color: #4b5563; }
    .badge { background: #FE9A03; color: #111827; border-radius: 14px; font-weight: bold; padding: 5px 10px; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 8px; }
    .summary div { background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 3px; padding: 6px 8px; }
    .summary b { display: block; font-size: 13px; color: #111827; }
    .instructions { background: #fff8e6; border-left: 4px solid #FE9A03; padding: 7px 9px; margin-bottom: 10px; }
    .instructions b { color: #78350f; }
    .instructions ol { margin: 4px 0 0 18px; padding: 0; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    thead { display: table-header-group; }
    tr { break-inside: avoid; }
    th { background: #1f2937; color: white; border: 1px solid #374151; padding: 5px; text-align: left; }
    td { border: 1px solid #d1d5db; padding: 4px 5px; vertical-align: top; }
    tbody tr:nth-child(even) { background: #f9fafb; }
    .center { text-align: center; vertical-align: middle; }
    .checkbox { display: inline-block; width: 13px; height: 13px; border: 1.5px solid #4b5563; border-radius: 2px; }
    .route { font-size: 7.8px; margin-top: 2px; overflow-wrap: anywhere; }
    a { color: #1d4ed8; text-decoration: underline; }
    .ok { color: #047857; font-weight: bold; }
    .error { color: #b91c1c; font-weight: bold; }
    footer { margin-top: 10px; border-top: 1px solid #d1d5db; padding-top: 7px; color: #4b5563; }
  </style>
</head>
<body>
  <header>
    <div><h1>Checklist completo de notícias</h1><p>Centro de Desenvolvimento e Cidadania (CDC) — inspeção visual individual</p></div>
    <div class="badge">Gerado em ${generatedAt}</div>
  </header>
  <section class="summary">
    <div><b>${news.length}</b> notícias cadastradas</div>
    <div><b>${totalPages}</b> páginas na listagem</div>
    <div><b>${detailChecks.filter(([, status]) => status === 200).length}/${news.length}</b> detalhes acessíveis</div>
    <div><b>${missingCovers}</b> observações sobre capas</div>
  </section>
  <section class="instructions">
    <b>Como realizar a inspeção:</b>
    <ol>
      <li>Abra <a href="${SITE_URL}/noticias">${SITE_URL}/noticias</a> e confira as páginas 1 a ${totalPages}.</li>
      <li>Em cada linha abaixo, clique no link azul; marque o checkbox após conferir título, texto, data e imagens.</li>
      <li>A coluna “Imagem de capa” registra somente a situação observada durante o levantamento.</li>
    </ol>
  </section>
  <table>
    <thead><tr>
      <th style="width:4%">Check</th><th style="width:4%">Nº</th><th style="width:4%">Página</th>
      <th style="width:8%">Data</th><th style="width:56%">Notícia e link direto</th>
      <th style="width:16%">Imagem de capa</th><th style="width:8%">API</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p><b>Observação¹:</b> Durante o levantamento, notamos que ${missingCovers} notícias não possuem uma imagem de capa específica cadastrada. Nesses casos, o site apresenta uma imagem padrão, e o conteúdo da notícia permanece disponível normalmente.</p>
  <ul>${missingCoverLinks}</ul>
</body></html>`;

const htmlPath = path.join(process.cwd(), 'checklist_noticias_temp.html');
const pdfPath = path.join(process.cwd(), 'checklist_noticias_completo.pdf');
fs.writeFileSync(htmlPath, html);
execFileSync('/usr/bin/google-chrome', [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer',
  `--print-to-pdf=${pdfPath}`, htmlPath,
], { stdio: 'inherit' });
fs.unlinkSync(htmlPath);
console.log(`Checklist gerado: ${pdfPath}`);
