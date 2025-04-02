import React, { useState, useEffect, useCallback } from 'react';
import './FeaturedCarousel.css';

const FeaturedCarousel = ({ movies = [], onQuickView }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  // Don't render if no movies
  if (!movies || movies.length === 0) {
    return null;
  }

  const handleQuickView = useCallback(() => {
    if (onQuickView && movies[currentIndex]) {
      onQuickView(movies[currentIndex]);
    }
  }, [currentIndex, movies, onQuickView]);

  // Auto slide every 3 seconds
  useEffect(() => {
    if (!isHovered && !isTouched) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
      }, 3000); // Changed from 5000 to 3000 ms
      return () => clearInterval(timer);
    }
    // Reset touch state after 5 seconds of inactivity
    if (isTouched) {
      const touchTimer = setTimeout(() => {
        setIsTouched(false);
      }, 5000);
      return () => clearTimeout(touchTimer);
    }
  }, [isHovered, isTouched, movies.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    setIsTouched(true);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
    setIsTouched(true);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsTouched(true);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    
    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // If swipe is significant (more than 50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left, go to next slide
        nextSlide();
      } else {
        // Swipe right, go to previous slide
        prevSlide();
      }
      
      setTouchStart(0);
      setIsTouched(true);
    }
  };

  const currentItem = movies[currentIndex];

  if (!currentItem || !currentItem.backdrop_path) {
    return null;
  }

  return (
    <div 
      className="featured-carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className="carousel-container">
        <div className="carousel-content">
          <div className="carousel-backdrop">
            <img 
              src={`https://image.tmdb.org/t/p/original${currentItem.backdrop_path}`} 
              alt={currentItem.title} 
              className="backdrop-image"
            />
            <div className="backdrop-gradient" />
          </div>
          
          <div className="carousel-info">
            <h1 className="carousel-title">{currentItem.title}</h1>
            <div className="carousel-meta">
              <span className="carousel-rating">
                <i className="fas fa-star"></i> {currentItem.vote_average.toFixed(1)}
              </span>
              <span className="carousel-year">
                {currentItem.release_date && new Date(currentItem.release_date).getFullYear()}
              </span>
            </div>
            <p className="carousel-description">{currentItem.overview}</p>
            <div className="carousel-actions">
              <button 
                className="more-info-button"
                onClick={handleQuickView}
              >
                <i className="fas fa-info-circle"></i>
                View Details
              </button>
            </div>
          </div>

          <div className="carousel-navigation">
            <button className="carousel-nav prev" onClick={prevSlide} aria-label="Previous slide">
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="carousel-indicators">
              {movies.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <button className="carousel-nav next" onClick={nextSlide} aria-label="Next slide">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarousel; 