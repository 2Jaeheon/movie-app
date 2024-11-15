const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

if (!API_KEY) {
    throw new Error('Missing TMDB API Key!');
}

export const BASE_URL = 'https://api.themoviedb.org/3';
export const API_PARAMS = `?api_key=${API_KEY}`;