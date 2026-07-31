/**
 * next.config.js
 *
 * Configuração do Next.js para o frontend do site-cdc.
 *
 * remotePatterns: permite que o componente <Image /> carregue imagens de origens externas.
 * Necessário para imagens do backend Express (/uploads) e do legado GCS.
 *
 * ATENÇÃO: NEXT_PUBLIC_* são lidas no momento do build, não em runtime.
 * Quaisquer alterações exigem rebuild do container.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,

  images: {
    // No laboratório, NEXT_PUBLIC_API_URL aponta para localhost:5001, que é
    // acessível pelo navegador, mas não pelo container do Next (onde localhost
    // seria o próprio frontend). Sirva a mídia diretamente para evitar 500 no
    // otimizador server-side e preservar os arquivos originais da migração.
    unoptimized: true,
    remotePatterns: [
      // Backend Express (desenvolvimento local)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/uploads/**',
      },
      // Backend Express sem porta específica (proxies, produção)
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      // Legado: Google Cloud Storage (imagens antigas ainda referenciadas pelo banco)
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/cdc-site/**',
      },
      // Produção: domínio público da API (ajustar conforme o ambiente)
      // Exemplo: api.ongcdc.org.br ou IP do servidor
      {
        protocol: 'https',
        hostname: '**.ongcdc.org.br',
      },
    ],
  },
};

module.exports = nextConfig;
