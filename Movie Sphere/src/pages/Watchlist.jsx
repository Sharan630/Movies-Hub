import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WatchlistButton from '../components/WatchlistButton';
import './Watchlist.css';

const Watchlist = () => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load watchlist items from localStorage
    const loadWatchlist = () => {
      setLoading(true);
      try {
        const storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        setWatchlistItems(storedWatchlist);
      } catch (error) {
        console.error('Error loading watchlist:', error);
        setWatchlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadWatchlist();
    
    // Add event listener for storage changes (in case watchlist is updated in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'watchlist') {
        loadWatchlist();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleItemClick = (item) => {
    // Navigate to the appropriate details page based on item type
    const itemType = item.media_type || (item.title ? 'movie' : 'tv');
    navigate(`/${itemType}/${item.id}`);
  };

  const handleRemoveFromWatchlist = (item, e) => {
    e.stopPropagation(); // Prevent triggering the handleItemClick
    const newWatchlist = watchlistItems.filter(watchlistItem => watchlistItem.id !== item.id);
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    setWatchlistItems(newWatchlist);
  };

  if (loading) {
    return (
      <div className="watchlist-page">
        <div className="container">
          <h1 className="page-title">My Watchlist</h1>
          <div className="loading">Loading your watchlist...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-page">
      <div className="container">
        <h1 className="page-title">My Watchlist</h1>
        
        {watchlistItems.length === 0 ? (
          <div className="empty-watchlist">
            <i className="fas fa-list"></i>
            <h2>Your watchlist is empty</h2>
            <p>Add movies and TV shows to keep track of what you want to watch.</p>
            <button 
              className="browse-button"
              onClick={() => navigate('/')}
            >
              Browse Movies & Shows
            </button>
          </div>
        ) : (
          <>
            <div className="watchlist-grid">
              {watchlistItems.map(item => (
                <div 
                  key={item.id} 
                  className="watchlist-item"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="watchlist-poster">
                    <img 
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder.jpg'} 
                      alt={item.title || item.name} 
                    />
                    <button 
                      className="remove-button"
                      onClick={(e) => handleRemoveFromWatchlist(item, e)}
                      aria-label="Remove from watchlist"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="watchlist-info">
                    <h3 className="watchlist-title">{item.title || item.name}</h3>
                    <div className="watchlist-meta">
                      <span className="rating">
                        <i className="fas fa-star"></i> {item.vote_average?.toFixed(1) || 'N/A'}
                      </span>
                      <span className="year">
                        {(item.release_date || item.first_air_date) ? 
                          new Date(item.release_date || item.first_air_date).getFullYear() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Watchlist; 