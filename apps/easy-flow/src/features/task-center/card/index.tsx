import { memo, FC } from 'react';
import { useHistory } from 'react-router-dom';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { dynamicRoutes } from '@consts';
import styles from './index.module.scss';
import FlowImage from '@assets/flow-small.png';

const Card: FC<{ id: number; name: string }> = ({ id, name }) => {
  const history = useHistory();

  const handleClick = useMemoCallback(() => {
    history.push(dynamicRoutes.toStartFlow(id));
  });

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.left}>
        <img src={FlowImage} alt="图片" className={styles.image} />
      </div>
      <div className={styles.right}>{name}</div>
    </div>
  );
};

export default memo(Card);
