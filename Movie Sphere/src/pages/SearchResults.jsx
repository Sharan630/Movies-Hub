import React from 'react';
import { useLocation } from 'react-router-dom';
import '../App.css';

const SearchResults = () => {
  const location = useLocation();
  const { results, query } = location.state || { results: [], query: '' };

  return (
    <div className="main-content">
      <div className="container">
        <h2 className="section-title">Search Results for "{query}"</h2>
        {results.length === 0 ? (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <p>No movies found. Try a different search.</p>
          </div>
        ) : (
          <div className="movies-grid">
            {results.map(movie => (
              <div key={movie.id} className="movie-card">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title}
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                  }}
                />
                <h3>{movie.title}</h3>
                <div className="movie-meta">
                  <span className="rating">
                    <i className="fas fa-star"></i> {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="year">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                </div>
                <p className="overview">{movie.overview}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;