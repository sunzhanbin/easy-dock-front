import { useCallback, useState, useMemo, useRef } from 'react';
import { Switch, Dropdown, Tooltip } from 'antd';
import classnames from 'classnames';
import { PopoverConfirm, Icon } from '@common/components';
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
  containerId?: string;
}

export default function Scene(props: SceneProps) {
  const { data, onEdit, onStatusChange, onTapCard, className, onDelete, containerId } = props;
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  // 编辑应用
  const handleEditScene = useCallback(() => {
    setShowActionDropdown(false);
    onEdit(data);
  }, [onEdit, data]);

  // 开关应用启用状态
  const handleStatusChange = useCallback(async () => {
    await onStatusChange(data.status === 1 ? -1 : 1, data.id);
  }, [onStatusChange, data]);

  const handleClickCard = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      let canTriggerCardTap = true;
      let triggerNode: any = event.target;

      while (triggerNode && triggerNode.classList) {
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

  const canDelete = data.status === -1;

  const handleDeleteScene = useCallback(() => {
    if (!canDelete) {
      return;
    }

    setShowActionDropdown(false);
    setShowConfirmDelete(true);
  }, [canDelete]);

  const handleConfirmDelete = useCallback(() => {
    return onDelete(data);
  }, [onDelete, data]);

  const dropownOverlay = useMemo(() => {
    return (
      <div className={styles.menus} onClick={stopPropagation}>
        <div className={styles.item} onClick={handleEditScene}>
          <Icon type="bianji" />
          <span>编辑</span>
        </div>
        <div className={classnames(styles.item, { [styles.disabled]: !canDelete })} onClick={handleDeleteScene}>
          <Icon type="shanchu" />
          <span>删除</span>
        </div>
      </div>
    );
  }, [handleEditScene, canDelete, handleDeleteScene]);

  const getPopupContainer = useMemo(() => {
    if (containerId) {
      return () => document.getElementById(containerId)!;
    }

    return () => cardRef.current!;
  }, [containerId]);

  const handleDeleteConfirmVisibleChange = useCallback((visible: boolean) => {
    if (cardRef.current) {
      setShowConfirmDelete(visible);
    }
  }, []);

  return (
    <div className={classnames(className, styles.card)} onClick={handleClickCard} ref={cardRef}>
      <img src={getSceneImageUrl(data.icon)} alt="iamge" />
      <div className={styles.content}>
        {data.name.length > 15 ? (
          <Tooltip title={data.name} getPopupContainer={getPopupContainer} placement="topLeft">
            <div className={styles.title}>{data.name}</div>
          </Tooltip>
        ) : (
          <div className={styles.title}>{data.name}</div>
        )}

        {data.remark && data.remark.length > 15 ? (
          <Tooltip title={data.remark} placement="topLeft" getPopupContainer={getPopupContainer}>
            <div className={styles.remark}>{data.remark}</div>
          </Tooltip>
        ) : (
          <div className={styles.remark}>{data.remark || '这是一个应用'}</div>
        )}

        <div className={styles.footer}>
          <PopoverConfirm
            title="提示"
            key="switch-status"
            content={`确认${data.status === 1 ? '关闭' : '启用'}所选应用吗?`}
            onConfirm={handleStatusChange}
            getPopupContainer={getPopupContainer}
          >
            <div onClick={stopPropagation}>
              <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={data.status === 1} />
            </div>
          </PopoverConfirm>
        </div>
        <div className={styles.tool}>
          <PopoverConfirm
            title="确认删除"
            content="删除后不可恢复，确认删除？"
            placement="bottomRight"
            visible={showConfirmDelete}
            onVisibleChange={handleDeleteConfirmVisibleChange}
            onConfirm={handleConfirmDelete}
            getPopupContainer={getPopupContainer}
          >
            <div className={styles.del}></div>
          </PopoverConfirm>

          <Dropdown
            overlayClassName="dark"
            overlay={dropownOverlay}
            placement="bottomRight"
            visible={showActionDropdown}
            onVisibleChange={setShowActionDropdown}
            getPopupContainer={getPopupContainer}
          >
            <div onClick={stopPropagation} className={styles.more}>
              <Icon type="gengduo" />
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
