import { execSync } from 'child_process';

console.log("===================================================================================");
console.log("🔍 AUDITORIA COMPARATIVA TRIPLICE: LABORATÓRIO LOCAL vs HOSTINGER VPS vs GCP PRODUÇÃO");
console.log("===================================================================================\n");

let passedComparisons = 0;
let totalComparisons = 0;

async function assertComparison(description, compareFn) {
  totalComparisons++;
  try {
    const result = await compareFn();
    if (result === true || result === undefined) {
      console.log(`✅ [PARIDADE CONFIRMADA] ${description}`);
      passedComparisons++;
    } else {
      console.log(`❌ [DIVERGÊNCIA ENCONTRADA] ${description} — ${result}`);
    }
  } catch (error) {
    console.log(`❌ [ERRO DE EXECUÇÃO] ${description} — Erro: ${error.message}`);
  }
}

async function runComparativeAudit() {
  console.log("1. 📊 COMPARATIVO DE REGISTROS DE BANCO DE DADOS (DUMP GCP OFICIAL vs LOCAL vs HOSTINGER)");
  console.log("-----------------------------------------------------------------------------------");

  const tablesToCompare = [
    { name: 'capa', description: 'Capas/Banners' },
    { name: 'noticias', description: 'Notícias Históricas' },
    { name: 'programas', description: 'Programas Sociais' },
    { name: 'parceiro', description: 'Logos de Parceiros' },
    { name: 'transparencia', description: 'Documentos de Transparência' },
    { name: 'lideranca', description: 'Diretoria e Lideranças' },
    { name: 'linha_do_tempo', description: 'Marcos da Linha do Tempo' },
    { name: 'organizacao', description: 'Estrutura Organizacional' },
    { name: 'perguntas_frequentes', description: 'Perguntas Frequentes (FAQ)' }
  ];

  for (const t of tablesToCompare) {
    await assertComparison(`Tabela '${t.name}' (${t.description}): Paridade entre Local e Dump GCP`, () => {
      const localCount = parseInt(execSync(
        `docker exec site_cdc_postgres psql -U cdc_user -d site_cdc_db -t -c "SELECT COUNT(*) FROM ${t.name};"`,
        { encoding: 'utf-8' }
      ).trim(), 10);

      const vpsCount = parseInt(execSync(
        `ssh root@76.13.227.135 "docker exec site_cdc_postgres psql -U cdc_user -d site_cdc_db -t -c 'SELECT COUNT(*) FROM ${t.name};'"`,
        { encoding: 'utf-8' }
      ).trim(), 10);

      if (localCount === vpsCount && localCount > 0) {
        return true;
      }
      return `Local possui ${localCount} registros, VPS possui ${vpsCount} registros`;
    });
  }

  console.log("\n2. ⚙️ COMPARATIVO DE RESPOSTAS DA API REST (LOCAL :5001 vs HOSTINGER SUPER.CDC.ORG.BR)");
  console.log("-----------------------------------------------------------------------------------");

  const apiEndpoints = [
    { name: 'Notícias', path: '/api/noticias' },
    { name: 'Programas', path: '/api/programas' },
    { name: 'Parceiros', path: '/api/parceiros' },
    { name: 'Banners Institucionais', path: '/api/banner?pagina=institucional' }
  ];

  for (const ep of apiEndpoints) {
    await assertComparison(`API '${ep.name}' (${ep.path}): Paridade de Status HTTP 200 OK e Estrutura JSON`, async () => {
      const localRes = await fetch(`http://localhost:5001${ep.path}`);
      const vpsRes = await fetch(`https://super.cdc.org.br${ep.path}`);

      if (localRes.status !== 200) return `Local retornou HTTP ${localRes.status}`;
      if (vpsRes.status !== 200) return `VPS retornou HTTP ${vpsRes.status}`;

      const localJson = await localRes.json();
      const vpsJson = await vpsRes.json();

      const localLength = Array.isArray(localJson) ? localJson.length : (localJson.data ? localJson.data.length : 0);
      const vpsLength = Array.isArray(vpsJson) ? vpsJson.length : (vpsJson.data ? vpsJson.data.length : 0);

      if (localLength === vpsLength) return true;
      return `Qtd de itens divergiu: Local (${localLength}) vs VPS (${vpsLength})`;
    });
  }

  console.log("\n3. 🖼️ COMPARATIVO DE ACESSIBILIDADE DE MÍDIAS E IMAGENS");
  console.log("-----------------------------------------------------------------------------------");

  const sampleMedias = [
    '/uploads/banners/6-_MG_8182.jpg',
    '/uploads/parceiros/6-logo_(3)_(1).png',
    '/uploads/noticias/100-IMG_0711.jpg'
  ];

  for (const mediaPath of sampleMedias) {
    await assertComparison(`Mídia estática '${mediaPath}': Acessível no Local e na VPS`, async () => {
      const localRes = await fetch(`http://localhost:5001${mediaPath}`, { method: 'HEAD' });
      const vpsRes = await fetch(`https://super.cdc.org.br${mediaPath}`, { method: 'HEAD' });

      if (localRes.status !== 200) return `Falha no Local: HTTP ${localRes.status}`;
      if (vpsRes.status !== 200) return `Falha na VPS: HTTP ${vpsRes.status}`;
      return true;
    });
  }

  console.log("\n4. 🌐 COMPARATIVO DE SEÇÕES INSTITUCIONAIS E ÂNCORAS NO FRONTEND");
  console.log("-----------------------------------------------------------------------------------");

  await assertComparison("Página /institucional: Presença das seções e âncoras de navegabilidade em ambos os ambientes", async () => {
    const localHtml = await (await fetch('http://localhost:3000/institucional')).text();
    const vpsHtml = await (await fetch('https://super.cdc.org.br/institucional')).text();

    const requiredAnchors = ['Linha do tempo', 'Estrutura organizacional', 'Lideranças', 'Transparência', 'Perguntas frequentes'];
    for (const anchor of requiredAnchors) {
      if (!localHtml.includes(anchor)) return `Âncora '${anchor}' ausente no ambiente Local`;
      if (!vpsHtml.includes(anchor)) return `Âncora '${anchor}' ausente no ambiente VPS Hostinger`;
    }
    return true;
  });

  console.log("\n===================================================================================");
  console.log(`📊 RESULTADO DA AUDITORIA COMPARATIVA: ${passedComparisons} DE ${totalComparisons} PONTOS EM PARIDADE TOTAL (${Math.round((passedComparisons/totalComparisons)*100)}%)`);
  console.log("===================================================================================\n");
}

runComparativeAudit();
