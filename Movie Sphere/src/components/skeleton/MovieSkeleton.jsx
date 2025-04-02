import React from 'react';
import './MovieSkeleton.css';

const MovieSkeleton = () => {
  return (
    <div className="movie-skeleton">
      <div className="skeleton poster"></div>
      <div className="skeleton-content">
        <div className="skeleton title"></div>
        <div className="skeleton description"></div>
        <div className="skeleton-meta">
          <div className="skeleton rating"></div>
          <div className="skeleton year"></div>
        </div>
      </div>
    </div>
  );
};

export default MovieSkeleton; 