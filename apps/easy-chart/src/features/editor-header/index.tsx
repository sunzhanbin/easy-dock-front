import React, { FC, memo, useCallback, useRef, useState } from 'react';
import { Button, Modal, Input } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { useHistory } from 'react-router-dom';
import Header from '../header';
import styles from './index.module.scss';
import { Category } from '../../type'

const EditorHeader: FC = () => {
  const history = useHistory();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalShow, setModalShow] = useState<boolean>(false);
  const [charTitle, setChartTitle] = useState<string>('');

  const handleSave = useMemoCallback(async () => {
    console.log('保存');
  });

  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);
  const handleAdd = (category:Category) => {
    setModalShow(true);
  }
  const handleOk = () => {
    setModalShow(false);
  }

  const handleCancel = () => {
    setModalShow(false);
  }
  const handleChartTitleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setChartTitle(e.target.value.trim());
  }
  return (
    <div className={styles.header_container} ref={containerRef}>
      <Header backText={'appName'} className={styles.edit_header} goBack={handleGoBack}>
        <div className={styles.operation}>
          <Button type="primary" ghost className={styles.save} size="large" onClick={()=>handleAdd('chart')}>
            图表
          </Button>
          <Button type="primary" ghost className={styles.save} size="large" onClick={()=>handleAdd('filter')}>
            筛选器
          </Button>
          <Button type="primary" ghost className={styles.save} size="large" onClick={()=>handleAdd('text')}>
            文本
          </Button>
        </div>
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
      <Modal visible={isModalShow} onOk={handleOk} onCancel={handleCancel}>
        <div>
          <h3>图表名称</h3>
          <div>
          <Input placeholder="请输入图表名称" value={charTitle} onChange={handleChartTitleChange}/>
          </div>
          <h3>数据源</h3>
        </div>
      </Modal>
    </div>
  );
};

export default memo(EditorHeader);
