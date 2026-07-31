# 📁 Estrutura de Imagens — site-cdc

> Última atualização: 2026-07-31
> Status: ✅ Arquitetura definitiva implementada

---

## Arquitetura Adotada

Todas as imagens do projeto são **dinâmicas** — cadastradas pelo painel AdminJS e servidas pelo backend Express. Não existe distinção entre "imagens estáticas" e "imagens dinâmicas" para fins de exibição.

```
ARMAZENAMENTO:    ./uploads/<categoria>/<arquivo>   (bind mount Docker)
SERVIÇO DE MÍDIA: backend Express na rota /uploads
URL PÚBLICA:      ${NEXT_PUBLIC_API_URL}/uploads/<caminho-relativo>
FORMATO NO BANCO: caminho relativo sem barra inicial (ex: "banners/18-IMG_7339_(1).jpg")
```

---

## Estrutura de Diretórios

```text
site-cdc/
├── uploads/                          ← armazenamento persistente (bind mount)
│   ├── banners/                      ← imagens de cabeçalho de páginas
│   ├── noticias/                     ← fotos de notícias e publicações
│   ├── organizacao/                  ← fotos da estrutura organizacional
│   ├── parceiros/                    ← logos de parceiros
│   ├── programa/                     ← fotos de programas
│   └── linha_do_tempos/              ← imagens da linha do tempo
│
├── backend/src/app.js                ← serve /uploads via express.static
│
└── frontend/
    ├── src/lib/media.ts              ← resolveMediaUrl() — função central
    ├── src/constants/storageDomain.ts ← storageUrl (deprecated, mantido por compatibilidade)
    └── public/assets/                ← assets estáticos opcionais (não são uploads)
```

---

## Fluxo de Exibição de Imagens

```
Banco de dados: "banners/18-IMG_7339_(1).jpg"
       ↓
API (GET /banner?pagina=...): { "url_img": "banners/18-IMG_7339_(1).jpg" }
       ↓
Frontend (resolveMediaUrl):  "http://localhost:5000/uploads/banners/18-IMG_7339_(1).jpg"
       ↓
Browser: GET http://localhost:5000/uploads/banners/18-IMG_7339_(1).jpg
       ↓
Backend Express:  HTTP 200 OK | Content-Type: image/jpeg
```

---

## Função Central: `resolveMediaUrl`

**Localização:** `frontend/src/lib/media.ts`

```typescript
import { resolveMediaUrl } from '@/lib/media';

// Exemplo de uso em componente:
const url = resolveMediaUrl(item.url_imagem);
// Resultado: "http://localhost:5000/uploads/parceiros/6-logo_(3)_(1).png"
```

**Comportamento:**
- Caminhos relativos → prefixados com `${NEXT_PUBLIC_API_URL}/uploads/`
- URLs absolutas `http(s)://` → retornadas sem modificação (compatibilidade com GCS legado)
- `null` / `undefined` / string vazia → retorna `null`
- Remove barra inicial e prefixo `uploads/` duplicado automaticamente

---

## Localização dos Elementos

| Elemento | Categoria | Tabela/Coluna | Diretório físico | URL pública |
|---|---|---|---|---|
| Banner de página | Dinâmica | `capa.url_img` | `uploads/banners/` | `/uploads/banners/...` |
| Foto de notícia (capa) | Dinâmica | `noticias.imagem_capa` | `uploads/noticias/` | `/uploads/noticias/...` |
| Foto adicional de notícia | Dinâmica | `noticias_imagens.imagem_url` | `uploads/noticias/` | `/uploads/noticias/...` |
| Logo de parceiro | Dinâmica | `parceiro.url_imagem` | `uploads/parceiros/` | `/uploads/parceiros/...` |
| Imagem de programa | Dinâmica | `programa_imagens.url_imagem` | `uploads/programa/` | `/uploads/programa/...` |
| Capa de programa | Dinâmica | `programas.url_image_capa` | `uploads/programa/` | `/uploads/programa/...` |
| Foto de liderança | Dinâmica | `lideranca.url_imagem` | `uploads/organizacao/` | `/uploads/organizacao/...` |
| Foto de organização | Dinâmica | `organizacao_imagens.imagem_url` | `uploads/organizacao/` | `/uploads/organizacao/...` |
| Linha do tempo | Dinâmica | `linha_do_tempo_imagens.url_imagem` | `uploads/linha_do_tempos/` | `/uploads/linha_do_tempos/...` |
| QR Code / Logo banco (doações) | Dinâmica | `dados_bancarios.url_imagem` | `uploads/` | `/uploads/...` |
| Card informativo (missão/visão) | Dinâmica | `card_informativo.url_imagem` | `uploads/` | `/uploads/...` |

---

## Variáveis de Ambiente

| Variável | Onde usar | Valor dev | Valor Docker | Descrição |
|---|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | frontend | `http://localhost:5000` | `http://localhost:5000` | Base URL do backend |

> ⚠️ A variável `NEXT_PUBLIC_STORAGE` foi **removida do projeto**. Não a reintroduza.
> URLs de mídia são construídas como `${NEXT_PUBLIC_API_URL}/uploads/<caminho>`.

---

## Configuração Docker

### docker-compose.yml — pontos críticos

```yaml
backend:
  volumes:
    - ./uploads:/app/uploads          # uploads escritos e lidos aqui

frontend:
  build:
    args:
      NEXT_PUBLIC_API_URL: ...        # DEVE ser ARG, não environment!
```

> ⚠️ **Regra crítica**: `NEXT_PUBLIC_*` em Next.js são embutidas **durante o build**, não em runtime.
> Devem ser passadas como `ARG` no Dockerfile e via `build.args` no docker-compose.
> Passá-las apenas em `environment:` não tem efeito no bundle compilado.

### Dockerfile do frontend

```dockerfile
# CORRETO:
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build
```

---

## Como o Backend Serve Uploads

**Arquivo:** `backend/src/app.js`

```javascript
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
```

O `process.cwd()` dentro do container é `/app`. Logo:
- Arquivos em `./uploads/banners/foto.jpg` (host)
- Estão em `/app/uploads/banners/foto.jpg` (container)
- Acessíveis via `GET http://localhost:5000/uploads/banners/foto.jpg`

---

## Nomenclatura de Arquivos

- Formato: `<ID-do-registro>-<nome-original>.<extensão>`
- Exemplos: `18-IMG_7339_(1).jpg`, `6-logo_(3)_(1).png`
- Subpastas: categorias em minúsculas sem acentos
- **Não renomeie** arquivos referenciados no banco sem atualizar o campo correspondente.

---

## Como Adicionar Imagens

1. Acesse o **Painel AdminJS** (`http://localhost:3001`)
2. Navegue até o recurso desejado (Banners, Notícias, Programas, etc.)
3. Faça upload pelo formulário — o arquivo é salvo em `./uploads/<categoria>/`
4. O caminho relativo é salvo automaticamente no banco

---

## Procedimento de Backup

```bash
# Backup do banco:
docker compose exec postgres pg_dump -U cdc_user site_cdc_db > backup_YYYYMMDD.sql

# Backup dos uploads:
zip -r uploads_backup_YYYYMMDD.zip uploads/
# ou
tar -czf uploads_backup_YYYYMMDD.tar.gz uploads/
```

## Procedimento de Restauração

```bash
# Restaurar banco:
docker compose exec -T postgres psql -U cdc_user site_cdc_db < backup_YYYYMMDD.sql

# Restaurar uploads (colocar arquivos de volta em ./uploads/):
unzip uploads_backup_YYYYMMDD.zip
# ou
tar -xzf uploads_backup_YYYYMMDD.tar.gz
```

---

## Scripts Auxiliares

| Script | Função | Quando usar |
|---|---|---|
| `scripts/download_images.js` | Baixa imagens do GCS para `./uploads/` | Migração do GCS para local |
| `scripts/migrate_image_paths.js` | Copia `uploads/ → frontend/public/assets/` (recursivo) | Apenas se optar por servir via Next.js |

---

## Diagnóstico de Erros Comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| Imagem `undefined/caminho.jpg` | `NEXT_PUBLIC_API_URL` não foi passada como ARG no Docker build | Adicionar `ARG NEXT_PUBLIC_API_URL` no Dockerfile antes do `RUN npm run build` |
| Imagem `/assets/caminho.jpg` quebrada | Arquivo não está em `frontend/public/assets/` | Verificar se deveria ser servido pelo backend via `/uploads/` |
| HTTP 404 no backend | Arquivo não existe em `./uploads/<caminho>` | Verificar bind mount Docker e executar `download_images.js` se necessário |
| HTTP 404 no Next.js Image | hostname não está em `remotePatterns` | Atualizar `next.config.js` com o hostname correto |
| Imagens somem após `docker compose down` | Uploads em volume nomeado em vez de bind mount | Usar bind mount `./uploads:/app/uploads` |
| URL com double-slash `//` | Caminho relativo tem barra inicial | `resolveMediaUrl` já trata isso automaticamente |
| Imagens do legado GCS quebradas | URL era absoluta `https://storage.googleapis.com/...` | `resolveMediaUrl` retorna URLs absolutas sem modificação — OK |

---

## Componente de Diagnóstico

**`DiagnosticButton`** (`frontend/src/components/atoms/DiagnosticButton.tsx`) testa imagens reais com HEAD requests e exibe URL, status HTTP, Content-Type e tempo.

Visível apenas em `NODE_ENV=development` ou `NEXT_PUBLIC_DIAGNOSTIC=true`.
