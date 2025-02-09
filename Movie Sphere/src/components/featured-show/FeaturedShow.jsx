import styles from './featured-show.module.css';

const FeaturedShow = (props) => {
  return (
    <div className={styles.featuredShow}>
      <img src={props.movie.imageUrl} alt="poster" />
      <div className={styles.movieTitle}>
        <div className={styles.movieName}>
          {props.movie.name}
        </div>
        <div className={styles.movieDescription}>
          {props.movie.description}
        </div>
      </div>
    </div>
  );
};

export default FeaturedShow;
