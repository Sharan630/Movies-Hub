import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Show from '../show/Show';
import styles from './header.module.css';
import Logo from '../../assets/logo.png';
import crown from '../../assets/crown.jpg';
import searchIcon from '../../assets/search.jpg';
import voiceSearchIcon from '../../assets/voice.jpg';
import Icon from '../../assets/user.jpg';

const Header = (props) => {
  const [searchTitle, setSearchTitle] = useState(""); 
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [activeLink, setActiveLink] = useState("Home"); 
  const navigate = useNavigate();
  const location = useLocation();
  const { tag } = useParams();
  const prevSearch = useRef(""); 
  const debounceTimeout = useRef(null);  // To store the debounce timeout ID

  // Handle the search input change and persist it in localStorage
  const handleSearchChange = (event) => {
    const newSearchTitle = event.target.value;
    setSearchTitle(newSearchTitle);

    // Save search term to localStorage for persistence
    localStorage.setItem("searchTitle", newSearchTitle);

    // Clear previous debounce timeout if user is typing again
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new debounce timeout
    debounceTimeout.current = setTimeout(() => {
      if (newSearchTitle !== prevSearch.current) {
        prevSearch.current = newSearchTitle;
        filterMovies(newSearchTitle);  // Filter movies based on new search term
      }
    }, 500);  // Delay for 500ms after user stops typing
  };

  // Function to filter movies based on search term
  const filterMovies = (searchTerm) => {
    let filtered = props.movies;
    
    // Apply search filter only if search term is not empty
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((movie) =>
        movie.name.toUpperCase().includes(searchTerm.toUpperCase())
      );
    } else {
      // If no search term, do not display results
      filtered = [];
    }

    // Apply tag-based filter if tag is present
    if (tag && searchTerm.trim() !== "") {
      filtered = filtered.filter((movie) =>
        movie.genre.includes(tag) || movie.language.toLowerCase() === tag.toLowerCase()
      );
    }

    setFilteredMovies(filtered);
  };

  // Apply tag-based filter when the tag changes
  useEffect(() => {
    filterMovies(searchTitle); // Reapply filtering when the tag changes
  }, [tag, searchTitle]);

  // Effect to set the active link based on the current URL
  useEffect(() => {
    const path = location.pathname;
    if (path === "/home") {
      setActiveLink("Home");
    } else if (path.includes("/home/sports")) {
      setActiveLink("Sports");
    } else if (path.includes("/home/movies")) {
      setActiveLink("Movies");
    } else if (path.includes("/home/tv-shows")) {
      setActiveLink("TV Shows");
    } else {
      setActiveLink("More");
    }
  }, [location]);

  // Handle navigation when clicking on a nav link
  const handleNavClick = (genre) => {
    setActiveLink(genre);
    if (genre === "Home") {
      setSearchTitle(''); 
      setFilteredMovies([]); 
      navigate('/home'); 
    } else {
      let filteredByGenre = props.movies.filter((movie) => movie.genre.includes(genre));
      setFilteredMovies(filteredByGenre);
      navigate(`/home/${genre.toLowerCase()}`); 
    }
  };

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.navigation}>
          <div className={styles.logo}>
            <img src={Logo} alt='logo'/>
            <span>MOVIES HUB</span>
            <div className={styles.premium}>
              <img src={crown} alt="image"/> 
              <p>Go Premium</p>
            </div>
          </div>

          <ul className={styles.navLinks}>
            {["Home", "Sports", "Movies", "TV Shows", "More"].map((link) => (
              <li
                key={link}
                className={`${styles.navLink} ${activeLink === link ? styles.active : ""}`}
                onClick={() => handleNavClick(link)}
              >
                {link}
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.search}>
          <div className={styles.searchBox}>
            <div className={styles.headerIcon}>
              <img src={searchIcon} alt="icon"/>
            </div>

            <input 
              type="text"
              onChange={handleSearchChange} 
              className={styles.searchInput}
              value={searchTitle} 
              placeholder='Movies, Shows and more'
            />

            <div className={styles.headerIcon}>
              <img src={voiceSearchIcon} alt="icon"/>
            </div>
          </div>
          <img className={styles.usericon} src={Icon} alt="icon"/>
        </div>
      </header>

      {/* Only show search results if there are filtered movies */}
      {searchTitle.trim() && filteredMovies.length > 0 && (
        <div className={styles.searchResults}>
          {filteredMovies.map((movie) => <Show key={movie.id} movie={movie}/>)}
        </div>
      )}

      {/* Optionally, display a message when no results are found */}
      {searchTitle.trim() && filteredMovies.length === 0 && (
        <div className={styles.noResults}>No results found for "{searchTitle}"</div>
      )}
    </>
  );
};

export default Header;
