import { memo } from 'react';
import styles from './index.module.scss';

const DataManage = () => {
  console.info(1111);
  return <div className={styles.container}>数据源管理</div>;
};

export default memo(DataManage);
