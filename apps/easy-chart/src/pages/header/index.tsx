import React, { FC, memo, useCallback, useRef } from 'react';
import { Button } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { useHistory } from 'react-router-dom';
import styles from './index.module.scss';
import Header from './component';

const EditorHeader: FC = () => {
  const history = useHistory();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSave = useMemoCallback(async () => {
    console.log('保存');
  });

  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [ history]);

  return (
    <div className={styles.header_container} ref={containerRef}>
      <Header backText={'appName'} className={styles.edit_header} goBack={handleGoBack}>

        <div className={styles.operation}>
          <Button type="primary" ghost className={styles.save} size="large" onClick={handleSave}>
            预览
          </Button>
          <Button type="primary" ghost className={styles.save} size="large" onClick={handleSave}>
            保存
          </Button>
          <Button type="primary" ghost className={styles.save} size="large" onClick={handleSave}>
            发布
          </Button>
        </div>
      </Header>
    </div>
  );
};

export default memo(EditorHeader);
