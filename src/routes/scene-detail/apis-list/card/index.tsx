import { Radio } from 'antd';
import classnames from 'classnames';
import { useCallback, useMemo } from 'react';
import styles from './index.module.scss';

export type ApiShape = {
  name: string;
  version: string;
  createTime: number;
  state: 0 | 1 | 2;
  editGeneration: 0 | 1;
  id: number;
  remarks: string;
};

interface ApiProps {
  checked?: boolean;
  data: ApiShape;
  className?: string;
  showRadio?: boolean;
  onChecked?(id: number, checked: boolean): void;
}

export default function Api(props: ApiProps) {
  const { checked, data, className, onChecked, showRadio } = props;
  const statusInfo = useMemo(() => {
    if (data.state === 0) {
      return {
        className: styles.editing,
        text: '编辑中',
      };
    } else if (data.state === 2) {
      return {
        className: styles.deployed,
        text: '已发布',
      };
    } else {
      return {
        className: styles['wait-deploy'],
        text: '待发布',
      };
    }
  }, [data.state]);

  const handleChecked = useCallback(() => {
    if (typeof onChecked === 'function') {
      onChecked(data.id, !checked);
    }
  }, [onChecked, data.id, checked]);

  const createTimeText = useMemo(() => {
    if (!data.createTime) {
      return '-';
    }

    const date = new Date(data.createTime);

    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}创建`;
  }, [data.createTime]);

  return (
    <div className={classnames(styles.card, className)} onClick={handleChecked}>
      {showRadio && <Radio className={styles.radio} checked={checked} />}
      <div className={styles.content}>
        <div className={styles.title}>{data.name}</div>
        <div className={styles.info}>
          <div className={styles.type}>{data.editGeneration === 1 ? '编排' : '原生'}</div>
          <div className={styles.version}>{data.version}</div>
          <div className={styles.separator}>|</div>
          <div className={styles.time}>{createTimeText}</div>
        </div>
      </div>
      <div className={classnames(styles.status, statusInfo.className)}>{statusInfo.text}</div>
    </div>
  );
}
