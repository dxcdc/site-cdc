# Auditoria local do checklist do site CDC

Data: 10/08/2026
Escopo: somente laboratório local (`localhost`), sem alteração ou validação da produção.
Legenda: ☑ aprovado · ⚠ aprovado com ressalvas · ✕ reprovado · — não se aplica ao laboratório local.

## Resumo executivo

- Aplicação pública, API, banco e AdminJS estavam operacionais no laboratório.
- Foram conferidas as páginas principais em navegador real, nas larguras 375, 430, 768, 834, 1280, 1440 e 1920 px.
- O banco contém 52 notícias, 12 programas, 49 documentos de transparência e 20 lideranças.
- As 146 referências de mídia cadastradas apontam para arquivos locais existentes.
- O AdminJS possui 18 recursos configurados, e não os 28 declarados no checklist.
- Nenhuma gravação, exclusão, upload real, envio de formulário externo ou mudança em produção foi executada nesta auditoria.

## Seção 0 — itens anteriormente declarados resolvidos

| Status | ID | Resultado da nova verificação |
|---|---:|---|
| ☑ | 0.1 | O checklist está disponível e cobre as áreas indicadas. |
| ☑ | 0.2 | Contagens confirmadas no banco: 52 notícias, 12 programas, 49 documentos e 20 lideranças; 146/146 mídias referenciadas existem localmente. |
| ☑ | 0.3 | O tratamento de rolagem está ativo e os cinco destinos existem; os nomes técnicos de três IDs diferem dos escritos no checklist. |
| ✕ | 0.4 | Há dados no painel, mas somente 18 recursos AdminJS estão configurados. A afirmação de 28 recursos não foi confirmada. |
| ☑ | 0.5 | Login, listagens e editor abriram sem erro JavaScript vermelho no console durante o fluxo verificado. |

## Seção 1 — topo, cabeçalho e navegação

| Status | ID | Evidência local |
|---|---:|---|
| ☑ | 1.1 | Logo visível, alinhado e clicável; retorna para `/`. |
| ☑ | 1.2 | Botão desktop visível, laranja `#FE9A03`, com seta e destino `/doacoes`. |
| ☑ | 1.3 | Botão permanece visível e utilizável em 375 e 430 px. |
| ☑ | 1.4 | O botão de busca abre o campo de pesquisa. |
| ☑ | 1.5 | Itens principais e submenus aparecem e respondem no desktop. |
| ☑ | 1.6 | Menu hambúrguer abre a navegação vertical no mobile. |
| ☑ | 1.7 | A seleção de link principal fecha o menu mobile. |
| ☑ | 1.8 | A seleção de subitem também fecha o menu mobile. |
| ☑ | 1.9 | Cabeçalho permanece fixo durante a rolagem. |

## Seção 2 — banner principal

| Status | ID | Evidência local |
|---|---:|---|
| ✕ | 2.1 | O texto esperado “Defendendo a dignidade humana...” não é exibido no banner da Home. |
| ⚠ | 2.2 | A imagem carrega sem quebra, mas o enquadramento mobile corta parte do conteúdo e deixa parte do slide adjacente aparente. |
| ✕ | 2.3 | Texto/chamada do banner apresenta contraste muito baixo sobre a imagem clara. |
| ☑ | 2.4 | Setas e indicadores do carrossel estão visíveis e operacionais. |

## Seção 3 — página inicial

| Status | ID | Evidência local |
|---|---:|---|
| ⚠ | 3.1 | O card “Missão” e sua imagem existem, mas o rótulo não corresponde literalmente a “Nossa Missão”. |
| ⚠ | 3.2 | O card “Visão” e sua imagem existem, mas o rótulo não corresponde literalmente a “Nossa Visão”. |
| ☑ | 3.3 | 19 parceiros cadastrados; logotipos e animação contínua são renderizados. |
| ☑ | 3.4 | Notícias em destaque exibem capa, título, data e navegação para o detalhe. |
| ☑ | 3.5 | Os três indicadores sociais são exibidos com destaque e sem estouro horizontal. |
| ⚠ | 3.6 | Chamadas principais verificadas navegam corretamente; não foi realizado clique exaustivo em todo link editorial da página. |

## Seção 4 — institucional: submenu e âncoras

| Status | ID | Evidência local |
|---|---:|---|
| ☑ | 4.1 | Barra com cinco tópicos permanece abaixo do cabeçalho. |
| ☑ | 4.2 | “Linha do tempo” aponta para `#timeline` e realiza a rolagem. |
| ⚠ | 4.3 | A rolagem funciona, mas o ID implementado é `#organizationCdc`, não `#organizacao`. |
| ⚠ | 4.4 | A rolagem funciona, mas o ID implementado é `#leadership`, não `#liderancas`. |
| ⚠ | 4.5 | A rolagem funciona, mas o ID implementado é `#transparent`, não `#transparencia`. |
| ☑ | 4.6 | “Perguntas frequentes” aponta para `#faq` e realiza a rolagem. |

## Seção 5 — institucional: conteúdo interno

| Status | ID | Evidência local |
|---|---:|---|
| ✕ | 5.1 | Os anos cadastrados são 2000, 2011, 2012, 2015, 2017, 2019, 2020, 2022, 2023, 2024 e 2025; não correspondem ao intervalo declarado de 2010 a 2025. |
| ☑ | 5.2 | Fotografias históricas referenciadas existem e são exibidas com o tratamento visual do componente. |
| ⚠ | 5.3 | Há cards de Assembleia Geral, Diretoria Institucional, Conselho Fiscal e outros, porém não existe card explicitamente denominado “Conselho de Administração”. |
| ✕ | 5.4 | Maria Silva, João Santos e Ana Oliveira não constam entre as 20 lideranças cadastradas; além disso, há lideranças sem foto/e-mail e um nome duplicado. |
| ☑ | 5.5 | Os 49 registros de transparência estão disponíveis. |
| ⚠ | 5.6 | Os 49 itens possuem URL e abrem em nova aba; a disponibilidade final dos documentos externos no Google Drive não foi validada neste escopo local. |
| ☑ | 5.7 | Os acordeões da FAQ expandem e recolhem o conteúdo. |

## Seção 6 — notícias

| Status | ID | Evidência local |
|---|---:|---|
| ☑ | 6.1 | Cards são alimentados com capa, título, autor, data e tempo de leitura cadastrados. |
| ✕ | 6.2 | As categorias cadastradas são `teste`, `teste2` e `teste3`, não as áreas editoriais esperadas no checklist. |
| ✕ | 6.3 | A listagem renderiza todos os registros em um grid; não existe componente ou controle de paginação. |
| ✕ | 6.4 | A notícia 175 abre com título, data e conteúdo, porém a página detalhada não renderiza o autor. |
| ☑ | 6.5 | As imagens do corpo da notícia 175 carregaram sem erro no navegador. |
| ✕ | 6.6 | Não há botão “Voltar” implementado na página detalhada. |

## Seção 7 — programas

| Status | ID | Evidência local |
|---|---:|---|
| ☑ | 7.1 | Os 12 programas são retornados e exibidos com capa, título e link. |
| ☑ | 7.2 | O programa 58 abre como “ATITUDE — Programa de Atenção Integral a Usuários de Drogas e Seus Familiares”. |
| ☑ | 7.3 | Descrição, conteúdo institucional e seis imagens cadastradas são apresentados no detalhe. |

## Seção 8 — páginas complementares

| Status | ID | Evidência local |
|---|---:|---|
| ☑ | 8.1 | Dez publicações estão disponíveis, com links de leitura/download. |
| ⚠ | 8.2 | Página, campos e informações de contato são exibidos; envio real não foi feito para evitar mensagem externa durante a auditoria. |
| ☑ | 8.3 | Chave PIX, conta, agência, titular e orientações são exibidos a partir do cadastro local. |
| ⚠ | 8.4 | Página e orientações abrem corretamente, mas o banco local não contém oportunidade ativa para validar candidatura completa. |

## Seção 9 — painel AdminJS

| Status | ID | Evidência local |
|---|---:|---|
| ☑ | 9.1 | Login local exibido e autenticação administrativa concluída; nenhuma senha foi registrada neste relatório. |
| ✕ | 9.2 | Foram identificados 18 recursos, não 28. |
| ☑ | 9.3 | A API interna do AdminJS confirmou 52 notícias e ações disponíveis conforme a configuração. |
| ☑ | 9.4 | A API interna do AdminJS confirmou 12 programas. |
| ☑ | 9.5 | A API interna do AdminJS confirmou 49 documentos de transparência. |
| ⚠ | 9.6 | SunEditor e controles ricos carregam na edição da notícia 175; salvamento não foi realizado para preservar os dados. |
| ⚠ | 9.7 | Campos de upload de mídia aparecem, mas nenhum arquivo foi persistido neste teste não destrutivo. |
| ☑ | 9.8 | Não houve erro vermelho de JavaScript no console durante login, listagens e abertura do editor. |

## Seção 10 — responsividade e dispositivos

| Status | ID | Evidência local |
|---|---:|---|
| ☑ | 10.1 | Em 375 px, a largura excedente medida foi 0 px. |
| ⚠ | 10.2 | Em 430 px não há rolagem horizontal, mas o enquadramento do banner merece ajuste. |
| ☑ | 10.3 | Em 768 e 834 px não há rolagem horizontal; menu e grids assumem o layout responsivo. |
| ☑ | 10.4 | Em 1280 e 1440 px, conteúdo e cabeçalho permanecem alinhados. |
| ☑ | 10.5 | Em 1920 px, não foi detectado estouro horizontal. |
| ✕ | 10.6 | Embora 146/146 arquivos locais existam e as imagens amostradas renderizem, há requisições para `/null` (404) e fallback externo retornando 429. |

## Seção 11 — segurança, SEO, acessibilidade e performance

| Status | ID | Evidência local |
|---|---:|---|
| — | 11.1 | Certificado e HTTPS pertencem ao ambiente publicado; o laboratório solicitado opera em HTTP local. |
| ☑ | 11.2 | Operações usam Sequelize/ORM; a busca SQL localizada usa parâmetro nomeado, sem concatenação do termo informado. |
| ⚠ | 11.3 | `connect.sid` possui `HttpOnly` e `SameSite=Lax`; não possui `Secure` no HTTP local nem expiração explícita. Deve ser revalidado sob HTTPS na produção. |
| ✕ | 11.4 | Todas as páginas verificadas exibem o mesmo título “Centro de Desenvolvimento e Cidadania”. |
| ✕ | 11.5 | A Home possui quatro `h1`; detalhes de notícia e programa não possuem `h1`; outras páginas apresentam duplicação de títulos. |
| ☑ | 11.6 | Respostas textuais são entregues com `Content-Encoding: gzip` quando o cliente aceita compressão. |
| ☑ | 11.7 | Lato é carregada pelo mecanismo otimizado de fontes do Next.js. |
| ✕ | 11.8 | O fallback não evita `/null` e depende de uma imagem externa que retornou HTTP 429. |
| ⚠ | 11.9 | Não foram encontradas tags `img` sem `alt`, porém imagens decorativas usam textos genéricos em vez de `alt=""`. |
| — | 11.10 | Redirecionamento HTTP→HTTPS deve ser validado no proxy/domínio publicado, fora do laboratório local. |

## Não conformidades prioritárias

| Prioridade | Itens | Ação recomendada |
|---|---|---|
| Alta | 10.6, 11.8 | Eliminar URLs `/null` e trocar o fallback externo por ativo local confiável. |
| Alta | 2.3 | Corrigir contraste e legibilidade do banner, incluindo mobile. |
| Alta | 11.4, 11.5 | Implementar metadados por rota e corrigir a hierarquia de títulos. |
| Média | 6.2, 6.3, 6.4, 6.6 | Corrigir categorias, adicionar paginação, autor e botão de retorno nas notícias. |
| Média | 0.4, 9.2 | Alinhar o checklist com os 18 recursos reais ou configurar os recursos efetivamente ausentes. |
| Média | 5.1, 5.3, 5.4 | Revisar dados institucionais oficiais, nomenclaturas e cadastros incompletos/duplicados. |
| Média | 2.1, 3.1, 3.2 | Alinhar conteúdo esperado no checklist com o conteúdo oficial e a Home atual. |
| Baixa | 4.3–4.5, 11.9 | Padronizar IDs das âncoras e textos alternativos de elementos decorativos. |

## Critério para a próxima etapa

As correções devem continuar primeiro no laboratório local, com nova execução deste checklist. Somente depois de aprovação local deve ser preparado um pacote de entrega para o ambiente publicado; esta auditoria não autoriza envio, implantação ou alteração de produção.

## Atualização após correções locais

As correções técnicas foram aplicadas e revalidadas no laboratório em 10/08/2026. Esta atualização substitui os resultados anteriores dos itens listados abaixo:

| Status atual | Itens | Resultado após a correção |
|---|---|---|
| ☑ | 2.1, 2.2, 2.3 | Título institucional sem HTML aparente, contraste reforçado e tipografia/enquadramento mobile ajustados. |
| ☑ | 4.3, 4.4, 4.5 | IDs padronizados para `#organizacao`, `#liderancas` e `#transparencia`; os cinco destinos foram encontrados no navegador. |
| ☑ | 6.2 | Confirmado que a interface filtra por áreas; `Institucional`, `Direitos da Pessoa Idosa` e `ATITUDE` existem no cadastro oficial de áreas. |
| ☑ | 6.3 | Paginação de 12 notícias por página adicionada, com retorno suave ao início ao trocar de página. |
| ☑ | 6.4, 6.6 | Detalhe da notícia 175 agora apresenta autor e botão de retorno para `/noticias`. |
| ☑ | 10.2, 10.6, 11.8 | Fallback local centralizado; eliminadas dependências de imagens externas e requisições `/null`. |
| ☑ | 11.4 | Títulos próprios por seção e títulos dinâmicos nos detalhes de notícia/programa. |
| ☑ | 11.5 | As dez páginas principais verificadas passaram a apresentar exatamente um `h1`. |
| ☑ | 11.6, 11.7 | Build otimizado aprovado e `sharp` incluído para otimização de imagens. |

Validação pós-correção:

- Build Next.js concluído com sucesso, incluindo lint e TypeScript.
- Home, Institucional, Notícias, notícia 175, Programas, programa 58, Publicações, Contato, Doações e Trabalhe Conosco: HTTP funcional, um `h1`, título adequado, zero imagens quebradas e zero erros vermelhos no console.
- API saudável e conectada ao PostgreSQL.
- Auditoria de mídias: 146/146 arquivos existentes.
- Nenhuma alteração foi enviada para produção.

Permanecem dependentes de definição ou conteúdo oficial: quantidade esperada de recursos AdminJS (18 implementados versus 28 descritos), datas da linha do tempo, composição/nome do Conselho de Administração e dados incompletos ou divergentes de lideranças. Testes que gerariam efeitos externos, como envio real de contato, candidatura e upload persistente, continuam registrados com ressalva.

Auditoria de dependências: não há vulnerabilidade crítica nas dependências de produção. Permanece um alerta alto associado ao Next.js cuja correção automática indicada exige migração principal para Next 16; essa migração deve ser tratada separadamente por envolver mudanças incompatíveis, e não foi forçada nesta correção local.
