import React, { useState, useEffect } from 'react';
import './WatchlistButton.css';

const WatchlistButton = ({ item }) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setIsInWatchlist(watchlist.some(watchlistItem => watchlistItem.id === item.id));
  }, [item.id]);

  const toggleWatchlist = () => {
    setIsAnimating(true);
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    
    if (isInWatchlist) {
      const newWatchlist = watchlist.filter(watchlistItem => watchlistItem.id !== item.id);
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    } else {
      watchlist.push(item);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
    
    setIsInWatchlist(!isInWatchlist);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <button
      className={`watchlist-button ${isInWatchlist ? 'in-watchlist' : ''} ${isAnimating ? 'animating' : ''}`}
      onClick={toggleWatchlist}
      aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <i className={`fas ${isInWatchlist ? 'fa-check' : 'fa-plus'}`}></i>
      <span className="button-text">
        {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
      </span>
    </button>
  );
};

export default WatchlistButton; 