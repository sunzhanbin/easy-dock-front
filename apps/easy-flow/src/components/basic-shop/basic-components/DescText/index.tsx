import { memo, useCallback } from 'react';
import styles from './index.module.scss';

const DescText = (props: { content: string }) => {
  const { content } = props;
  const renderContent = useCallback(() => {
    if (!content || content.trim() === '<p></p>') {
      return <div className={styles.desc}>请补充描述性文字</div>;
    }
    return <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }}></div>;
  }, [content]);
  return <div className={styles.container}>{renderContent()}</div>;
};

export default memo(DescText);
