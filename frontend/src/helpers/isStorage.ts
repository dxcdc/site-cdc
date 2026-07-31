import { resolveMediaUrl } from '@/lib/media';

/**
 * @deprecated Use `resolveMediaUrl` de `@/lib/media` diretamente.
 *
 * Mantido por compatibilidade com componentes que ainda usam isStorage().
 * Delega a lógica para resolveMediaUrl para garantir comportamento consistente.
 */
export const isStorage = (url?: string | null): string => {
  return resolveMediaUrl(url) ?? '';
};
