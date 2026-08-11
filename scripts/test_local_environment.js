import { execSync } from 'child_process';

console.log("=================================================================");
console.log("🧪 RELATÓRIO DE AUDITORIA E SUÍTE DE TESTES — LABORATÓRIO LOCAL");
console.log("=================================================================\n");

let passedTests = 0;
let totalTests = 0;

function assertTest(description, testFn) {
  totalTests++;
  try {
    const result = testFn();
    if (result === true || result === undefined) {
      console.log(`✅ [PASS] ${description}`);
      passedTests++;
    } else {
      console.log(`❌ [FAIL] ${description} — ${result}`);
    }
  } catch (error) {
    console.log(`❌ [FAIL] ${description} — Erro: ${error.message}`);
  }
}

async function assertTestAsync(description, asyncFn) {
  totalTests++;
  try {
    const result = await asyncFn();
    if (result === true || result === undefined) {
      console.log(`✅ [PASS] ${description}`);
      passedTests++;
    } else {
      console.log(`❌ [FAIL] ${description} — ${result}`);
    }
  } catch (error) {
    console.log(`❌ [FAIL] ${description} — Erro: ${error.message}`);
  }
}

async function runAudit() {
  console.log("1. 📊 AUDITORIA DE BANCO DE DADOS LOCAL (POSTGRESQL)");
  console.log("-------------------------------------------------");

  const tables = [
    { name: 'capa', expectedMin: 9 },
    { name: 'noticias', expectedMin: 50 },
    { name: 'programas', expectedMin: 10 },
    { name: 'parceiro', expectedMin: 15 },
    { name: 'transparencia', expectedMin: 40 },
    { name: 'lideranca', expectedMin: 15 },
    { name: 'linha_do_tempo', expectedMin: 10 },
    { name: 'organizacao', expectedMin: 1 },
    { name: 'perguntas_frequentes', expectedMin: 3 },
    { name: 'card_informativo', expectedMin: 2 },
    { name: 'rodape', expectedMin: 1 }
  ];

  for (const t of tables) {
    assertTest(`Tabela '${t.name}' populada com registros oficiais (mínimo ${t.expectedMin})`, () => {
      const output = execSync(
        `docker exec site_cdc_postgres psql -U cdc_user -d site_cdc_db -t -c "SELECT COUNT(*) FROM ${t.name};"`,
        { encoding: 'utf-8' }
      ).trim();
      const count = parseInt(output, 10);
      if (count >= t.expectedMin) return true;
      return `Esperado pelo menos ${t.expectedMin}, obtido: ${count}`;
    });
  }

  console.log("\n2. ⚙️ AUDITORIA DE ENDPOINTS DA API REST (BACKEND :5001)");
  console.log("-------------------------------------------------");

  const endpoints = [
    { url: 'http://localhost:5001/api/noticias', key: 'data' },
    { url: 'http://localhost:5001/api/programas', key: 'data' },
    { url: 'http://localhost:5001/api/parceiros', isArray: true },
    { url: 'http://localhost:5001/api/banner?pagina=institucional', isArray: true }
  ];

  for (const ep of endpoints) {
    await assertTestAsync(`Endpoint API '${ep.url}' responde HTTP 200 OK com payload estruturado`, async () => {
      const res = await fetch(ep.url);
      if (res.status !== 200) return `HTTP Status ${res.status}`;
      const data = await res.json();
      if (ep.key && (!data[ep.key] || data[ep.key].length === 0)) return `Payload '${ep.key}' vazio ou inválido`;
      if (ep.isArray && (!Array.isArray(data) || data.length === 0)) return `Array de resposta vazio`;
      return true;
    });
  }

  console.log("\n3. 🖼️ AUDITORIA DE CARREGAMENTO DE IMAGENS E MÍDIAS");
  console.log("-------------------------------------------------");

  const sampleImages = [
    'http://localhost:5001/uploads/banners/6-_MG_8182.jpg',
    'http://localhost:5001/uploads/parceiros/6-logo_(3)_(1).png',
    'http://localhost:5001/uploads/noticias/100-IMG_0711.jpg'
  ];

  for (const imgUrl of sampleImages) {
    await assertTestAsync(`Carregamento de mídia estática '${imgUrl}' (HTTP 200 OK)`, async () => {
      const res = await fetch(imgUrl, { method: 'HEAD' });
      if (res.status === 200) return true;
      return `HTTP Status ${res.status}`;
    });
  }

  console.log("\n4. 🌐 AUDITORIA DE RENDERIZAÇÃO E NAVEGAÇÃO DO FRONTEND (:3000)");
  console.log("-------------------------------------------------");

  const pages = [
    { url: 'http://localhost:3000/', textMatch: 'Centro de Desenvolvimento e Cidadania' },
    { url: 'http://localhost:3000/institucional', textMatch: 'Linha do tempo' },
    { url: 'http://localhost:3000/noticias', textMatch: 'Notícias' },
    { url: 'http://localhost:3000/programas', textMatch: 'Programas' }
  ];

  for (const p of pages) {
    await assertTestAsync(`Página Frontend '${p.url}' renderiza com sucesso`, async () => {
      const res = await fetch(p.url);
      if (res.status !== 200) return `HTTP Status ${res.status}`;
      const html = await res.text();
      if (html.includes(p.textMatch)) return true;
      return `Texto esperado '${p.textMatch}' não encontrado no HTML`;
    });
  }

  console.log("\n5. 🔐 AUDITORIA DE AUTENTICAÇÃO E PAINEL ADMIN (:3001)");
  console.log("-------------------------------------------------");

  await assertTestAsync("Painel AdminJS renderiza formulário de login seguro sem erros JS (/admin/login)", async () => {
    const res = await fetch('http://localhost:3001/admin/login');
    if (res.status !== 200) return `HTTP Status ${res.status}`;
    const html = await res.text();
    if (html.includes('Painel Admin CDC - Login') && html.includes('Entrar no Painel')) return true;
    return `Formulário de login não renderizado corretamente`;
  });

  console.log("\n=================================================================");
  console.log(`📊 RESULTADO FINAL DA AUDITORIA: ${passedTests} DE ${totalTests} TESTES PASSARAM (${Math.round((passedTests/totalTests)*100)}%)`);
  console.log("=================================================================\n");
}

runAudit();
