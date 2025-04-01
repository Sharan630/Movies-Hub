import React, { useState, useEffect } from 'react';
import { getPopularMovies, getMoviesByGenre } from '../services/tmdbApi';
import Genres from '../components/genres/Genres';
import { useNavigate } from 'react-router-dom';
import './Movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();

  const genres = [
    { id: 28, name: 'Action', icon: 'fa-fire' },
    { id: 12, name: 'Adventure', icon: 'fa-mountain' },
    { id: 16, name: 'Animation', icon: 'fa-film' },
    { id: 35, name: 'Comedy', icon: 'fa-laugh' },
    { id: 80, name: 'Crime', icon: 'fa-gavel' },
    { id: 99, name: 'Documentary', icon: 'fa-camera' },
    { id: 18, name: 'Drama', icon: 'fa-theater-masks' },
    { id: 10751, name: 'Family', icon: 'fa-home' },
    { id: 14, name: 'Fantasy', icon: 'fa-dragon' },
    { id: 27, name: 'Horror', icon: 'fa-ghost' },
    { id: 9648, name: 'Mystery', icon: 'fa-question-circle' },
    { id: 10749, name: 'Romance', icon: 'fa-heart' },
    { id: 878, name: 'Science Fiction', icon: 'fa-robot' },
    { id: 53, name: 'Thriller', icon: 'fa-skull' }
  ];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async (genreId = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = genreId 
        ? await getMoviesByGenre(genreId, 1)
        : await getPopularMovies(1);

      if (response?.results) {
        setMovies(response.results);
        setPage(1);
        setHasMore(response.page < response.total_pages);
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to fetch movies. Please try again.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreSelect = async (genre) => {
    if (selectedGenre?.id === genre.id) {
      setSelectedGenre(null);
      return fetchMovies();
    }
    setSelectedGenre(genre);
    await fetchMovies(genre.id);
  };

  const loadMore = async () => {
    if (loadingMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = selectedGenre 
        ? await getMoviesByGenre(selectedGenre.id, nextPage)
        : await getPopularMovies(nextPage);

      if (response?.results) {
        setMovies(prev => [...prev, ...response.results]);
        setPage(nextPage);
        setHasMore(response.page < response.total_pages);
      }
    } catch (err) {
      console.error('Error loading more movies:', err);
      setError('Failed to load more movies. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button className="retry-button" onClick={() => fetchMovies()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="movies-page">
      <div className="genres-carousel">
        <Genres onGenreSelect={handleGenreSelect} selectedGenre={selectedGenre} />
      </div>

      <div className="movies-section">
        <h2 className="section-title">
          {selectedGenre ? `${selectedGenre.name} Movies` : 'Popular Movies'}
        </h2>
        
        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : (
          <>
            <div className="movies-grid">
              {movies.map(movie => (
                <div 
                  key={movie.id} 
                  className="movie-card"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <p className="movie-description">{movie.overview}</p>
                    <div className="movie-meta">
                      <span className="rating">
                        <i className="fas fa-star"></i> {movie.vote_average?.toFixed(1) || 'N/A'}
                      </span>
                      <span className="year">
                        {movie.release_date && new Date(movie.release_date).getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="load-more-container">
                <button 
                  className="load-more-button"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Movies; 