// frontend/src/lib/tmdb.ts
const BASE = 'https://api.themoviedb.org/3';

type TMDB = {
  id: number; title?: string; name?: string; overview?: string;
  release_date?: string; first_air_date?: string;
  poster_path?: string | null; backdrop_path?: string | null;
};

export type Item = {
  id: number; title: string; overview?: string; date?: string;
  poster?: string; backdrop?: string;
};

const IMG = process.env.TMDB_IMAGE_BASE ?? 'https://image.tmdb.org/t/p';
const API_KEY = process.env.TMDB_API_KEY;   // v3 (opcional)
const BEARER  = process.env.TMDB_BEARER;    // v4 (opcional)

const toItem = (x: TMDB): Item => ({
  id: x.id,
  title: x.title || x.name || 'Sin título',
  overview: x.overview,
  date: x.release_date || x.first_air_date,
  poster: x.poster_path ? `${IMG}/w500${x.poster_path}` : undefined,
  backdrop: x.backdrop_path ? `${IMG}/w1280${x.backdrop_path}` : undefined,
});

function buildUrl(path: string, params: Record<string, string | number> = {}) {
  const url = new URL(BASE + path);
  url.searchParams.set('language', 'es-ES');
  url.searchParams.set('include_adult', 'false');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  if (API_KEY && !BEARER) url.searchParams.set('api_key', API_KEY);
  return url;
}

async function tmdb(path: string, params: Record<string, string | number> = {}) {
  // Sin credenciales → short-circuit (no tira error)
  if (!API_KEY && !BEARER) return { results: [] };

  try {
    const url = buildUrl(path, params);
    const headers = BEARER
      ? { accept: 'application/json', Authorization: `Bearer ${BEARER}` }
      : undefined;

    const res = await fetch(url.toString(), { cache: 'no-store', headers });
    if (!res.ok) return { results: [] }; // 401/404/etc → devolvemos vacío
    return res.json();
  } catch {
    return { results: [] };
  }
}

export async function getTrending() {
  const data = await tmdb('/trending/all/week');
  return (data.results as TMDB[] ?? []).map(toItem);
}

export async function getByGenre(genreId: number) {
  const data = await tmdb('/discover/movie', { with_genres: genreId, sort_by: 'popularity.desc', page: 1 });
  return (data.results as TMDB[] ?? []).map(toItem);
}
