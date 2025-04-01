import { useState, useEffect } from 'react';
import { getPopularShows } from '../../services/tmdbApi';
import '../../styles/Shows.css';

function Shows() {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchShows = async () => {
            try {
                setLoading(true);
                const data = await getPopularShows(page);
                setShows(prevShows => [...prevShows, ...data.results]);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching shows:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchShows();
    }, [page]);

    const loadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="shows-section">
            <h2 className="section-title">Popular TV Shows</h2>
            <div className="shows-grid">
                {shows.map(show => (
                    <div key={show.id} className="show-card">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                            alt={show.name}
                            className="show-poster"
                        />
                        <div className="show-info">
                            <h3 className="show-title">{show.name}</h3>
                            <div className="show-meta">
                                <span>{show.first_air_date?.split('-')[0]}</span>
                                <span>{show.vote_average?.toFixed(1)}/10</span>
                            </div>
                            <p className="overview">{show.overview}</p>
                        </div>
                    </div>
                ))}
            </div>
            {loading && <div className="loading">Loading more shows...</div>}
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

export default Shows;