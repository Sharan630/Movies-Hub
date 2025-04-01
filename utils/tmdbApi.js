const axios = require('axios');
const config = require('../config');

const tmdbApi = {
    // Get popular movies
    getPopularMovies: async (page = 1) => {
        try {
            const response = await axios.get(`${config.tmdbBaseUrl}/movie/popular`, {
                params: {
                    api_key: config.tmdbApiKey,
                    page: page
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching popular movies:', error);
            throw error;
        }
    },

    // Get movie details by ID
    getMovieDetails: async (movieId) => {
        try {
            const response = await axios.get(`${config.tmdbBaseUrl}/movie/${movieId}`, {
                params: {
                    api_key: config.tmdbApiKey
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching movie details:', error);
            throw error;
        }
    },

    // Search movies
    searchMovies: async (query, page = 1) => {
        try {
            const response = await axios.get(`${config.tmdbBaseUrl}/search/movie`, {
                params: {
                    api_key: config.tmdbApiKey,
                    query: query,
                    page: page
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching movies:', error);
            throw error;
        }
    },

    // Get movie credits
    getMovieCredits: async (movieId) => {
        try {
            const response = await axios.get(`${config.tmdbBaseUrl}/movie/${movieId}/credits`, {
                params: {
                    api_key: config.tmdbApiKey
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching movie credits:', error);
            throw error;
        }
    }
};

module.exports = tmdbApi; 