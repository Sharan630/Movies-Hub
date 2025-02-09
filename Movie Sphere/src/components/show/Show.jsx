import styles from './show.module.css';

const Show = (props) => {
  return (
    <div className={styles.show}>
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

export default Show;
