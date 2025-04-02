import React, { useState, useEffect, useRef, useCallback } from 'react';
import Hero from '../components/hero/Hero';
import Channels from '../components/channels/Channels';
import Genres from '../components/genres/Genres';
import MovieSkeleton from '../components/skeleton/MovieSkeleton';
import { getPopularMovies, getPopularShows, getMoviesByGenre, getMovieDetails, getShowDetails } from '../services/tmdbApi';
import '../App.css';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import FeaturedCarousel from '../components/FeaturedCarousel';
import TrendingSection from '../components/TrendingSection';
import QuickView from '../components/QuickView';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingShows, setTrendingShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [moviePage, setMoviePage] = useState(1);
  const [showPage, setShowPage] = useState(1);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [hasMoreShows, setHasMoreShows] = useState(true);
  const [loadingMoreMovies, setLoadingMoreMovies] = useState(false);
  const [loadingMoreShows, setLoadingMoreShows] = useState(false);
  const [genres] = useState([
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" }
  ]);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const loadMoreMoviesRef = useRef(null);
  const loadMoreShowsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialContent();
  }, []);

  const fetchInitialContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [moviesResponse, showsResponse] = await Promise.all([
        getPopularMovies(1),
        getPopularShows(1)
      ]);

      if (moviesResponse?.results) {
        setMovies(moviesResponse.results);
        setHasMoreMovies(moviesResponse.page < moviesResponse.total_pages);
        setFeaturedMovies(moviesResponse.results.slice(0, 5));
        setTrendingMovies(moviesResponse.results.slice(5, 15));
      }
      if (showsResponse?.results) {
        setShows(showsResponse.results);
        setHasMoreShows(showsResponse.page < showsResponse.total_pages);
        setTrendingShows(showsResponse.results.slice(0, 10));
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

  const handleGenreClick = async (genreId) => {
    try {
      if (selectedGenre === genreId) {
        setSelectedGenre(null);
        setMoviePage(1);
        return fetchInitialContent();
      }

      setLoading(true);
      setError(null);
      setSelectedGenre(genreId);
      setMoviePage(1);
      
      const response = await getMoviesByGenre(genreId, 1);
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

  const handleQuickView = async (item) => {
    try {
      const isMovie = !!item.title;
      
      let detailedItem;
      if (isMovie) {
        const details = await getMovieDetails(item.id);
        detailedItem = { ...details, media_type: 'movie' };
      } else {
        const details = await getShowDetails(item.id);
        detailedItem = { 
          ...details, 
          media_type: 'tv',
          title: details.name,
          release_date: details.first_air_date
        };
      }
      
      setQuickViewItem(detailedItem);
    } catch (error) {
      console.error('Error fetching item details:', error);
      setQuickViewItem({ 
        ...item, 
        media_type: item.title ? 'movie' : 'tv',
        title: item.title || item.name,
        release_date: item.release_date || item.first_air_date
      });
    }
  };

  const loadMoreMovies = useCallback(async () => {
    if (loadingMoreMovies || !hasMoreMovies) return;
    
    try {
      setLoadingMoreMovies(true);
      const nextPage = moviePage + 1;
      const response = selectedGenre 
        ? await getMoviesByGenre(selectedGenre, nextPage)
        : await getPopularMovies(nextPage);

      if (response?.results) {
        setMovies(prev => [...prev, ...response.results]);
        setMoviePage(nextPage);
        setHasMoreMovies(response.page < response.total_pages);
      }
    } catch (err) {
      console.error('Error loading more movies:', err);
    } finally {
      setLoadingMoreMovies(false);
    }
  }, [moviePage, selectedGenre, loadingMoreMovies, hasMoreMovies]);

  const loadMoreShows = useCallback(async () => {
    if (loadingMoreShows || !hasMoreShows) return;
    
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
    } finally {
      setLoadingMoreShows(false);
    }
  }, [showPage, loadingMoreShows, hasMoreShows]);

  useEffect(() => {
    const moviesObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreMovies && !loadingMoreMovies) {
          loadMoreMovies();
        }
      },
      { threshold: 0.1 }
    );

    const showsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreShows && !loadingMoreShows) {
          loadMoreShows();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreMoviesRef.current) {
      moviesObserver.observe(loadMoreMoviesRef.current);
    }
    if (loadMoreShowsRef.current) {
      showsObserver.observe(loadMoreShowsRef.current);
    }

    return () => {
      if (loadMoreMoviesRef.current) {
        moviesObserver.unobserve(loadMoreMoviesRef.current);
      }
      if (loadMoreShowsRef.current) {
        showsObserver.unobserve(loadMoreShowsRef.current);
      }
    };
  }, [loadMoreMovies, loadMoreShows, hasMoreMovies, hasMoreShows, loadingMoreMovies, loadingMoreShows]);

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
                className="movie-card fade-in"
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
          <div ref={loadMoreMoviesRef} className="load-more-trigger">
            {loadingMoreMovies && <MovieSkeleton />}
          </div>
        ) : (
          <div ref={loadMoreShowsRef} className="load-more-trigger">
            {loadingMoreShows && <MovieSkeleton />}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="home-container" style={{ width: '100vw', maxWidth: '100vw', overflow: 'hidden', backgroundColor: '#000' }}>
      {/* Featured Carousel Section - No margin/padding at the top now */}
      {featuredMovies && featuredMovies.length > 0 ? (
        <section className="section" style={{ width: '100vw', maxWidth: '100vw', padding: 0, margin: 0 }}>
          <FeaturedCarousel movies={featuredMovies} onQuickView={(movie) => setQuickViewItem({ ...movie, type: 'movie' })} />
        </section>
      ) : loading ? (
        <div className="carousel-skeleton"></div>
      ) : null}

      {/* Trending Sections */}
      {trendingMovies && trendingMovies.length > 0 ? (
        <section className="section" style={{ width: '100vw', maxWidth: '100vw', padding: 0, margin: '2rem 0 0 0' }}>
          <TrendingSection 
            title="Trending Movies" 
            items={trendingMovies} 
            type="movie" 
            onQuickView={(movie) => setQuickViewItem({ ...movie, type: 'movie' })} 
          />
        </section>
      ) : loading ? (
        <div className="section-skeleton"></div>
      ) : null}

      {trendingShows && trendingShows.length > 0 ? (
        <section className="section" style={{ width: '100vw', maxWidth: '100vw', padding: 0, margin: 0 }}>
          <TrendingSection 
            title="Trending TV Shows" 
            items={trendingShows} 
            type="tv" 
            onQuickView={(show) => setQuickViewItem({ ...show, type: 'tv' })} 
          />
        </section>
      ) : loading ? (
        <div className="section-skeleton"></div>
      ) : null}

      {/* Genres Section */}
      <section className="section" style={{ width: '100vw', maxWidth: '100vw', padding: '1rem 2rem', margin: 0 }}>
        <h2 className="section-title">Browse by Genre</h2>
        <div className="genres-container">
          {genres.map((genre) => (
            <button 
              key={genre.id} 
              className={`genre-button ${selectedGenre === genre.id ? 'active' : ''}`} 
              onClick={() => handleGenreClick(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </section>

      {/* Movies Section */}
      <section className="section" style={{ width: '100vw', maxWidth: '100vw', padding: '1rem 2rem', margin: 0 }}>
        <h2 className="section-title">Popular Movies</h2>
        {error ? (
          <div className="error-message">Something went wrong. Please try again later.</div>
        ) : (
          <>
            {movies.length > 0 ? (
              <div className="movies-grid">
                {movies.map((movie) => (
                  <div className="movie-card" key={movie.id} onClick={() => setQuickViewItem({ ...movie, type: 'movie' })}>
                    <img 
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.jpg'} 
                      alt={movie.title} 
                      className="movie-poster" 
                    />
                    <div className="movie-info">
                      <h3 className="movie-title">{movie.title}</h3>
                      <p className="movie-rating">
                        <span className="star-icon">⭐</span> 
                        {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : loading ? (
              // Skeleton UI for loading state
              <div className="movies-grid">
                {[...Array(8)].map((_, index) => (
                  <div className="movie-card skeleton" key={index}>
                    <div className="skeleton-poster"></div>
                    <div className="skeleton-info">
                      <div className="skeleton-title"></div>
                      <div className="skeleton-rating"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">No movies found</div>
            )}

            {/* Load More Button or Trigger for Movies */}
            {!loading && movies.length > 0 && (
              <div ref={loadMoreMoviesRef} className="load-more-trigger">
                {loadingMoreMovies && <div className="loading-spinner"></div>}
              </div>
            )}
          </>
        )}
      </section>

      {/* TV Shows Section */}
      <section className="section" style={{ width: '100vw', maxWidth: '100vw', padding: '1rem 2rem', margin: 0 }}>
        <h2 className="section-title">Popular TV Shows</h2>
        {error ? (
          <div className="error-message">Something went wrong. Please try again later.</div>
        ) : (
          <>
            {shows.length > 0 ? (
              <div className="shows-grid">
                {shows.map((show) => (
                  <div className="movie-card" key={show.id} onClick={() => setQuickViewItem({ ...show, type: 'tv' })}>
                    <img 
                      src={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '/placeholder.jpg'} 
                      alt={show.name} 
                      className="movie-poster" 
                    />
                    <div className="movie-info">
                      <h3 className="movie-title">{show.name}</h3>
                      <p className="movie-rating">
                        <span className="star-icon">⭐</span> 
                        {show.vote_average ? show.vote_average.toFixed(1) : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : loading ? (
              // Skeleton UI for loading state
              <div className="shows-grid">
                {[...Array(8)].map((_, index) => (
                  <div className="movie-card skeleton" key={index}>
                    <div className="skeleton-poster"></div>
                    <div className="skeleton-info">
                      <div className="skeleton-title"></div>
                      <div className="skeleton-rating"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">No TV shows found</div>
            )}

            {/* Load More Button or Trigger for Shows */}
            {!loading && shows.length > 0 && (
              <div ref={loadMoreShowsRef} className="load-more-trigger">
                {loadingMoreShows && <div className="loading-spinner"></div>}
              </div>
            )}
          </>
        )}
      </section>

      {/* Quick View Modal */}
      {quickViewItem && <QuickView item={quickViewItem} onClose={() => setQuickViewItem(null)} />}
    </div>
  );
};

export default Home; 