import React, { useState, useEffect } from 'react';
import { getMovieGenres } from '../../services/tmdbApi';
import './Genres.css';

const Genres = ({ onGenreSelect, selectedGenre }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const response = await getMovieGenres();
      if (response?.genres) {
        const genresWithIcons = response.genres.map(genre => ({
          ...genre,
          icon: getGenreIcon(genre.name)
        }));
        setGenres(genresWithIcons);
      }
    } catch (err) {
      console.error('Error fetching genres:', err);
      setError('Failed to load genres');
    } finally {
      setLoading(false);
    }
  };

  const getGenreIcon = (genreName) => {
    const icons = {
      'Action': 'fa-explosion',
      'Adventure': 'fa-compass',
      'Animation': 'fa-child',
      'Comedy': 'fa-face-laugh',
      'Crime': 'fa-handcuffs',
      'Documentary': 'fa-file-video',
      'Drama': 'fa-masks-theater',
      'Family': 'fa-users',
      'Fantasy': 'fa-dragon',
      'History': 'fa-landmark',
      'Horror': 'fa-ghost',
      'Music': 'fa-music',
      'Mystery': 'fa-question',
      'Romance': 'fa-heart',
      'Science Fiction': 'fa-robot',
      'TV Movie': 'fa-tv',
      'Thriller': 'fa-skull',
      'War': 'fa-shield',
      'Western': 'fa-hat-cowboy'
    };
    return icons[genreName] || 'fa-film';
  };

  if (loading) {
    return <div className="genres-loading">Loading genres...</div>;
  }

  if (error) {
    return <div className="genres-error">{error}</div>;
  }

  return (
    <div className="genres-container">
      <h2 className="genres-title">Movie Genres</h2>
      <div className="genres-list">
        {genres.map(genre => (
          <div
            key={genre.id}
            className={`genre-card ${selectedGenre?.id === genre.id ? 'active' : ''}`}
            onClick={() => onGenreSelect(genre)}
          >
            <div className="genre-content">
              <i className={`fas ${genre.icon}`}></i>
              <span className="genre-name">{genre.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Genres; 