import axios from "axios";

export default function apiData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

  const api = axios.create({
    // Todas as rotas REST do Express estão sob /api. A variável antiga
    // `baseUrlDomain` deixou de ser injetada pelo Next.js durante a migração,
    // fazendo o browser consultar o próprio frontend (ex.: /noticias).
    baseURL: `${apiUrl}/api`,
  });

  api.interceptors.request.use(config => {
    const isFormData = config.data instanceof FormData;

    if (!isFormData) {
      config.headers['Content-Type'] = 'application/json; charset=utf-8';
    }

    return config;
  });

  return api;
}
