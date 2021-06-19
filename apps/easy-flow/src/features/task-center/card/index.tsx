import { memo, FC } from 'react';
import styles from './index.module.scss';
import FlowImage from '@assets/flow-small.png';

const Card: FC<{ id: number; name: string }> = ({ id, name }) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img src={FlowImage} alt="图片" className={styles.image} />
      </div>
      <div className={styles.right}>{name}</div>
    </div>
  );
};

export default memo(Card);
