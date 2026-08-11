import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

let htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Checklist Oficial de Inspeção Visual Manual e Auditoria — 2ª Verificação — ONG CDC</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 15mm 15mm 15mm;
    }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #222;
      font-size: 10.5px;
      line-height: 1.4;
      background-color: #fff;
    }
    .header-box {
      border-bottom: 3px solid #FE9A03;
      padding-bottom: 10px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #111827;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .subtitle {
      font-size: 10.5px;
      color: #4b5563;
      margin-top: 3px;
    }
    .badge {
      background-color: #FE9A03;
      color: #222;
      font-weight: bold;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 10px;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
    }
    .meta-table td {
      padding: 5px 8px;
      border: 1px solid #e5e7eb;
      font-size: 10px;
    }
    .meta-label {
      font-weight: bold;
      color: #374151;
      background-color: #f3f4f6;
      width: 25%;
    }
    .meta-value {
      color: #111827;
      font-weight: 500;
      width: 25%;
    }
    .intro-paragraph {
      background-color: #fffbe6;
      border-left: 4px solid #FE9A03;
      padding: 8px 12px;
      font-size: 10px;
      color: #78350f;
      margin-bottom: 14px;
      border-radius: 2px;
      line-height: 1.4;
    }
    .section-title {
      background-color: #1f2937;
      color: #ffffff;
      font-size: 11px;
      font-weight: bold;
      padding: 5px 8px;
      margin-top: 12px;
      margin-bottom: 6px;
      border-radius: 3px;
      display: flex;
      justify-content: space-between;
    }
    .section-desc {
      font-size: 9.5px;
      color: #6b7280;
      font-style: italic;
      margin-bottom: 5px;
    }
    .item-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
    }
    .item-table th {
      background-color: #f3f4f6;
      border: 1px solid #d1d5db;
      padding: 4px 6px;
      font-size: 9.5px;
      text-align: left;
    }
    .item-table td {
      border: 1px solid #e5e7eb;
      padding: 4px 6px;
      font-size: 9.5px;
      vertical-align: top;
    }
    .checkbox {
      width: 13px;
      height: 13px;
      border: 1.5px solid #4b5563;
      border-radius: 2px;
      display: inline-block;
      text-align: center;
      line-height: 11px;
      font-weight: bold;
      font-size: 9px;
    }
    .center {
      text-align: center;
      vertical-align: middle !important;
    }
    .checked {
      background-color: #10b981;
      border-color: #059669;
      color: #fff;
    }
    .status-resolved {
      color: #059669;
      font-weight: bold;
    }
    .inspection-route {
      margin-top: 3px;
      color: #374151;
      font-size: 8.5px;
      line-height: 1.25;
      overflow-wrap: anywhere;
    }
    .inspection-route a {
      color: #1d4ed8;
      text-decoration: underline;
    }
    .page-break {
      page-break-before: always;
    }
    .notes-box {
      border: 1px solid #d1d5db;
      background-color: #fafafa;
      height: 50px;
      border-radius: 4px;
      margin-top: 4px;
    }
    .change-records {
      margin-top: 14px;
      page-break-inside: avoid;
    }
    .change-record {
      margin-top: 9px;
      padding: 8px 10px;
      border: 1px solid #d1d5db;
      border-left: 4px solid #FE9A03;
      border-radius: 4px;
      background-color: #fafafa;
    }
    .change-record p {
      margin: 0 0 6px;
      color: #4b5563;
      font-size: 9.5px;
    }
    .change-lines {
      height: 38px;
      background: repeating-linear-gradient(
        to bottom,
        transparent 0,
        transparent 17px,
        #d1d5db 18px
      );
    }
    .signature-grid {
      display: flex;
      justify-content: space-between;
      margin-top: 25px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
    }
    .signature-line {
      width: 45%;
      text-align: center;
      border-top: 1px solid #374151;
      padding-top: 4px;
      font-size: 10px;
      font-weight: bold;
    }
    code {
      font-family: monospace;
      background-color: #e5e7eb;
      padding: 1px 3px;
      border-radius: 2px;
    }
  </style>
</head>
<body>

  <!-- CABEÇALHO -->
  <div class="header-box">
    <div>
      <div class="title">RELATÓRIO DE INSPEÇÃO VISUAL & AUDITORIA</div>
      <div class="subtitle">Centro de Desenvolvimento e Cidadania (CDC) — Portal Web & Painel Administrativo</div>
    </div>
    <div class="badge">2ª VERIFICAÇÃO | 11/08/2026</div>
  </div>

  <!-- 1. IDENTIFICAÇÃO DA INSPEÇÃO (PREENCHIDO INTEGRALMENTE) -->
  <div class="section-title">
    <span>1. IDENTIFICAÇÃO DA INSPEÇÃO</span>
    <span>2ª VERIFICAÇÃO DE HOMOLOGAÇÃO</span>
  </div>

  <table class="meta-table">
    <tr>
      <td class="meta-label">Ambiente avaliado:</td>
      <td class="meta-value">Servidor VPS Hostinger / Laboratório Local Docker</td>
      <td class="meta-label">Data da inspeção:</td>
      <td class="meta-value"><b>11 / 08 / 2026</b></td>
    </tr>
    <tr>
      <td class="meta-label">Endereço do site:</td>
      <td class="meta-value"><b>https://super.cdc.org.br</b><br>(Local: http://localhost:3000)</td>
      <td class="meta-label">Navegador utilizado:</td>
      <td class="meta-value">Google Chrome / Mozilla Firefox (Multi-browser)</td>
    </tr>
    <tr>
      <td class="meta-label">Versão / Publicação:</td>
      <td class="meta-value"><b>Versão v2.0 (2ª Verificação - 5 Erros Sanados)</b></td>
      <td class="meta-label">Dispositivo utilizado:</td>
      <td class="meta-value">Computador Desktop & Smartphones Mobile</td>
    </tr>
    <tr>
      <td class="meta-label">Responsáveis pelo teste:</td>
      <td class="meta-value"><b>Kleber Fanini e Fernando Vier</b></td>
      <td class="meta-label">Resolução da tela:</td>
      <td class="meta-value">Multi-resolução (375px, 430px, 768px, 1280px, 1920px)</td>
    </tr>
  </table>

  <!-- PARÁGRAFO INTRODUTÓRIO EXPLICATIVO -->
  <div class="intro-paragraph">
    <b>ℹ️ RESUMO DO CICLO DE VERIFICAÇÃO:</b> Esta documentação registra formalmente a <b>2ª Rodada de Verificação e Inspeção de Qualidade</b> conduzida por <b>Kleber Fanini e Fernando Vier</b>. Nesta etapa, os <b>5 erros críticos mapeados no relatório anterior</b> (dados ausentes, desorientação de ancoragem no menu Institucional, vacância das tabelas do Painel Admin, exceções de JS no console e ausência de roteiro formal de testes) foram minuciosamente auditados, corrigidos e revalidados em ambiente controlado. A presente inspeção registra os resultados observados nesta etapa de homologação e contribui para acompanhar a consistência entre o ambiente VPS Hostinger e a base histórica oficial do GCP, com atenção à estabilidade, segurança e responsividade.
  </div>

  <!-- SEÇÃO 0: RESOLUÇÃO DOS 5 ERROS MAPEADOS -->
  <div class="section-title">
    <span>SEÇÃO 0: HISTÓRICO DOS 5 ERROS ENCONTRADOS E SANADOS DA 1ª VERIFICAÇÃO</span>
    <span>5 ERROS SANADOS</span>
  </div>
  <div class="section-desc">Detalhamento técnico da resolução dos 5 pontos críticos reportados pelo testador na 1ª rodada.</div>

  <table class="item-table">
    <thead>
      <tr>
        <th style="width: 5%;">Check</th>
        <th style="width: 7%;">ID</th>
        <th style="width: 25%;">Apontamento do E-mail (1ª Verificação)</th>
        <th style="width: 48%;">Solução Técnica Aplicada na 2ª Verificação</th>
        <th style="width: 15%;">Status Atual</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: center;"><div class="checkbox checked">✓</div></td>
        <td><b>0.1</b></td>
        <td><b>Erro 1: Escopo do Teste</b><br><i>"O que é necessário testar exatamente?"</i></td>
        <td>Fornecido Roteiro Oficial e Protocolo em 11 Seções abrangendo Frontend Público e Painel AdminJS.</td>
        <td class="status-resolved">✅ CORRIGIDO</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox checked">✓</div></td>
        <td><b>0.2</b></td>
        <td><b>Erro 2: Conteúdo Divergente</b><br><i>"Porque o site está com conteúdo diferente..."</i></td>
        <td>Importado o banco oficial do GCP (52 notícias, 12 programas, 49 transparências, 20 diretores, 11 marcos).</td>
        <td class="status-resolved">✅ CORRIGIDO</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox checked">✓</div></td>
        <td><b>0.3</b></td>
        <td><b>Erro 3: Menu Linha do Tempo</b><br><i>"Se clico em Linha do Tempo não leva a lugar..."</i></td>
        <td>Ativado o script <code>SearchScrollHandler.tsx</code> com rolagem suave automática para <code>#timeline</code>.</td>
        <td class="status-resolved">✅ CORRIGIDO</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox checked">✓</div></td>
        <td><b>0.4</b></td>
        <td><b>Erro 4: Páginas Vazias Admin</b><br><i>"Painel admin maioria das páginas vazias..."</i></td>
        <td>Sincronizadas todas as 28 tabelas e recursos no AdminJS com a base histórica da ONG CDC.</td>
        <td class="status-resolved">✅ CORRIGIDO</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox checked">✓</div></td>
        <td><b>0.5</b></td>
        <td><b>Erro 5: Exceção JS no Admin</b><br><i>"Aparece erro de Javascript (print)..."</i></td>
        <td>Implementado tratamento nulo defensivo em campos JSON e ricas formatações HTML no AdminJS.</td>
        <td class="status-resolved">✅ CORRIGIDO</td>
      </tr>
    </tbody>
  </table>

  <!-- SEÇÃO 1: TOPO, CABEÇALHO E NAVEGAÇÃO PRINCIPAL -->
  <div class="section-title">
    <span>SEÇÃO 1: TOPO, CABEÇALHO E NAVEGAÇÃO PRINCIPAL (HEADER)</span>
    <span>9 ITENS</span>
  </div>

  <table class="item-table">
    <thead>
      <tr>
        <th style="width: 5%;">Check</th>
        <th style="width: 7%;">ID</th>
        <th style="width: 35%;">Item de Inspeção Visual</th>
        <th style="width: 53%;">O que observar no Navegador</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>1.1</b></td>
        <td><b>Logo CDC</b></td>
        <td>Imagem da logo nítida, alinhada e clicável direcionando para a Home (<code>/</code>).</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>1.2</b></td>
        <td><b>Botão "Doe agora" (Desktop)</b></td>
        <td>Estilizado com fundo laranja (<code>#FE9A03</code>), ícone de seta e link para <code>/doacoes</code>.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>1.3</b></td>
        <td><b>Botão "Doe agora" (Mobile)</b></td>
        <td>Visível no cabeçalho mobile com texto legível.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>1.4</b></td>
        <td><b>Busca (ButtonSearch)</b></td>
        <td>Ícone de busca funcional para abrir o modal de pesquisa.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>1.5</b></td>
        <td><b>Menu Desktop</b></td>
        <td>Institucional, Programas, Notícias, Publicações, Contato alinhados com sub-menus no hover.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>1.6</b></td>
        <td><b>Menu Hambúrguer Mobile</b></td>
        <td>Visível em telas pequenas; ao clicar, abre a gaveta de navegação.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>1.7</b></td>
        <td><b>Fechamento Auto (Links Principais)</b></td>
        <td>Ao clicar em um item no mobile, o menu fecha sozinho e exibe a página.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>1.8</b></td>
        <td><b>Fechamento Auto (Sub-itens)</b></td>
        <td>Ao clicar em um sub-item no mobile, o menu fecha e rola até a seção.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>1.9</b></td>
        <td><b>Header Fixo (Sticky Top)</b></td>
        <td>Cabeçalho permanece no topo durante a rolagem vertical.</td>
      </tr>
    </tbody>
  </table>

  <!-- SEÇÃO 2: BANNER PRINCIPAL DA PÁGINA INSTITUCIONAL -->
  <div class="section-title">
    <span>SEÇÃO 2: BANNER PRINCIPAL DA PÁGINA INSTITUCIONAL (/institucional)</span>
    <span>4 ITENS</span>
  </div>

  <table class="item-table">
    <thead>
      <tr>
        <th style="width: 5%;">Check</th>
        <th style="width: 7%;">ID</th>
        <th style="width: 35%;">Item de Inspeção Visual</th>
        <th style="width: 53%;">O que observar no Navegador</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>2.1</b></td>
        <td><b>Título do Banner Institucional</b></td>
        <td>Na página <code>/institucional</code>, conferir o texto <i>"Defendendo a dignidade humana e construindo caminhos para o bem viver"</i> sem tags HTML expostas.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>2.2</b></td>
        <td><b>Imagem de Fundo do Banner</b></td>
        <td>Imagem carregada em alta definição sem cortes ou distorções.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>2.3</b></td>
        <td><b>Legibilidade do Texto</b></td>
        <td>Contraste adequado entre a fonte e a foto de fundo.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>2.4</b></td>
        <td><b>Responsividade do Banner Único</b></td>
        <td>Confirmar que imagem e título permanecem bem enquadrados no desktop e no celular. Esta página utiliza um banner único e não possui setas ou indicadores de carrossel.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- SEÇÃO 3: SEÇÕES DA PÁGINA INICIAL -->
  <div class="section-title">
    <span>SEÇÃO 3: SEÇÕES DA PÁGINA INICIAL (HOME PAGE)</span>
    <span>6 ITENS</span>
  </div>

  <table class="item-table">
    <thead>
      <tr>
        <th style="width: 5%;">Check</th>
        <th style="width: 7%;">ID</th>
        <th style="width: 35%;">Item de Inspeção Visual</th>
        <th style="width: 53%;">O que observar no Navegador</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>3.1</b></td>
        <td><b>Bloco "Nossa Missão"</b></td>
        <td>Texto institucional da missão com ilustração <code>MissionImage</code>.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>3.2</b></td>
        <td><b>Bloco "Nossa Visão"</b></td>
        <td>Texto institucional da visão com ilustração <code>VisionImage</code>.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>3.3</b></td>
        <td><b>Carrossel Infinito de Parceiros</b></td>
        <td>Animação contínua dos logotipos dos parceiros deslizando suavemente.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>3.4</b></td>
        <td><b>Bloco de Últimas Notícias</b></td>
        <td>Três cards das últimas notícias com imagem, título e data, apresentados sem carrossel.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>3.5</b></td>
        <td><b>Bloco de Indicadores Sociais</b></td>
        <td>Números e conquistas da ONG em destaques numéricos.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>3.6</b></td>
        <td><b>Botão "Ver mais" das Notícias</b></td>
        <td>Na seção "Últimas notícias" da Home, clicar em <b>"Ver mais"</b> e confirmar o redirecionamento para <code>/noticias</code>.</td>
      </tr>
    </tbody>
  </table>

  <!-- SEÇÃO 4: PÁGINA INSTITUCIONAL - NAVEGAÇÃO -->
  <div class="section-title">
    <span>SEÇÃO 4: PÁGINA INSTITUCIONAL — SUB-MENU E ÂNCORAS (/institucional)</span>
    <span>6 ITENS</span>
  </div>

  <table class="item-table">
    <thead>
      <tr>
        <th style="width: 5%;">Check</th>
        <th style="width: 7%;">ID</th>
        <th style="width: 35%;">Item de Inspeção Visual</th>
        <th style="width: 53%;">O que observar no Navegador</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>4.1</b></td>
        <td><b>Barra de Sub-menu Fixo</b></td>
        <td>Barra cinza com os 5 tópicos visível abaixo do header.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>4.2</b></td>
        <td><b>Âncora "Linha do tempo"</b></td>
        <td>Clique rola suavemente até a seção <code>#timeline</code>.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>4.3</b></td>
        <td><b>Âncora "Estrutura organizacional"</b></td>
        <td>Clique rola suavemente até a seção <code>#organizacao</code>.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>4.4</b></td>
        <td><b>Âncora "Lideranças"</b></td>
        <td>Clique rola suavemente até a seção <code>#liderancas</code>.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>4.5</b></td>
        <td><b>Âncora "Transparência"</b></td>
        <td>Clique rola suavemente até a seção <code>#transparencia</code>.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>4.6</b></td>
        <td><b>Âncora "Perguntas frequentes"</b></td>
        <td>Clique rola suavemente até a seção <code>#faq</code>.</td>
      </tr>
    </tbody>
  </table>

  <!-- SEÇÃO 5: PÁGINA INSTITUCIONAL - CONTEÚDO -->
  <div class="section-title">
    <span>SEÇÃO 5: PÁGINA INSTITUCIONAL — CONTEÚDO INTERNO</span>
    <span>7 ITENS</span>
  </div>

  <table class="item-table">
    <thead>
      <tr>
        <th style="width: 5%;">Check</th>
        <th style="width: 7%;">ID</th>
        <th style="width: 35%;">Item de Inspeção Visual</th>
        <th style="width: 53%;">O que observar no Navegador</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>5.1</b></td>
        <td><b>Linha do Tempo (Datas)</b></td>
        <td>Exibição dos marcos de 2010 a 2025 em linha do tempo.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>5.2</b></td>
        <td><b>Fotos da Linha do Tempo</b></td>
        <td>Imagens históricas arredondadas e carregadas.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>5.3</b></td>
        <td><b>Estrutura Organizacional</b></td>
        <td>Cards da Assembleia, Conselho de Adm., Diretoria e Conselho Fiscal.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>5.4</b></td>
        <td><b>Lideranças / Diretoria</b></td>
        <td>Cards de Maria Silva, João Santos, Ana Oliveira com nome, cargo e e-mail.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>5.5</b></td>
        <td><b>Transparência (Lista)</b></td>
        <td>Listagem dos 49 balanços e prestações de contas históricas.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>5.6</b></td>
        <td><b>Links de PDF Transparência</b></td>
        <td>Clique nos relatórios abrindo o documento em nova aba.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>5.7</b></td>
        <td><b>FAQ Accordions</b></td>
        <td>Expandir e recolher as perguntas frequentes.</td>
      </tr>
    </tbody>
  </table>

  <!-- SEÇÃO 6: PÁGINA DE NOTÍCIAS -->
  <div class="section-title">
    <span>SEÇÃO 6: PÁGINA DE NOTÍCIAS (/noticias e /noticias/[id])</span>
    <span>6 ITENS</span>
  </div>

  <table class="item-table">
    <thead>
      <tr>
        <th style="width: 5%;">Check</th>
        <th style="width: 7%;">ID</th>
        <th style="width: 35%;">Item de Inspeção Visual</th>
        <th style="width: 53%;">O que observar no Navegador</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>6.1</b></td>
        <td><b>Cards de Notícias</b></td>
        <td>Imagem de capa, título, autor, data e tempo de leitura.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>6.2</b></td>
        <td><b>Filtros por Área</b></td>
        <td>Clicar nas tags (<i>Institucional</i>, <i>Direitos da Pessoa Idosa</i>, <i>ATITUDE</i>) e refiltrar.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>6.3</b></td>
        <td><b>Paginação de Notícias</b></td>
        <td>Navegação entre páginas de notícias mais antigas.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>6.4</b></td>
        <td><b>Notícia Detalhada (/noticias/175)</b></td>
        <td>Título H1 <i>"Audiência Pública..."</i>, data, tempo de leitura e parágrafos do conteúdo. A exibição de autor não faz parte desta verificação.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>6.5</b></td>
        <td><b>Imagens Internas (/noticias/84)</b></td>
        <td>Na matéria <i>"CDC realiza atividades no Mês da Pessoa Idosa"</i>, conferir o carregamento das seis imagens internas, sem quebras.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>6.6</b></td>
        <td><b>Botão Voltar</b></td>
        <td>Retorno suave para a listagem principal.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- SEÇÃO 7: PÁGINA DE PROGRAMAS -->
  <div class="section-title">
    <span>SEÇÃO 7: PÁGINA DE PROGRAMAS (/programas e /programas/[id])</span>
    <span>3 ITENS</span>
  </div>

  <table class="item-table">
    <thead>
      <tr>
        <th style="width: 5%;">Check</th>
        <th style="width: 7%;">ID</th>
        <th style="width: 35%;">Item de Inspeção Visual</th>
        <th style="width: 53%;">O que observar no Navegador</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>7.1</b></td>
        <td><b>Listagem dos 12 Programas</b></td>
        <td>Cards dos programas com foto de capa e título.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>7.2</b></td>
        <td><b>Programa ATITUDE (ID 58)</b></td>
        <td>Exibição do título completo do programa ATITUDE.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>7.3</b></td>
        <td><b>Detalhe do Programa (/programas/58)</b></td>
        <td>Descrição completa, objetivos e galeria de fotos do projeto.</td>
      </tr>
    </tbody>
  </table>

  <!-- SEÇÃO 8: PÁGINAS COMPLEMENTARES -->
  <div class="section-title">
    <span>SEÇÃO 8: PÁGINAS COMPLEMENTARES (PUBLICAÇÕES, CONTATO, DOAÇÕES, TRABALHE CONOSCO)</span>
    <span>4 ITENS</span>
  </div>

  <table class="item-table">
    <thead>
      <tr>
        <th style="width: 5%;">Check</th>
        <th style="width: 7%;">ID</th>
        <th style="width: 35%;">Item de Inspeção Visual</th>
        <th style="width: 53%;">O que observar no Navegador</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>8.1</b></td>
        <td><b>Página de Publicações (/publicacoes)</b></td>
        <td>Livros e materiais institucionais para leitura/download.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>8.2</b></td>
        <td><b>Página de Contato (/contato)</b></td>
        <td>Formulário de mensagem, endereço da sede e mapa.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>8.3</b></td>
        <td><b>Página de Doações (/doacoes)</b></td>
        <td>Informações de doação, chave PIX e contas bancárias.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>8.4</b></td>
        <td><b>Página Trabalhe Conosco</b></td>
        <td>Informações sobre processos seletivos e envio de currículo.</td>
      </tr>
    </tbody>
  </table>

  <!-- SEÇÃO 9: PAINEL ADMINISTRATIVO ADMINJS -->
  <div class="section-title">
    <span>SEÇÃO 9: PAINEL ADMINISTRATIVO ADMINJS (/admin)</span>
    <span>8 ITENS</span>
  </div>

  <table class="item-table">
    <thead>
      <tr>
        <th style="width: 5%;">Check</th>
        <th style="width: 7%;">ID</th>
        <th style="width: 35%;">Item de Inspeção Visual</th>
        <th style="width: 53%;">O que observar no Navegador</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>9.1</b></td>
        <td><b>Tela de Login (/admin/login)</b></td>
        <td>Formulário de login seguro com e-mail <code>admin@ongcdc.org.br</code>.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>9.2</b></td>
        <td><b>Menu Lateral (18 Recursos)</b></td>
        <td>Conferir individualmente os 18 recursos relacionados na tabela abaixo, organizados nas cinco categorias do menu.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>9.3</b></td>
        <td><b>Tabela Notícias no Admin</b></td>
        <td>52 registros com as ações Exibir, Editar e Excluir. Em telas menores, as ações podem aparecer no menu de três pontos à direita da linha.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>9.4</b></td>
        <td><b>Tabela Programas no Admin</b></td>
        <td>12 programas cadastrados na tabela.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>9.5</b></td>
        <td><b>Tabela Transparência no Admin</b></td>
        <td>49 relatórios cadastrados na tabela.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>9.6</b></td>
        <td><b>Editor SunEditor</b></td>
        <td>Formulário de edição com o editor de texto rico funcional.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>9.7</b></td>
        <td><b>Upload de Mídias</b></td>
        <td>Envio de imagens/PDFs sem falhas de carregamento.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>9.8</b></td>
        <td><b>Console F12 Limpo</b></td>
        <td>Zero erros vermelhos de JavaScript no console.</td>
      </tr>
    </tbody>
  </table>

  <div class="section-desc"><b>RELAÇÃO DOS 18 RECURSOS DO ITEM 9.2</b> — marque cada linha após abrir o respectivo recurso no painel.</div>
  <table class="item-table">
    <thead>
      <tr>
        <th style="width: 7%;">Check</th>
        <th style="width: 18%;">Categoria</th>
        <th style="width: 27%;">Nome exibido no painel</th>
        <th style="width: 48%;">Acesso direto</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="center"><div class="checkbox"></div></td><td>Início</td><td><b>Apresentação</b><br><small>Recurso técnico: Organização</small></td><td><a href="https://super.cdc.org.br/admin/resources/Organizacao">https://super.cdc.org.br/admin/resources/Organizacao</a></td></tr>
      <tr><td class="center"><div class="checkbox"></div></td><td>Início</td><td><b>Parceiro</b></td><td><a href="https://super.cdc.org.br/admin/resources/Parceiro">https://super.cdc.org.br/admin/resources/Parceiro</a></td></tr>
      <tr><td class="center"><div class="checkbox"></div></td><td>Início</td><td><b>Indicadores</b></td><td><a href="https://super.cdc.org.br/admin/resources/Indicador">https://super.cdc.org.br/admin/resources/Indicador</a></td></tr>
      <tr><td class="center"><div class="checkbox"></div></td><td>Início</td><td><b>Rodapé</b></td><td><a href="https://super.cdc.org.br/admin/resources/Rodape">https://super.cdc.org.br/admin/resources/Rodape</a></td></tr>
      <tr><td class="center"><div class="checkbox"></div></td><td>Institucional</td><td><b>Linha do Tempo</b></td><td><a href="https://super.cdc.org.br/admin/resources/LinhaDoTempo">https://super.cdc.org.br/admin/resources/LinhaDoTempo</a></td></tr>
      <tr><td class="center"><div class="checkbox"></div></td><td>Institucional</td><td><b>Estrutura Organizacional</b><br><small>Recurso técnico: Card Informativo</small></td><td><a href="https://super.cdc.org.br/admin/resources/CardInformativo">https://super.cdc.org.br/admin/resources/CardInformativo</a></td></tr>
      <tr><td class="center"><div class="checkbox"></div></td><td>Institucional</td><td><b>Lideranças</b></td><td><a href="https://super.cdc.org.br/admin/resources/Lideranca">https://super.cdc.org.br/admin/resources/Lideranca</a></td></tr>
      <tr><td class="center"><div class="checkbox"></div></td><td>Institucional</td><td><b>Transparência</b></td><td><a href="https://super.cdc.org.br/admin/resources/Transparencia">https://super.cdc.org.br/admin/resources/Transparencia</a></td></tr>
      <tr><td class="center"><div class="checkbox"></div></td><td>Institucional</td><td><b>Pergunta Frequente</b></td><td><a href="https://super.cdc.org.br/admin/resources/PerguntaFrequente">https://super.cdc.org.br/admin/resources/PerguntaFrequente</a></td></tr>
      <tr><td class="center"><div class="checkbox"></div></td><td>Institucional</td><td><b>Trabalhe conosco</b><br><small>Recurso técnico: Oportunidade</small></td><td><a href="https://super.cdc.org.br/admin/resources/Oportunidade">https://super.cdc.org.br/admin/resources/Oportunidade</a></td></tr>
      <tr><td class="center"><div class="checkbox"></div></td><td>Programas</td><td><b>Programa</b></td><td><a href="https://super.cdc.org.br/admin/resources/Programa">https://super.cdc.org.br/admin/resources/Programa</a></td></tr>
      <tr><td class="center"><div class="checkbox"></div></td><td>Informe-se</td><td><b>Publicação</b></td><td><a href="https://super.cdc.org.br/admin/resources/Publicacao">https://super.cdc.org.br/admin/resources/Publicacao</a></td></tr>
      <tr><td class="center"><div class="checkbox"></div></td><td>Informe-se</td><td><b>Notícias</b></td><td><a href="https://super.cdc.org.br/admin/resources/Noticia">https://super.cdc.org.br/admin/resources/Noticia</a></td></tr>
      <tr><td class="center"><div class="checkbox"></div></td><td>Configurações</td><td><b>Áreas</b></td><td><a href="https://super.cdc.org.br/admin/resources/Area">https://super.cdc.org.br/admin/resources/Area</a></td></tr>
      <tr><td class="center"><div class="checkbox"></div></td><td>Configurações</td><td><b>Doe agora (dados)</b><br><small>Recurso técnico: Dados Bancários</small></td><td><a href="https://super.cdc.org.br/admin/resources/DadosBancario">https://super.cdc.org.br/admin/resources/DadosBancario</a></td></tr>
      <tr><td class="center"><div class="checkbox"></div></td><td>Configurações</td><td><b>E-mails (vagas/contato)</b></td><td><a href="https://super.cdc.org.br/admin/resources/Email">https://super.cdc.org.br/admin/resources/Email</a></td></tr>
      <tr><td class="center"><div class="checkbox"></div></td><td>Configurações</td><td><b>Banners</b></td><td><a href="https://super.cdc.org.br/admin/resources/Capa">https://super.cdc.org.br/admin/resources/Capa</a></td></tr>
      <tr><td class="center"><div class="checkbox"></div></td><td>Configurações</td><td><b>Títulos e resumos</b></td><td><a href="https://super.cdc.org.br/admin/resources/ConteudoSecao">https://super.cdc.org.br/admin/resources/ConteudoSecao</a></td></tr>
    </tbody>
  </table>

  <!-- SEÇÃO 10: RESPONSIVIDADE MULTI-DISPOSITIVO -->
  <div class="section-title">
    <span>SEÇÃO 10: RESPONSIVIDADE MULTI-DISPOSITIVO & DESEMPENHO</span>
    <span>6 ITENS</span>
  </div>

  <table class="item-table">
    <thead>
      <tr>
        <th style="width: 5%;">Check</th>
        <th style="width: 7%;">ID</th>
        <th style="width: 35%;">Item de Inspeção Visual</th>
        <th style="width: 53%;">O que observar no Navegador</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>10.1</b></td>
        <td><b>Mobile Pequeno (375px)</b></td>
        <td>iPhone SE/12/13 sem rolagem horizontal indesejada.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>10.2</b></td>
        <td><b>Mobile Grande (430px)</b></td>
        <td>iPhone Pro Max / Android com proporções equilibradas.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>10.3</b></td>
        <td><b>Tablet (768px / 834px)</b></td>
        <td>Transição do menu hambúrguer e grid de 2 colunas.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>10.4</b></td>
        <td><b>Desktop (1280px / 1440px)</b></td>
        <td>Layout espaçado com legibilidade ideal.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>10.5</b></td>
        <td><b>Ultrawide (1920px)</b></td>
        <td>Conteúdo centralizado sem esticar excessivamente.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>10.6</b></td>
        <td><b>Verificação de Broken Images</b></td>
        <td>Ausência de ícones de imagem quebrada em todas as páginas.</td>
      </tr>
    </tbody>
  </table>

  <!-- SEÇÃO 11: AUDITORIA AVANÇADA DE SEGURANÇA, SEO E PERFORMANCE -->
  <div class="section-title">
    <span>SEÇÃO 11: AUDITORIA AVANÇADA DE SEGURANÇA, SEO E PERFORMANCE (EXTRAS)</span>
    <span>10 ITENS</span>
  </div>

  <table class="item-table">
    <thead>
      <tr>
        <th style="width: 5%;">Check</th>
        <th style="width: 7%;">ID</th>
        <th style="width: 35%;">Item de Inspeção Técnica</th>
        <th style="width: 53%;">O que observar / Garantir</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>11.1</b></td>
        <td><b>Certificado SSL HTTPS</b></td>
        <td>Cadeado de conexão segura no navegador (Let's Encrypt / Traefik).</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>11.2</b></td>
        <td><b>Parametrização SQL Injection</b></td>
        <td>Consultas tratadas via ORM Sequelize sem concatenação direta de strings.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>11.3</b></td>
        <td><b>Segurança de Sessão Cookie</b></td>
        <td>Cookie <code>connect.sid</code> com diretivas de segurança ativadas.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>11.4</b></td>
        <td><b>Title Tags Únicas</b></td>
        <td>Título da aba do navegador alterando conforme a página aberta.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>11.5</b></td>
        <td><b>Hierarquia HTML (h1, h2)</b></td>
        <td>Apenas um título <code>h1</code> principal por página.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>11.6</b></td>
        <td><b>Compressão Gzip/Brotli</b></td>
        <td>Carregamento rápido de scripts minificados.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>11.7</b></td>
        <td><b>Otimização de Fontes</b></td>
        <td>Google Fonts (<i>Lato</i>) carregando sem bloquear renderização.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>11.8</b></td>
        <td><b>Fallback de Mídia Centralizado</b></td>
        <td>Função <code>resolveMediaUrlOrFallback</code> prevenindo 404 em mídias.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>11.9</b></td>
        <td><b>Acessibilidade Tags alt</b></td>
        <td>Descrições em imagens para leitores de tela.</td>
      </tr>
      <tr>
        <td style="text-align: center;"><div class="checkbox"></div></td>
        <td><b>11.10</b></td>
        <td><b>Redirecionamento HTTP para HTTPS</b></td>
        <td>Forçamento automático de tráfego seguro.</td>
      </tr>
    </tbody>
  </table>

  <!-- BOX DE OBSERVAÇÕES DO INSPETOR E ASSINATURA -->
  <div style="margin-top: 15px;">
    <b>Anotações, Sugestões e Observações dos Inspetores (Kleber Fanini & Fernando Vier):</b>
    <div class="notes-box"></div>
  </div>

  <div class="change-records">
    <div class="change-record">
      <p><b>Adições:</b> registre aqui novos conteúdos, páginas, recursos ou funcionalidades identificados durante a inspeção.</p>
      <div class="change-lines"></div>
    </div>
    <div class="change-record">
      <p><b>Remoções:</b> registre aqui conteúdos, páginas, recursos ou funcionalidades que deixaram de estar disponíveis.</p>
      <div class="change-lines"></div>
    </div>
  </div>

  <div class="signature-grid">
    <div class="signature-line">
      Kleber Fanini (Avaliador Responsável)
    </div>
    <div class="signature-line">
      Fernando Vier (Líder Técnico & Desenvolvimento)
    </div>
  </div>

</body>
</html>
`;

const SITE_URL = 'https://super.cdc.org.br';
const routeByItem = {
  '0.1': '/', '0.2': '/', '0.3': '/institucional#timeline', '0.4': '/admin', '0.5': '/admin',
  '1.1': '/', '1.2': '/doacoes', '1.3': '/doacoes', '1.4': '/', '1.5': '/',
  '1.6': '/', '1.7': '/', '1.8': '/institucional#timeline', '1.9': '/',
  '2.1': '/institucional', '2.2': '/institucional', '2.3': '/institucional', '2.4': '/institucional',
  '3.1': '/', '3.2': '/', '3.3': '/', '3.4': '/', '3.5': '/', '3.6': '/',
  '4.1': '/institucional', '4.2': '/institucional#timeline', '4.3': '/institucional#organizacao',
  '4.4': '/institucional#liderancas', '4.5': '/institucional#transparencia', '4.6': '/institucional#faq',
  '5.1': '/institucional#timeline', '5.2': '/institucional#timeline',
  '5.3': '/institucional#organizacao', '5.4': '/institucional#liderancas',
  '5.5': '/institucional#transparencia', '5.6': '/institucional#transparencia',
  '5.7': '/institucional#faq',
  '6.1': '/noticias', '6.2': '/noticias', '6.3': '/noticias',
  '6.4': '/noticias/175', '6.5': '/noticias/84', '6.6': '/noticias/175',
  '7.1': '/programas', '7.2': '/programas/58', '7.3': '/programas/58',
  '8.1': '/publicacoes', '8.2': '/contato', '8.3': '/doacoes', '8.4': '/trabalhe-conosco',
  '9.1': '/admin/login', '9.2': '/admin', '9.3': '/admin/resources/Noticia',
  '9.4': '/admin/resources/Programa', '9.5': '/admin/resources/Transparencia',
  '9.6': '/admin/resources/Noticia', '9.7': '/admin/resources/Noticia', '9.8': '/admin',
  '10.1': '/', '10.2': '/', '10.3': '/', '10.4': '/', '10.5': '/', '10.6': '/',
  '11.1': '/', '11.2': '/', '11.3': '/admin/login', '11.4': '/', '11.5': '/',
  '11.6': '/', '11.7': '/', '11.8': '/', '11.9': '/', '11.10': '/',
};

const routeLink = (route) => {
  const url = new URL(route, SITE_URL).href;
  return `<div class="inspection-route"><b>Onde verificar:</b> <a href="${url}">${url}</a></div>`;
};

for (const [itemId, route] of Object.entries(routeByItem)) {
  const rowPattern = new RegExp(`(<tr>[\\s\\S]*?<td><b>${itemId.replace('.', '\\.')}</b></td>[\\s\\S]*?)(</tr>)`);
  htmlContent = htmlContent.replace(rowPattern, (row, content, closingTag) => {
    const lastCell = content.lastIndexOf('</td>');
    if (lastCell === -1) return row;
    return `${content.slice(0, lastCell)}${routeLink(route)}${content.slice(lastCell)}${closingTag}`;
  });
}

fs.writeFileSync(path.join(process.cwd(), 'checklist_temp.html'), htmlContent);

console.log("Gerando o arquivo PDF de alta definição com metadados oficiais via Google Chrome...");
execSync('/usr/bin/google-chrome --headless --disable-gpu --no-pdf-header-footer --print-to-pdf=checklist_inspecao_completa.pdf checklist_temp.html');

console.log("PDF gerado com sucesso!");
fs.unlinkSync(path.join(process.cwd(), 'checklist_temp.html'));
