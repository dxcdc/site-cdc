/**
 * @deprecated Use `resolveMediaUrl` de `@/lib/media` em vez disso.
 *
 * Esta constante foi mantida para compatibilidade enquanto a migração
 * para `resolveMediaUrl` é concluída. Não utilize em código novo.
 *
 * Problema original: NEXT_PUBLIC_STORAGE ora era "/assets" (dev local),
 * ora era "http://localhost:5000/uploads" (Docker), causando inconsistência.
 * A variável NEXT_PUBLIC_STORAGE foi removida do projeto.
 */
export const storageUrl = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/uploads`
  : '';