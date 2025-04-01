import { useState, useEffect } from 'react';
import { getMovieGenres } from '../../services/tmdbApi';
import '../../styles/Channels.css';

function Channels() {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                setLoading(true);
                const data = await getMovieGenres();
                setGenres(data.genres);
            } catch (err) {
                setError('Failed to fetch genres. Please try again later.');
                console.error('Error fetching genres:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === genres.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? genres.length - 1 : prevIndex - 1
        );
    };

    if (loading) {
        return <div className="loading">Loading genres...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="channels-section">
            <h2 className="section-title">Movie Genres</h2>
            <div className="channels-container">
                <button className="carousel-button prev" onClick={prevSlide}>
                    <span className="arrow">←</span>
                </button>
                <div className="channels-carousel">
                    {genres.map((genre, index) => (
                        <div
                            key={genre.id}
                            className={`channel-item ${index === currentIndex ? 'active' : ''}`}
                        >
                            <div className="channel-icon">
                                <span className="genre-icon">🎬</span>
                            </div>
                            <span className="channel-name">{genre.name}</span>
                        </div>
                    ))}
                </div>
                <button className="carousel-button next" onClick={nextSlide}>
                    <span className="arrow">→</span>
                </button>
            </div>
        </div>
    );
}

export default Channels;