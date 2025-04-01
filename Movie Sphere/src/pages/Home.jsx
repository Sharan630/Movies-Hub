import React, { useState, useEffect } from 'react';
import Hero from '../components/hero/Hero';
import Channels from '../components/channels/Channels';
import Genres from '../components/genres/Genres';
import { getPopularMovies, getPopularShows, getMoviesByGenre } from '../services/tmdbApi';
import '../App.css';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [moviePage, setMoviePage] = useState(1);
  const [showPage, setShowPage] = useState(1);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [hasMoreShows, setHasMoreShows] = useState(true);
  const [loadingMoreMovies, setLoadingMoreMovies] = useState(false);
  const [loadingMoreShows, setLoadingMoreShows] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Fetching initial content...');
    fetchInitialContent();
  }, []);

  const fetchInitialContent = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Making API calls...');
      
      const [moviesResponse, showsResponse] = await Promise.all([
        getPopularMovies(1),
        getPopularShows(1)
      ]);

      console.log('Movies response:', moviesResponse);
      console.log('Shows response:', showsResponse);

      if (moviesResponse?.results) {
        setMovies(moviesResponse.results);
        setHasMoreMovies(moviesResponse.page < moviesResponse.total_pages);
      }
      if (showsResponse?.results) {
        setShows(showsResponse.results);
        setHasMoreShows(showsResponse.page < showsResponse.total_pages);
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to fetch content. Please check your API key and try again.');
      setMovies([]);
      setShows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreClick = async (genre) => {
    try {
      if (selectedGenre?.id === genre.id) {
        setSelectedGenre(null);
        setMoviePage(1);
        return fetchInitialContent();
      }

      setLoading(true);
      setError(null);
      setSelectedGenre(genre);
      setMoviePage(1);
      
      const response = await getMoviesByGenre(genre.id, 1);
      if (response?.results) {
        setMovies(response.results);
        setHasMoreMovies(response.page < response.total_pages);
      }
    } catch (err) {
      console.error('Error fetching genre movies:', err);
      setError('Failed to fetch movies for this genre. Please try again.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMovies = async () => {
    if (loadingMoreMovies) return;
    
    try {
      setLoadingMoreMovies(true);
      const nextPage = moviePage + 1;
      const response = selectedGenre 
        ? await getMoviesByGenre(selectedGenre.id, nextPage)
        : await getPopularMovies(nextPage);

      if (response?.results) {
        setMovies(prev => [...prev, ...response.results]);
        setMoviePage(nextPage);
        setHasMoreMovies(response.page < response.total_pages);
      }
    } catch (err) {
      console.error('Error loading more movies:', err);
      setError('Failed to load more movies. Please try again.');
    } finally {
      setLoadingMoreMovies(false);
    }
  };

  const loadMoreShows = async () => {
    if (loadingMoreShows) return;
    
    try {
      setLoadingMoreShows(true);
      const nextPage = showPage + 1;
      const response = await getPopularShows(nextPage);

      if (response?.results) {
        setShows(prev => [...prev, ...response.results]);
        setShowPage(nextPage);
        setHasMoreShows(response.page < response.total_pages);
      }
    } catch (err) {
      console.error('Error loading more shows:', err);
      setError('Failed to load more shows. Please try again.');
    } finally {
      setLoadingMoreShows(false);
    }
  };

  const renderContent = (items, type) => {
    if (items.length === 0) {
      return <div className="no-results">No {type === 'movie' ? 'movies' : 'TV shows'} found</div>;
    }

    return (
      <>
        <div className="movies-grid">
          {items.map(item => {
            if (!item?.poster_path) return null;
            
            return (
              <div 
                key={item.id} 
                className="movie-card"
                onClick={() => navigate(`/${type}/${item.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                  alt={item.title || item.name}
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                  }}
                />
                <div className="movie-info">
                  <h3 className="movie-title">{item.title || item.name}</h3>
                  <p className="movie-description">{item.overview}</p>
                  <div className="movie-meta">
                    <span className="rating">
                      <i className="fas fa-star"></i> {item.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="year">
                      {(item.release_date || item.first_air_date) && 
                        new Date(item.release_date || item.first_air_date).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {type === 'movie' ? (
          hasMoreMovies && (
            <div className="load-more-container">
              <button 
                className="load-more-button"
                onClick={loadMoreMovies}
                disabled={loadingMoreMovies}
              >
                {loadingMoreMovies ? 'Loading...' : 'Load More Movies'}
              </button>
            </div>
          )
        ) : (
          hasMoreShows && (
            <div className="load-more-container">
              <button 
                className="load-more-button"
                onClick={loadMoreShows}
                disabled={loadingMoreShows}
              >
                {loadingMoreShows ? 'Loading...' : 'Load More Shows'}
              </button>
            </div>
          )
        )}
      </>
    );
  };

  if (error) {
    return (
      <div className="main-content">
        <Hero />
        <div className="container">
          <Channels />
          <div className="error-container">
            <div className="error">{error}</div>
            <button className="retry-button" onClick={fetchInitialContent}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <Hero />
      <div className="container">
        <Channels />
        
        <div className="genres-section">
          <Genres onGenreSelect={handleGenreClick} selectedGenre={selectedGenre} />
        </div>

        <section className="movies-section">
          <h2 className="section-title">
            {selectedGenre ? `${selectedGenre.name} Movies` : 'Popular Movies'}
          </h2>
          {loading ? (
            <div className="loading">Loading movies...</div>
          ) : (
            renderContent(movies, 'movie')
          )}
        </section>

        <section className="shows-section">
          <h2 className="section-title">Popular TV Shows</h2>
          {loading ? (
            <div className="loading">Loading TV shows...</div>
          ) : (
            renderContent(shows, 'tv')
          )}
        </section>
      </div>
    </div>
  );
};

export default Home; 