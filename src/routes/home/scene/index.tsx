import { Switch } from 'antd';
import classnames from 'classnames';
import Icon from '@components/icon';
import { getSceneImageUrl } from '@utils';
import { SceneShape } from '../types';
import styles from './index.module.scss';
import { useCallback, useState } from 'react';

export interface SceneProps {
  data: SceneShape;
  className?: string;
  onEdit(data: SceneShape): void;
  onStatusChange(status: -1 | 1, id: number): Promise<void>;
  onTapCover(data: SceneShape): void;
}

export default function Scene(props: SceneProps) {
  const { data, onEdit, onStatusChange, onTapCover, className } = props;
  const [loading, setLoading] = useState(false);
  const handleEditScene = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onEdit(data);
    },
    [onEdit, data],
  );
  const handleStatusChange = useCallback(
    async (checked: boolean) => {
      setLoading(true);

      try {
        await onStatusChange(checked ? 1 : -1, data.id);
      } finally {
        setLoading(false);
      }
    },
    [onStatusChange, data.id],
  );

  const handleClickCover = useCallback(() => {
    onTapCover(data);
  }, [onTapCover, data]);

  const handleClickFooter = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  }, []);

  return (
    <div className={classnames(className, styles.card)} onClick={handleClickCover}>
      <img src={getSceneImageUrl(data.icon)} alt="iamge" />
      <div className={styles.content}>
        <div className={styles.title}>{data.name}</div>
        <div className={styles.remark}>{data.remark || '--'}</div>
        <div className={styles.footer} onClick={handleClickFooter}>
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={data.status === 1}
            onChange={handleStatusChange}
            loading={loading}
          />
          <div className={styles.version}>{data.version?.version || '-'}</div>
        </div>
        <div className={styles.icon}>
          <Icon type="bianji" onClick={handleEditScene} />
        </div>
      </div>
    </div>
  );
}
