import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";  
import Carousel from "../components/carousel/Carousel";
import Channels from "../components/channels/Channels";
import Featured from "../components/featured/Featured";
import Header from "../components/header/Header";
import Shows from "../components/shows/Shows";
import Tags from "../components/tags/Tags";

export default function Home() {
  let [movies, setMovies] = useState([]);
  let [featuredMovies, setFeaturedMovies] = useState([]);
  let [dramaMovies, setDramaMovies] = useState([]);
  let [hindiMovies, setHindiMovies] = useState([]);
  let [topMovies, setTopMovies] = useState([]);
  let [englishMovies, setEnglishMovies] = useState([]);
  let [teluguMovies, setTeluguMovies] = useState([]);
  let [tamilMovies, setTamilMovies] = useState([]);
  let [kannadaMovies, setKannadaMovies] = useState([]);
  let [malayalamMovies, setMalayalamMovies] = useState([]);
  
  
  const navigate = useNavigate();  
  const { tag } = useParams();  

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let movieResponse = await fetch("http://localhost:3000/movies");
        let moviesData = await movieResponse.json();
        setMovies(moviesData);

        let featMovies = moviesData.filter((movie) => movie.featured === true);
        setFeaturedMovies(featMovies.slice(0, 4));

        let draMovies = moviesData.filter((movie) => movie.genre.includes("Drama") && movie.genre.includes("Action"));
        setDramaMovies(draMovies.slice(0, 6));

        let hinMovies = moviesData.filter((movie) => movie.language === "Hindi");
        setHindiMovies(hinMovies.slice(0, 6));

        let topRatedMovies = moviesData.filter((movie) => movie.imdb >= 8.5);
        setTopMovies(topRatedMovies.slice(0, 6));

        let engMovies = moviesData.filter((movie) => movie.language === "English");
        setEnglishMovies(engMovies.slice(0, 6));

        let teluguMovies = moviesData.filter((movie) => movie.language === "Telugu");
        setTeluguMovies(teluguMovies.slice(0, 6));

        let tamilMovies = moviesData.filter((movie) => movie.language === "Tamil");
        setTamilMovies(tamilMovies.slice(0, 6));

        let kannadaMovies = moviesData.filter((movie) => movie.language === "Kannada");
        setKannadaMovies(kannadaMovies.slice(0, 6));

        let malayalamMovies = moviesData.filter((movie) => movie.language === "Malayalam");
        setMalayalamMovies(malayalamMovies.slice(0, 6));

      } catch (err) {
        console.log(err);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (tag) {
      const filteredMovies = movies.filter((movie) =>
        movie.genre.includes(tag) || movie.language.toLowerCase() === tag.toLowerCase()
      );
      setMovies(filteredMovies.slice(0, 6));
    } else {
      fetchMovies();
    }
  }, [tag, movies]);  

  const handleTagClick = (tag) => {
    navigate(`/home/${tag}`);  
  };

  const fetchMovies = async () => {
    try {
      let movieResponse = await fetch("http://localhost:3000/movies");
      let moviesData = await movieResponse.json();
      setMovies(moviesData);

      let featMovies = moviesData.filter((movie) => movie.featured === true);
      setFeaturedMovies(featMovies.slice(0, 4));

      let draMovies = moviesData.filter((movie) => movie.genre.includes("Drama") && movie.genre.includes("Action"));
      setDramaMovies(draMovies.slice(0, 6));

      let hinMovies = moviesData.filter((movie) => movie.language === "Hindi");
      setHindiMovies(hinMovies.slice(0, 6));

      let topRatedMovies = moviesData.filter((movie) => movie.imdb >= 8.5);
      setTopMovies(topRatedMovies.slice(0, 6));

      let engMovies = moviesData.filter((movie) => movie.language === "English");
      setEnglishMovies(engMovies.slice(0, 6));

      let teluguMovies = moviesData.filter((movie) => movie.language === "Telugu");
      setTeluguMovies(teluguMovies.slice(0, 6));

      let tamilMovies = moviesData.filter((movie) => movie.language === "Tamil");
      setTamilMovies(tamilMovies.slice(0, 6));

      let kannadaMovies = moviesData.filter((movie) => movie.language === "Kannada");
      setKannadaMovies(kannadaMovies.slice(0, 6));

      let malayalamMovies = moviesData.filter((movie) => movie.language === "Malayalam");
      setMalayalamMovies(malayalamMovies.slice(0, 6));

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header movies={movies} />
      <Tags onTagClick={handleTagClick} /> 
      <Carousel />
      <Channels />
      <Featured movies={featuredMovies} />

      {tag ? (
        <Shows title={`Filtered Movies: "${tag}"`} movies={movies} />
      ) : (
        <>
          <Shows title="Drama Movies For You" movies={dramaMovies} />
          <Shows title="Hindi Movies For You" movies={hindiMovies} />
          <Shows title="Top Movies For You" movies={topMovies} />
          <Shows title="English Movies For You" movies={englishMovies} />
          <Shows title="Telugu Movies For You" movies={teluguMovies} />
          <Shows title="Tamil Movies For You" movies={tamilMovies} />
          <Shows title="Kannada Movies For You" movies={kannadaMovies} />
          <Shows title="Malayalam Movies For You" movies={malayalamMovies} />
        </>
      )}

      <footer style={{ textAlign: "center", padding: "30px", marginTop: "20px", backgroundColor: "black", color: "white" }}>
        <p>&copy; 2025 Sharansai. All rights reserved.</p>
        <p>Movie Sphere is an online streaming platform offering a wide variety of movies, TV shows, and exclusive content in multiple languages and genres. Stay tuned for more exciting releases!</p>
        <p>Contact us at support : sharansai032@gmail.com</p>
      </footer>
    </>
  );
}
