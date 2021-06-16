import { memo, FC } from 'react';
import styles from './index.module.scss';

const LabelContent: FC<{ label: string; desc?: string }> = ({ label, desc }) => {
  return (
    <div className={styles.label_container}>
      <div className={styles.label}>{label}</div>
      <div className={styles.desc}>{desc}</div>
    </div>
  );
};

export default memo(LabelContent);
