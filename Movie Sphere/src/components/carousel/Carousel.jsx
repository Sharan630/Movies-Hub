import styles from './carousel.module.css';
import { useState, useEffect } from 'react';

const Carousel = () => {
  const images = [
    'https://static.toiimg.com/photo/104714166.cms?resizemode=4',
    'https://akm-img-a-in.tosshub.com/indiatoday/images/story/201210/barfi_660_102512125637.jpg?VersionId=f3aQ5DDti7VcgMy4o6uOtJvueOi3uuWZ&size=690:388',
    'https://v4ucinema.com/wp-content/uploads/2023/08/01-padai-thalaivan.jpg',
    'http://2.bp.blogspot.com/-OS9WaWpWByE/T3lQmKv6jpI/AAAAAAAAMro/9QYlW-lROmQ/s1600/ss_rajamouli_eega_hq_wallpapers_009.jpg',
    'https://assets-in.bmscdn.com/discovery-catalog/events/et00384012-epmlntbmxj-landscape.jpg',
    'https://cricbettingtips.in/wp-content/uploads/2022/03/ipl-2022-point-table.jpg'

  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <section className={styles.carousel}>
      <div className={styles.carouselImageWrapper}>
        <img
          src={images[currentIndex]}
          alt={`carousel image ${currentIndex + 1}`}
          className={styles.carouselImage}
        />
      </div>
    </section>
  );
};

export default Carousel;
