import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getShowDetails, getMovieCredits, getShowCredits, getMovieTrailers, getShowTrailers } from '../../services/tmdbApi';
import './Details.css';

const Details = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDetails();
    window.scrollTo(0, 0);
  }, [id, type]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [detailsResponse, creditsResponse, trailersResponse] = await Promise.all([
        type === 'movie' ? getMovieDetails(id) : getShowDetails(id),
        type === 'movie' ? getMovieCredits(id) : getShowCredits(id),
        type === 'movie' ? getMovieTrailers(id) : getShowTrailers(id)
      ]);

      setDetails(detailsResponse);
      setCredits(creditsResponse);
      setTrailers(trailersResponse?.results || []);
    } catch (err) {
      console.error('Error fetching details:', err);
      setError('Failed to fetch details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button className="retry-button" onClick={fetchDetails}>Try Again</button>
      </div>
    );
  }

  if (!details) {
    return <div className="no-results">No details found</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="details-page">
      <div className="details-header">
        {details.backdrop_path && (
          <img 
            className="backdrop-image"
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt={details.title || details.name}
          />
        )}
        <div className="backdrop-overlay"></div>
        
        <button className="back-button" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        
        <div className="header-content">
          <div className="poster-container">
            <img 
              src={details.poster_path 
                ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                : '/placeholder.jpg'
              }
              alt={details.title || details.name}
              onError={(e) => {
                e.target.src = '/placeholder.jpg';
              }}
            />
          </div>
          <div className="header-info">
            <h1>{details.title || details.name}</h1>
            <div className="meta-info">
              <span className="rating">
                <i className="fas fa-star"></i>{details.vote_average?.toFixed(1) || 'N/A'}
              </span>
              <span className="year">
                {formatDate(type === 'movie' ? details.release_date : details.first_air_date)}
              </span>
              {type === 'movie' && (
                <span className="runtime">
                  {formatRuntime(details.runtime)}
                </span>
              )}
              {type === 'tv' && details.number_of_seasons && (
                <span className="runtime">
                  {details.number_of_seasons} Season{details.number_of_seasons !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="genres">
              {details.genres?.map(genre => (
                <span key={genre.id} className="genre-tag">{genre.name}</span>
              ))}
            </div>
            {details.tagline && (
              <p className="tagline">"{details.tagline}"</p>
            )}
          </div>
        </div>
      </div>

      <div className="details-content">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-info-circle"></i> Overview
          </button>
          <button 
            className={`tab ${activeTab === 'cast' ? 'active' : ''}`}
            onClick={() => setActiveTab('cast')}
          >
            <i className="fas fa-users"></i> Cast & Crew
          </button>
          {trailers.length > 0 && (
            <button 
              className={`tab ${activeTab === 'trailers' ? 'active' : ''}`}
              onClick={() => setActiveTab('trailers')}
            >
              <i className="fas fa-film"></i> Trailers
            </button>
          )}
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview">
              <div className="overview-content">
                <h2>Overview</h2>
                <p>{details.overview || "No overview available for this title."}</p>
                <div className="additional-info">
                  <div className="info-section">
                    <h3>Status</h3>
                    <p>{details.status || 'N/A'}</p>
                  </div>
                  {type === 'movie' && (
                    <>
                      <div className="info-section">
                        <h3>Release Date</h3>
                        <p>{formatFullDate(details.release_date)}</p>
                      </div>
                      <div className="info-section">
                        <h3>Budget</h3>
                        <p>{details.budget > 0 ? `$${details.budget?.toLocaleString()}` : 'N/A'}</p>
                      </div>
                      <div className="info-section">
                        <h3>Revenue</h3>
                        <p>{details.revenue > 0 ? `$${details.revenue?.toLocaleString()}` : 'N/A'}</p>
                      </div>
                    </>
                  )}
                  {type === 'tv' && (
                    <>
                      <div className="info-section">
                        <h3>First Air Date</h3>
                        <p>{formatFullDate(details.first_air_date)}</p>
                      </div>
                      <div className="info-section">
                        <h3>Episodes</h3>
                        <p>{details.number_of_episodes || 'N/A'}</p>
                      </div>
                      <div className="info-section">
                        <h3>Seasons</h3>
                        <p>{details.number_of_seasons || 'N/A'}</p>
                      </div>
                    </>
                  )}
                  <div className="info-section">
                    <h3>Production Companies</h3>
                    <p>{details.production_companies?.map(company => company.name).join(', ') || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cast' && (
            <div className="cast">
              <h2>Cast</h2>
              {credits?.cast?.length > 0 ? (
                <div className="cast-grid">
                  {credits.cast.slice(0, 12).map(person => (
                    <div key={person.id} className="cast-member">
                      <img 
                        src={person.profile_path 
                          ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                          : '/placeholder.jpg'
                        }
                        alt={person.name}
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg';
                        }}
                      />
                      <div className="cast-info">
                        <h3>{person.name}</h3>
                        <p>{person.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-results">No cast information available.</p>
              )}
            </div>
          )}

          {activeTab === 'trailers' && (
            <div className="trailers">
              <h2>Trailers & Videos</h2>
              {trailers.length > 0 ? (
                <div className="trailer-grid">
                  {trailers.map(trailer => (
                    <div key={trailer.id} className="trailer-item">
                      <iframe
                        src={`https://www.youtube.com/embed/${trailer.key}`}
                        title={trailer.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                      <h3>{trailer.name}</h3>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-results">No trailers available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details; 