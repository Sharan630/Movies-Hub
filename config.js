require('dotenv').config();

const config = {
    tmdbApiKey: process.env.TMDB_API_KEY,
    tmdbBaseUrl: 'https://api.themoviedb.org/3',
    tmdbImageBaseUrl: 'https://image.tmdb.org/t/p'
};

module.exports = config; 