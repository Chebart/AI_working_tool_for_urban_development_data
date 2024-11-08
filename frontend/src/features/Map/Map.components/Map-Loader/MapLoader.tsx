import Lottie from 'react-lottie';

import animation from '../../../../shared/animations/Loader.json';

import styles from './MapLoader.module.css';

export const MapLoader = () => {
  return (
    <div className={styles.MapLoader}>
      <Lottie
        options={{
          animationData: animation,
          loop: true,
          autoplay: true,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
          },
        }}
        height={88}
        width={88}
      />
    </div>
  );
};
