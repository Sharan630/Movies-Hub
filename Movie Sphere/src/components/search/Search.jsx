import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMovies } from '../../services/tmdbApi';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await searchMovies(query);
      if (response && response.results) {
        navigate('/search', { 
          state: { 
            results: response.results, 
            query,
            totalResults: response.total_results
          } 
        });
      } else {
        setError('No results found');
      }
    } catch (err) {
      setError('Failed to fetch search results. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="search-input"
          autoFocus
        />
        <button 
          type="submit" 
          className="search-button"
          disabled={loading}
        >
          <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-search'}`}></i>
        </button>
      </form>
      {loading && <div className="loading">Searching...</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Search; 