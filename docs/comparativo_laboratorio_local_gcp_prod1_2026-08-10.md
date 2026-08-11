# Comparativo: laboratório local CDC Site × laboratório GCP `prod1`

Data: 10/08/2026
VM: `prod1` · `us-central1-a` · `e2-medium` · IP interno `10.128.0.16` · IP externo `136.113.22.112`
Método: inspeção somente leitura por SSH com `gt_transformadigital` e chave `id_ed25519_fvier`.

## Conclusão principal

Os ambientes não são duas instalações do mesmo produto:

| Ambiente | Produto | Arquitetura | Publicação |
|---|---|---|---|
| Local | Site institucional CDC | Next.js + Express + AdminJS + PostgreSQL | Somente `127.0.0.1` nas portas 3000, 5001, 3001 e 5432 |
| GCP `prod1` | Estoque/ERP CDC | Frappe/ERPNext + MariaDB + Redis + workers | `estoque.cdc.org.br`, Caddy/Cloudflare; frontend também exposto em `0.0.0.0:8080` |

Não existe na VM um checkout, container, processo ou rota do projeto `CDC/Site`. Por isso não é tecnicamente válido comparar notícias, programas, páginas institucionais ou AdminJS entre esses dois ambientes como se fossem réplicas. A comparação útil é de arquitetura, operação e segurança.

## Conteúdo e páginas

### Laboratório local

- Home, Institucional, Notícias, Programas, Publicações, Contato, Doações e Trabalhe Conosco estão funcionais.
- API conectada ao PostgreSQL e AdminJS acessível localmente.
- Conteúdo auditado: 52 notícias, 12 programas, 49 documentos de transparência, 20 lideranças e 146/146 mídias locais presentes.
- Após as correções, as dez páginas principais têm título próprio, um `h1`, nenhuma imagem quebrada e nenhum erro vermelho de console.

### GCP `prod1`

- Aplicação publicada é o ERPNext de estoque, não o site institucional.
- Site interno Frappe está armazenado como `frontend`; o domínio público é `estoque.cdc.org.br`.
- Aplicativos: Frappe `15.88.2` e ERPNext `15.88.1`.
- O domínio redireciona corretamente para login e apresenta cabeçalhos HSTS, `X-Frame-Options`, `X-Content-Type-Options` e política de referência.
- O comando `bench doctor` sem site falha procurando `estoque.cdc.org.br`; a configuração operacional deve usar explicitamente `--site frontend` ou alinhar o nome do site ao domínio.

## Infraestrutura e capacidade da GCP

| Item | Resultado |
|---|---|
| Sistema | Debian 12, kernel `6.1.0-51-cloud-amd64` |
| CPU | 2 vCPUs |
| Memória | 3,8 GiB; aproximadamente 1,9 GiB disponíveis no momento da coleta |
| Swap | Ausente |
| Disco | 25 GiB; 15 GiB utilizados, 9 GiB livres (62%) |
| Uptime | 20 dias |
| Docker | 29.0.0; nove containers |
| Proxy | Caddy, encaminhando `estoque.cdc.org.br` para `localhost:8080` |
| Serviços com falha | Nenhum serviço systemd em estado failed |

O consumo instantâneo estava dentro da capacidade. Backend Frappe consumia cerca de 663 MiB, MariaDB 404 MiB e o conjunto completo aproximadamente 1,4 GiB. A ausência de swap reduz a margem de segurança para picos, migrações, relatórios e backups.

## Containers e operação

- Containers presentes: frontend, backend, websocket, scheduler, filas curta/longa, dois Redis e MariaDB.
- MariaDB está saudável; os outros containers não têm healthcheck Docker configurado.
- Frontend acumulou 22 reinicializações; websocket 21; filas curta e longa 20 cada. Não houve OOM registrado.
- Política de restart é `on-failure`; containers não usam filesystem somente leitura.
- Os containers montam volumes `assets` anônimos diferentes, além do volume compartilhado de sites. Isso deve ser revisado para evitar inconsistência de assets entre backend, frontend e workers.
- Há atualizações pendentes de Docker Engine, Compose, agentes Google e OS Login.

## Backup

- Backups recentes foram encontrados em `frontend/private/backups`.
- O backup mais recente, de 10/08/2026 às 15:00 UTC, contém banco compactado com aproximadamente 12,2 MB e configuração do site.
- Existem tarefas de backup executadas por root às 15:00 e 21:00 diariamente.
- Há cópias históricas adicionais em diretórios de usuários.

Ressalvas: a existência do arquivo não prova restauração. É necessário implementar teste periódico de restauração, retenção explícita, cópia fora da VM e monitoramento de falha do cron.

## Segurança

### Pontos positivos

- SSH aceita chave pública, rejeita senha e proíbe login de root.
- MariaDB e Redis não estão expostos diretamente na internet.
- Caddy fornece HTTPS e o domínio público passa por Cloudflare.
- Certificado público válido e TLS 1.2/1.3 disponíveis.
- HSTS, proteção contra framing e `nosniff` estão presentes no domínio.
- Serviços do laboratório local estão vinculados a `127.0.0.1`.

### Não conformidades e riscos

| Prioridade | Achado | Impacto | Recomendação |
|---|---|---|---|
| Alta | Porta `8080` do Frappe publicada em `0.0.0.0` e acessível pelo IP | Contorna Caddy/Cloudflare e expõe diretamente o origin | Remover o publish público ou vincular a `127.0.0.1:8080`; permitir entrada pública apenas por 80/443 |
| Alta | Não foi possível listar as regras do firewall GCP por falta de escopo da credencial da VM | Não há confirmação interna de restrição de origem/portas | Auditar firewall no projeto GCP e limitar 22 por IP/IAP; bloquear 8080 externamente |
| Alta | Containers críticos sem healthchecks; histórico de 20–22 restarts | Falhas podem passar despercebidas e gerar indisponibilidade | Adicionar healthchecks e alertas para restart count, filas, scheduler e websocket |
| Média | Sem swap em VM com 3,8 GiB | Pico de memória pode encerrar processos | Criar swap moderada ou aumentar capacidade, com monitoramento de memória |
| Média | Nome do site `frontend` diverge do domínio `estoque.cdc.org.br` | Diagnósticos e automações usam site inexistente | Padronizar o nome ou corrigir comandos/configuração de site padrão |
| Média | Volumes de assets não são claramente compartilhados entre todos os containers | Assets podem divergir entre processos | Revisar `pwd.yml` e usar volume de assets único e determinístico |
| Média | Atualizações de Docker e agentes estão pendentes | Correções de estabilidade e segurança não aplicadas | Planejar janela, backup e atualização controlada |
| Média | Backups não tiveram restauração comprovada | Backup possivelmente inutilizável só seria descoberto em incidente | Automatizar restore-test isolado e alertar por idade/tamanho/falha |
| Baixa | `X11Forwarding yes` no SSH sem necessidade aparente | Aumenta superfície de ataque | Desabilitar se não houver uso operacional |
| Baixa | Containers executam com root filesystem gravável | Persistência maior em caso de comprometimento | Aplicar hardening gradual: usuário não-root, read-only quando compatível, capabilities mínimas |

## Melhorias recomendadas por ordem

1. Fechar imediatamente a exposição pública de `8080`, mantendo Caddy como único caminho para o Frappe.
2. Revisar regras do firewall GCP e acesso SSH por IAP ou allowlist.
3. Corrigir site padrão/nome `frontend` e validar `bench doctor`, scheduler e workers com o site correto.
4. Investigar a causa histórica dos restarts e adicionar healthchecks/monitoramento.
5. Testar restauração do backup em ambiente isolado e configurar retenção externa.
6. Revisar volumes de assets para garantir compartilhamento consistente.
7. Planejar atualização de Docker, agentes Google e posteriormente ERPNext/Frappe com backup e homologação.
8. Adicionar swap ou política de capacidade e alarmes para memória, disco e contagem de reinícios.

## Escopo e preservação

Nenhum arquivo, container, banco, regra de firewall, configuração do Caddy ou serviço da GCP foi alterado. Nenhum deploy foi realizado. As conclusões representam o estado observado em 10/08/2026.
