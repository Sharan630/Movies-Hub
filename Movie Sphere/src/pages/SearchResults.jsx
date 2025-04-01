import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchMovies } from '../services/tmdbApi';
import '../App.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    if (!query) {
      navigate('/');
      return;
    }
    fetchResults();
  }, [query]);

  const fetchResults = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchMovies(query, pageNum);
      
      if (response?.results) {
        setResults(prev => pageNum === 1 ? response.results : [...prev, ...response.results]);
        setPage(pageNum);
        setHasMore(response.page < response.total_pages);
      }
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Failed to fetch search results. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore) return;
    
    try {
      setLoadingMore(true);
      await fetchResults(page + 1);
    } catch (err) {
      console.error('Error loading more results:', err);
      setError('Failed to load more results. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  };

  if (error) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="error-container">
            <div className="error">{error}</div>
            <button className="retry-button" onClick={() => fetchResults()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <h2 className="section-title">Search Results for "{query}"</h2>
        {loading ? (
          <div className="loading">Searching...</div>
        ) : results.length === 0 ? (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <p>No movies found. Try a different search.</p>
          </div>
        ) : (
          <>
            <div className="movies-grid">
              {results.map(movie => (
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

export default SearchResults;