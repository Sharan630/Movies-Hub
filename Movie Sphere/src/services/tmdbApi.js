import { API_KEY, BASE_URL } from '../config';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'An error occurred while fetching data');
    }
    const data = await response.json();
    
    if (!data) {
        throw new Error('No data received from the server');
    }
    
    return data;
};

// Movie APIs
export const getMovieGenres = async () => {
    const response = await fetch(
        `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );
    return handleResponse(response);
};

export const getPopularMovies = async (page = 1) => {
    const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`,
        {
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    return handleResponse(response);
};

export const getTopRatedMovies = async (page = 1) => {
    const response = await fetch(
        `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`
    );
    return handleResponse(response);
};

export const getUpcomingMovies = async (page = 1) => {
    const response = await fetch(
        `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`
    );
    return handleResponse(response);
};

export const getMovieDetails = async (movieId) => {
    if (!movieId) {
        throw new Error('Movie ID is required');
    }
    const response = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
    );
    return handleResponse(response);
};

export const searchMovies = async (query, page = 1) => {
    if (!query) {
        throw new Error('Search query is required');
    }
    const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`
    );
    return handleResponse(response);
};

export const getMoviesByGenre = async (genreId, page = 1) => {
    const response = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`
    );
    return handleResponse(response);
};

// TV Show APIs
export const getTVGenres = async () => {
    const response = await fetch(
        `${BASE_URL}/genre/tv/list?api_key=${API_KEY}`
    );
    return handleResponse(response);
};

export const getPopularShows = async (page = 1) => {
    const response = await fetch(
        `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`,
        {
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    return handleResponse(response);
};

export const getTopRatedShows = async (page = 1) => {
    const response = await fetch(
        `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&page=${page}`
    );
    return handleResponse(response);
};

export const getShowDetails = async (showId) => {
    const response = await fetch(
        `${BASE_URL}/tv/${showId}?api_key=${API_KEY}`
    );
    return handleResponse(response);
};

export const searchShows = async (query, page = 1) => {
    const response = await fetch(
        `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    return handleResponse(response);
};

export const getShowCredits = async (showId) => {
    const response = await fetch(
        `${BASE_URL}/tv/${showId}/credits?api_key=${API_KEY}`
    );
    return handleResponse(response);
};

export const getShowTrailers = async (showId) => {
    const response = await fetch(
        `${BASE_URL}/tv/${showId}/videos?api_key=${API_KEY}`
    );
    return handleResponse(response);
};

export const getSimilarShows = async (showId, page = 1) => {
    const response = await fetch(
        `${BASE_URL}/tv/${showId}/similar?api_key=${API_KEY}&page=${page}`
    );
    return handleResponse(response);
};

export const getShowReviews = async (showId, page = 1) => {
    const response = await fetch(
        `${BASE_URL}/tv/${showId}/reviews?api_key=${API_KEY}&page=${page}`
    );
    return handleResponse(response);
};

export const getImageUrl = (path) => {
    return `https://image.tmdb.org/t/p/w500${path}`;
};

// Get movie credits
export const getMovieCredits = async (movieId) => {
    const response = await fetch(
        `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
    );
    return handleResponse(response);
};

// Get movie trailers
export const getMovieTrailers = async (movieId) => {
    const response = await fetch(
        `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
    );
    return handleResponse(response);
};

// Get similar movies
export const getSimilarMovies = async (movieId) => {
    const response = await fetch(
        `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`
    );
    return handleResponse(response);
};

// Get movie reviews
export const getMovieReviews = async (movieId) => {
    const response = await fetch(
        `${BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}`
    );
    return handleResponse(response);
};

export const getTVShowsByGenre = async (genreId, page = 1) => {
    const response = await fetch(
        `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`
    );
    return handleResponse(response);
}; 