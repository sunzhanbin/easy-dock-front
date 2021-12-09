import React, { FC, memo } from 'react';
import styles from './index.module.scss';

const Container: FC = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.editorHeader}></div>
      <div className={styles.editZone}></div>
      <div className={styles.attrSetting}></div>
    </div>
  );
};

export default memo(Container);
