import { useState } from 'react';
import '../../styles/Hero.css';

function Hero() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section className="hero-section">
            <div className="hero-content">
                <h1>Welcome to Movie Sphere</h1>
                <p>Your one-stop destination for movies and shows</p>
                <button 
                    className={`subscribe-btn ${isHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    Subscribe Now
                    <i className="fas fa-arrow-right"></i>
                </button>
            </div>
            <div className="hero-overlay"></div>
        </section>
    );
}

export default Hero; 