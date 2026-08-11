console.log("=================================================================");
console.log("📱 PERSPECTIVA 2: AUDITORIA DE UX, PÁGINAS E NAVEGAÇÃO DO FRONTEND");
console.log("=================================================================\n");

const pagesToAudit = [
  { path: '/', title: 'Página Inicial (Home)' },
  { path: '/institucional', title: 'Página Institucional' },
  { path: '/noticias', title: 'Listagem de Notícias' },
  { path: '/noticias/175', title: 'Detalhe de Notícia (ID 175)' },
  { path: '/programas', title: 'Listagem de Programas' },
  { path: '/programas/58', title: 'Detalhe de Programa (ID 58)' },
  { path: '/publicacoes', title: 'Página de Publicações' },
  { path: '/contato', title: 'Página de Contato' },
  { path: '/doacoes', title: 'Página de Doações' },
  { path: '/trabalhe-conosco', title: 'Página Trabalhe Conosco' }
];

async function auditPages() {
  let passed = 0;
  for (const page of pagesToAudit) {
    try {
      const localUrl = `http://localhost:3000${page.path}`;
      const vpsUrl = `https://super.cdc.org.br${page.path}`;

      const [localRes, vpsRes] = await Promise.all([
        fetch(localUrl),
        fetch(vpsUrl)
      ]);

      if (localRes.status === 200 && vpsRes.status === 200) {
        console.log(`✅ [200 OK] ${page.title} (${page.path}) — Local e VPS em perfeito funcionamento.`);
        passed++;
      } else {
        console.log(`❌ [FALHA] ${page.title} (${page.path}) — Local HTTP ${localRes.status} | VPS HTTP ${vpsRes.status}`);
      }
    } catch (err) {
      console.log(`❌ [ERRO] ${page.title} (${page.path}) — ${err.message}`);
    }
  }

  console.log("\n=================================================================");
  console.log(`📊 RESULTADO DA AUDITORIA DE PÁGINAS: ${passed} DE ${pagesToAudit.length} PÁGINAS FUNCIONANDO (${Math.round((passed/pagesToAudit.length)*100)}%)`);
  console.log("=================================================================\n");
}

auditPages();
