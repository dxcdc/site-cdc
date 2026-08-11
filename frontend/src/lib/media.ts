/**
 * media.ts — Resolução centralizada de URLs de mídia
 *
 * Regras:
 *  - URLs absolutas (http/https) são retornadas sem modificação.
 *  - Caminhos relativos são prefixados com NEXT_PUBLIC_API_URL + "/uploads/".
 *  - Caminhos nulos/vazios retornam null.
 *
 * Formato esperado no banco:
 *   "banners/18-IMG_7339_(1).jpg"
 *   "noticias/100-IMG_0711.jpg"
 *   "parceiros/6-logo_(3)_(1).png"
 *
 * URL gerada:
 *   "http://localhost:5001/uploads/banners/18-IMG_7339_(1).jpg"
 *   "https://super.cdc.org.br/uploads/noticias/100-IMG_0711.jpg"
 */

const API_URL =
  (typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL      // Server-side
    : process.env.NEXT_PUBLIC_API_URL)     // Client-side (embutido no build)
  ?? '';

/**
 * Resolve um caminho de mídia para uma URL pública acessível pelo navegador.
 *
 * @param path - Caminho relativo do arquivo (ex: "banners/foto.jpg"),
 *               URL absoluta (ex: "https://storage.googleapis.com/..."),
 *               ou null/undefined.
 * @returns URL completa ou null se o caminho for vazio/nulo.
 */
export function resolveMediaUrl(path?: string | null): string | null {
  if (!path) return null;

  // URL absoluta: retorna sem alteração (compatibilidade com legado GCS)
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Remove barra inicial para evitar dupla barra: /uploads//banners/...
  const cleanPath = path.replace(/^\//, '');

  // Remove prefixo "uploads/" se já estiver presente para evitar duplicação
  const normalizedPath = cleanPath.replace(/^uploads\//, '');

  return `${API_URL}/uploads/${normalizedPath}`;
}

/**
 * Retorna a URL da mídia ou uma URL de fallback se o caminho for inválido.
 */
export function resolveMediaUrlOrFallback(
  path?: string | null,
  fallback = '/media-placeholder.svg'
): string {
  return resolveMediaUrl(path) ?? fallback;
}
