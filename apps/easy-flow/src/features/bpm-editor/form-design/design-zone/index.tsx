import { FC, memo } from 'react';
import FormZone from './form-zone';
import styles from './index.module.scss';

const DesignZone: FC<{}> = () => {
  return (
    <div className={styles.container}>
      <FormZone></FormZone>
    </div>
  );
};

export default memo(DesignZone);
