export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const BACKDROP_SIZE = 'original';
export const POSTER_SIZE = 'w500';

// Validate API key
if (!API_KEY) {
    console.error('TMDB API key is missing. Please add VITE_TMDB_API_KEY to your .env file.');
}

// Export default configuration
export default {
    API_KEY,
    BASE_URL,
    IMAGE_BASE_URL,
    BACKDROP_SIZE,
    POSTER_SIZE
}; 