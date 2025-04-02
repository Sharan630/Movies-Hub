import React, { useRef } from 'react';
import './TrendingSection.css';

const TrendingSection = ({ title, items = [], onQuickView }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    
    const scrollAmount = direction * (container.clientWidth - 100);
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="trending-section">
      <div className="trending-header">
        <h2 className="trending-title">{title}</h2>
        <div className="trending-nav">
          <button 
            className="nav-button prev" 
            onClick={() => scroll(-1)}
            aria-label="Previous items"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button 
            className="nav-button next" 
            onClick={() => scroll(1)}
            aria-label="Next items"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      
      <div className="trending-items" ref={scrollRef}>
        {items.map(item => {
          if (!item?.poster_path) return null;
          
          return (
            <div 
              key={item.id} 
              className="trending-item"
              onClick={() => onQuickView && onQuickView(item)}
            >
              <div className="trending-poster">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                  alt={item.title || item.name}
                  loading="lazy"
                />
              </div>
              <div className="trending-info">
                <h3 className="trending-item-title">
                  {item.title || item.name}
                </h3>
                <div className="trending-meta">
                  <span className="trending-rating">
                    <i className="fas fa-star"></i>
                    {item.vote_average?.toFixed(1)}
                  </span>
                  <span className="trending-year">
                    {new Date(item.release_date || item.first_air_date).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingSection; 