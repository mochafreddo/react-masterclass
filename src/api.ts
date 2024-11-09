import type { MoviesResponse } from './types/api/movie';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function getMovies(): Promise<MoviesResponse> {
  const response = await fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<MoviesResponse>;
}
