import React, { useState, useEffect } from 'react';
import { getPopularShows, getTVShowsByGenre } from '../services/tmdbApi';
import Genres from '../components/genres/Genres';
import { useNavigate } from 'react-router-dom';
import './TVShows.css';

const TVShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async (genreId = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = genreId 
        ? await getTVShowsByGenre(genreId, 1)
        : await getPopularShows(1);

      if (response?.results) {
        setShows(response.results);
        setPage(1);
        setHasMore(response.page < response.total_pages);
      }
    } catch (err) {
      console.error('Error fetching TV shows:', err);
      setError('Failed to fetch TV shows. Please try again.');
      setShows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreSelect = async (genre) => {
    if (selectedGenre?.id === genre.id) {
      setSelectedGenre(null);
      return fetchShows();
    }
    setSelectedGenre(genre);
    await fetchShows(genre.id);
  };

  const loadMore = async () => {
    if (loadingMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = selectedGenre 
        ? await getTVShowsByGenre(selectedGenre.id, nextPage)
        : await getPopularShows(nextPage);

      if (response?.results) {
        setShows(prev => [...prev, ...response.results]);
        setPage(nextPage);
        setHasMore(response.page < response.total_pages);
      }
    } catch (err) {
      console.error('Error loading more shows:', err);
      setError('Failed to load more shows. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button className="retry-button" onClick={() => fetchShows()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="shows-page">
      <div className="genres-carousel">
        <Genres onGenreSelect={handleGenreSelect} selectedGenre={selectedGenre} />
      </div>

      <div className="shows-section">
        <h2 className="section-title">
          {selectedGenre ? `${selectedGenre.name} TV Shows` : 'Popular TV Shows'}
        </h2>
        
        {loading ? (
          <div className="loading">Loading TV shows...</div>
        ) : (
          <>
            <div className="shows-grid">
              {shows.map(show => (
                <div 
                  key={show.id} 
                  className="show-card"
                  onClick={() => navigate(`/tv/${show.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                  <div className="show-info">
                    <h3 className="show-title">{show.name}</h3>
                    <p className="show-description">{show.overview}</p>
                    <div className="show-meta">
                      <span className="rating">
                        <i className="fas fa-star"></i> {show.vote_average?.toFixed(1) || 'N/A'}
                      </span>
                      <span className="year">
                        {show.first_air_date && new Date(show.first_air_date).getFullYear()}
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

export default TVShows; 