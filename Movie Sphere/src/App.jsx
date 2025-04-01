import React, { useState } from 'react';
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

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">
          Movie Sphere
        </Link>
        <div className="nav-links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/movies" className={isActive('/movies')}>Movies</Link>
          <Link to="/tv-shows" className={isActive('/tv-shows')}>TV Shows</Link>
        </div>
        <button 
          className="search-button"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <i className="fas fa-search"></i>
        </button>
      </div>
      {isSearchOpen && <Search />}
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/:type/:id" element={<Details />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-info">
              <p>&copy; 2025 Movie Sphere. All rights reserved.</p>
              <p>Your ultimate destination for discovering and exploring movies and TV shows. We provide comprehensive information, ratings, and reviews to help you make informed entertainment choices.</p>
                <p>Powered by @Sharan sai</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
