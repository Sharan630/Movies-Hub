import { useState, useEffect } from 'react';
import { getPopularMovies } from '../../services/tmdbApi';
import '../../styles/PopularMovies.css';

function PopularMovies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchPopularMovies = async () => {
            try {
                setLoading(true);
                const data = await getPopularMovies(page);
                setMovies(prevMovies => [...prevMovies, ...data.results]);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching popular movies:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularMovies();
    }, [page]);

    const loadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="popular-movies">
            <h2 className="section-title">Popular Movies</h2>
            <div className="movies-grid">
                {movies.map(movie => (
                    <div key={movie.id} className="movie-card">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="movie-poster"
                        />
                        <div className="movie-info">
                            <h3 className="movie-title">{movie.title}</h3>
                            <div className="movie-meta">
                                <span>{movie.release_date?.split('-')[0]}</span>
                                <span>{movie.vote_average?.toFixed(1)}/10</span>
                            </div>
                            <p className="overview">{movie.overview}</p>
                        </div>
                    </div>
                ))}
            </div>
            {loading && <div className="loading">Loading more movies...</div>}
            <button 
                className="load-more"
                onClick={loadMore}
                disabled={loading}
            >
                Load More
            </button>
        </div>
    );
}

export default PopularMovies; 