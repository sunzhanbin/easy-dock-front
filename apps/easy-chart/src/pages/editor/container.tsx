import React, { FC, memo} from 'react';
import styles from './index.module.scss';

const Container: FC = (props) => {
  console.log(props, 'props');
  return (
    <div className={styles.container}>
      Container
    </div>
  );
};

export default memo(Container);
