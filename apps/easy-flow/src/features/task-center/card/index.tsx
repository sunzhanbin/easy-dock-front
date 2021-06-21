import { memo, useCallback, FC } from 'react';
import styles from './index.module.scss';
import FlowImage from '@assets/flow-small.png';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { dynamicRoutes } from '@/consts/route';

const Card: FC<{ id: number; name: string; className?: string }> = ({ id, name, className }) => {
  const history = useHistory();
  const handleClick = useCallback(() => {
    const path = dynamicRoutes.toStartFlow(id);
    history.push(path);
  }, [id]);
  return (
    <div className={classNames(styles.container, className)} onClick={handleClick}>
      <div className={styles.left}>
        <img src={FlowImage} alt="图片" className={styles.image} />
      </div>
      <div className={styles.right}>{name}</div>
    </div>
  );
};

export default memo(Card);
