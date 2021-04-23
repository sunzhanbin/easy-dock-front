import React, { useCallback, useMemo } from 'react';
import { Popover } from 'antd';
import { AbstractTooltipProps } from 'antd/lib/tooltip';
import classnames from 'classnames';
import Icon from '@components/icon';
import EditProjectModal, { EditProjectProps } from '../edit-project';
import ActionCard from '../action-card';
import { ProjectShape, ActionStatus } from '../types';
import styles from './index.module.scss';

interface ProjectProps {
  data: ProjectShape;
  isActive: boolean;
  onSelected(id: number): void;
  status?: ActionStatus;
  onStatusChange(status: ActionStatus): void;
  onUpdate: EditProjectProps['onSubmit'];
  onDelete(id: number): Promise<void>;
  className?: string;
}

const getPopupContainer: AbstractTooltipProps['getTooltipContainer'] = (c) => c;

const Project = (props: ProjectProps) => {
  const { data, isActive, onSelected, onUpdate, status, onStatusChange, onDelete, className } = props;
  const isEditing = isActive && status === 'editing';
  const isDeleting = isActive && status === 'deleting';

  // 选中项目
  const handleSelectProject = useCallback(() => {
    onSelected(data.id);
  }, [onSelected, data.id]);

  // 关闭弹窗
  const handleClosePopover = useCallback(
    (visible: boolean) => {
      if (!visible) {
        onStatusChange(undefined);
      }
    },
    [onStatusChange],
  );

  // 删除项目
  const handleDelete = useCallback(async () => {
    onDelete(data.id);
  }, [onDelete, data.id]);

  // 处理取消
  const handleCancel = useCallback(async () => {
    onStatusChange(undefined);
  }, [onStatusChange]);

  const deletePopoverContent = useMemo(() => {
    return (
      <ActionCard title="删除项目" onOk={handleDelete} onCancel={handleCancel}>
        <div className={styles.tips}>删除后不可恢复，确认删除？</div>
      </ActionCard>
    );
  }, [handleDelete, handleCancel]);

  return (
    <div
      onClick={handleSelectProject}
      className={classnames(
        className,
        styles.project,
        { [styles.active]: isActive },
        { [styles.editing]: isEditing || isDeleting },
      )}
    >
      <div className={styles.name}>{`${data.name} ${data.sceneCount || 0}`}</div>
      <div className={styles.icons}>
        <Popover
          trigger="click"
          visible={isEditing}
          content={<EditProjectModal data={data} onSubmit={onUpdate} onCancel={handleCancel} />}
          getPopupContainer={getPopupContainer}
          onVisibleChange={handleClosePopover}
          placement="bottom"
          destroyTooltipOnHide
        >
          <Icon
            type="bianji"
            className={classnames(styles.icon, { [styles.active]: isEditing })}
            onClick={() => onStatusChange('editing')}
          />
        </Popover>
        <Popover
          trigger="click"
          visible={isDeleting}
          getPopupContainer={getPopupContainer}
          onVisibleChange={handleClosePopover}
          placement="bottom"
          content={deletePopoverContent}
          destroyTooltipOnHide
        >
          <Icon
            type="shanchu"
            className={classnames(styles.icon, { [styles.active]: isDeleting })}
            onClick={() => onStatusChange('deleting')}
          />
        </Popover>
      </div>
    </div>
  );
};

export default React.memo(Project);
