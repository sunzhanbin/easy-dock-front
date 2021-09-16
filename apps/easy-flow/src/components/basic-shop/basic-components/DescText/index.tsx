import { memo, useCallback } from 'react';
import styles from './index.module.scss';

const DescText = (props: { value: string }) => {
  const { value } = props;
  const renderContent = useCallback(() => {
    if (!value || value.trim() === '<p></p>') {
      return <div className={styles.desc}>请补充描述性文字</div>;
    }
    return <div className={styles.content} dangerouslySetInnerHTML={{ __html: value }}></div>;
  }, [value]);
  return <div className={styles.container}>{renderContent()}</div>;
};

export default memo(DescText);
