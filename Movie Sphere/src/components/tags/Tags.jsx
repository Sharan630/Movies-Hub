import styles from './tags.module.css';

const Tags = ({ onTagClick }) => {
  const tags = [
    "Drama", "Hindi", "Action", "Romantic Comedy", "Sci-Fi", "Thriller", 
    "Fantasy", "Documentary", "Crime", "Adventure", "Mystery", "Horror"
  ];

  return (
    <div className={styles.tags}>
      {tags.map((tag) => (
        <p key={tag} className={styles.tag} onClick={() => onTagClick(tag)}>
          {tag}
        </p>
      ))}
    </div>
  );
};

export default Tags;
