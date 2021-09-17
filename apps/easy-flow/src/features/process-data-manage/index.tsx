import { memo } from 'react';
import styles from './index.module.scss';

const DataManage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>流程数据管理</div>
      <div className={styles.wrapper}>
        <div className={styles.condition}></div>
        <div className={styles.operation}></div>
      </div>
    </div>
  );
};

export default memo(DataManage);
