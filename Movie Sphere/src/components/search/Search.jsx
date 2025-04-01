import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMovies } from '../../services/tmdbApi';
import './Search.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!query.trim()) {
            setError('Please enter a search term');
            setTimeout(() => {
                setError('');
            }, 3000);
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        } catch (err) {
            setError('Failed to search. Please try again.');
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} className="search-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search for movies..."
                    className="search-input"
                    disabled={loading}
                />
                <button type="submit" className="search-button" disabled={loading}>
                    <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-search'}`}></i>
                </button>
            </form>
            {error && <div className="search-error">{error}</div>}
        </div>
    );
};

export default Search; 