import { useCallback, useState, useMemo } from 'react';
import { Switch, Dropdown } from 'antd';
import classnames from 'classnames';
import Icon from '@components/icon';
import Popconfirm from '@components/popconfirm';
import { getSceneImageUrl } from '@utils';
import { stopPropagation } from '@consts';
import { SceneShape } from '../types';
import styles from './index.module.scss';

export interface SceneProps {
  data: SceneShape;
  className?: string;
  onEdit(data: SceneShape): void;
  onStatusChange(status: -1 | 1, id: number): Promise<void>;
  onTapCard(data: SceneShape): void;
  onDelete(data: SceneShape): Promise<void>;
}

export default function Scene(props: SceneProps) {
  const { data, onEdit, onStatusChange, onTapCard, className, onDelete } = props;
  const [loading, setLoading] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  // 编辑场景
  const handleEditScene = useCallback(() => {
    setShowActionDropdown(false);
    onEdit(data);
  }, [onEdit, data]);

  // 开关场景启用状态
  const handleStatusChange = useCallback(async () => {
    setLoading(true);

    try {
      await onStatusChange(data.status === 1 ? -1 : 1, data.id);
    } finally {
      setLoading(false);
    }
  }, [onStatusChange, data]);

  const handleClickCard = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      let canTriggerCardTap = true;
      let triggerNode: any = event.target;

      while (triggerNode) {
        if (triggerNode.classList.contains('ant-popover-content')) {
          canTriggerCardTap = false;
          break;
        } else if (triggerNode.classList.contains(styles.card)) {
          break;
        } else {
          triggerNode = triggerNode.parentNode;
        }
      }

      if (canTriggerCardTap) {
        onTapCard(data);
      }
    },
    [onTapCard, data],
  );

  const handleDeleteScene = useCallback(() => {
    if (data.version) {
      return;
    }

    setShowActionDropdown(false);
    setShowConfirmDelete(true);
  }, [data.version]);

  const handleConfirmDelete = useCallback(() => {
    onDelete(data);
  }, [onDelete, data]);

  const dropownOverlay = useMemo(() => {
    return (
      <div className={styles.menus} onClick={stopPropagation}>
        <div className={styles.item} onClick={handleEditScene}>
          <Icon type="bianji" />
          <span>编辑</span>
        </div>
        <div className={classnames(styles.item, { [styles.disabled]: data.version })} onClick={handleDeleteScene}>
          <Icon type="shanchu" />
          <span>删除</span>
        </div>
      </div>
    );
  }, [data.version, handleEditScene, handleDeleteScene]);

  return (
    <div className={classnames(className, styles.card)} onClick={handleClickCard}>
      <img src={getSceneImageUrl(data.icon)} alt="iamge" />
      <div className={styles.content}>
        <div className={styles.title}>{data.name}</div>
        <div className={styles.remark}>{data.remark || '这是一个场景'}</div>
        <div className={styles.footer}>
          {data.version ? (
            <Popconfirm
              title="提示"
              key="switch-status"
              content={`确认${data.status === 1 ? '关闭' : '启用'}所选场景吗?`}
              onConfirm={handleStatusChange}
              okButtonProps={{ loading }}
            >
              <div onClick={stopPropagation}>
                <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={data.status === 1} />
              </div>
            </Popconfirm>
          ) : (
            <div className={styles.editing}>编辑中</div>
          )}

          {data.version && <div className={styles.version}>{data.version.version}</div>}
        </div>
        <Popconfirm
          title="确认删除"
          content="删除后不可恢复，确认删除？"
          placement="bottomRight"
          visible={showConfirmDelete}
          trigger="null"
          onVisibleChange={setShowConfirmDelete}
          onConfirm={handleConfirmDelete}
        >
          <Dropdown
            overlayClassName="dark"
            overlay={dropownOverlay}
            placement="bottomRight"
            visible={showActionDropdown}
            onVisibleChange={setShowActionDropdown}
          >
            <div className={styles.action} onClick={stopPropagation}>
              <Icon type="gengduo" />
            </div>
          </Dropdown>
        </Popconfirm>
      </div>
    </div>
  );
}
