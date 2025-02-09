const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

const moviesFilePath = path.join(__dirname, 'movies_data.json');

function readMoviesData() {
  try {
    const data = fs.readFileSync(moviesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading the JSON file:', err);
    throw new Error('Error reading the movies data');
  }
}

app.get('/', (req, res) => {
  res.send('Welcome to the Movie API!');
});

app.get('/movies', (req, res) => {
  try {
    const movies = readMoviesData();
    res.send(movies);
  } catch (err) {
    res.status(500).send({ error: 'Failed to read movie data' });
  }
});

app.get('/movies/:id', (req, res) => {
  const movieId = parseInt(req.params.id, 10);

  if (isNaN(movieId)) {
    return res.status(400).send({ error: 'Invalid movie ID' });
  }

  try {
    const movies = readMoviesData();
    const movie = movies.find(m => m.id === movieId);

    if (movie) {
      res.send(movie);
    } else {
      res.status(404).send({ error: 'Movie not found' });
    }
  } catch (err) {
    res.status(500).send({ error: 'Failed to read movie data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
