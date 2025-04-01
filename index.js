const express = require('express');
const tmdbApi = require('./utils/tmdbApi');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Get popular movies
app.get('/api/movies/popular', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const movies = await tmdbApi.getPopularMovies(page);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search movies
app.get('/api/movies/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const results = await tmdbApi.searchMovies(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get movie details
app.get('/api/movies/:id', async (req, res) => {
    try {
        const movieId = req.params.id;
        const details = await tmdbApi.getMovieDetails(movieId);
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get movie credits
app.get('/api/movies/:id/credits', async (req, res) => {
    try {
        const movieId = req.params.id;
        const credits = await tmdbApi.getMovieCredits(movieId);
        res.json(credits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 