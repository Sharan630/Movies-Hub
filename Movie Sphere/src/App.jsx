import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Search from './components/search/Search';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import SearchResults from './pages/SearchResults';
import Details from './components/details/Details';
import './App.css';

const Navbar = () => {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.navbar-content')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close search bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchOpen && !event.target.closest('.search-container') && !event.target.closest('.search-button')) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSearchOpen]);

  // Close search bar and mobile menu on location change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        <Link to="/" className="logo">
          <span>Movie Sphere</span>
        </Link>
        
        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/movies" className={`nav-link ${isActive('/movies')}`}>Movies</Link>
          <Link to="/tv-shows" className={`nav-link ${isActive('/tv-shows')}`}>TV Shows</Link>
        </div>
        
        <div className="nav-right">
          <button 
            className="search-button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle search"
          >
            <i className="fas fa-search"></i>
          </button>
          <button 
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>
      {isSearchOpen && <Search onClose={() => setIsSearchOpen(false)} />}
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app" style={{ width: '100vw', maxWidth: '100vw', margin: 0, padding: 0, overflow: 'hidden' }}>
        <Navbar />
        <main className="main-content" style={{ width: '100vw', maxWidth: '100vw', margin: 0, padding: 0, paddingTop: '70px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/:type/:id" element={<Details />} />
          </Routes>
        </main>
        <footer className="footer" style={{ width: '100vw', maxWidth: '100vw', margin: 0, padding: '1rem 2rem' }}>
          <div className="footer-content">
            <div className="footer-info">
              <p>&copy; 2025 Movie Sphere. All rights reserved.</p>
              <p>Your ultimate destination for discovering and exploring movies and TV shows.</p>
              <p>Powered by @Sharan sai</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
