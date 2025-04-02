import React from 'react';
import { Link } from 'react-router-dom';
import WatchlistButton from './WatchlistButton';
import './QuickView.css';

const QuickView = ({ item, onClose }) => {
  if (!item) return null;
  
  const isMovie = item.media_type === 'movie' || !!item.title;
  const title = item.title || item.name || '';
  const releaseDate = item.release_date || item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
  const posterPath = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder.jpg';
  
  return (
    <div className="quick-view" onClick={onClose}>
      <div className="quick-view-content" onClick={e => e.stopPropagation()}>
        <div className="quick-view-header">
          <h3 className="quick-view-title">{title}</h3>
          <button className="close-button" onClick={onClose} aria-label="Close quick view">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="quick-view-body">
          <div className="quick-view-image">
            <img 
              src={posterPath}
              alt={title}
              loading="lazy"
              onError={(e) => {
                e.target.src = '/placeholder.jpg';
              }}
            />
          </div>

          <div className="quick-view-info">
            <div className="quick-view-meta">
              <span className="quick-view-rating">
                <i className="fas fa-star"></i> {rating}
              </span>
              <span className="quick-view-year">
                {year}
              </span>
              <span className="quick-view-type">
                {isMovie ? 'Movie' : 'TV Show'}
              </span>
            </div>

            <p className="quick-view-description">
              {item.overview || 'No description available.'}
            </p>

            <div className="quick-view-actions">
              <Link 
                to={`/${isMovie ? 'movie' : 'tv'}/${item.id}`} 
                className="quick-view-button primary"
              >
                View Details
                <i className="fas fa-arrow-right"></i>
              </Link>
              <WatchlistButton item={item} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView; 