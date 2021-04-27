import React, { useCallback, useRef } from 'react';
import classnames from 'classnames';
import Icon from '@components/icon';
import Popover from '@/components/popover';
import Form, { FormType } from './form';
import { ProjectShape, ActionStatus } from '../types';
import styles from './index.module.scss';

interface ProjectProps {
  data: ProjectShape;
  isActive: boolean;
  onSelected(id: number): void;
  status?: ActionStatus;
  onStatusChange(status: ActionStatus): void;
  onUpdate(values: ProjectShape & Omit<ProjectShape, 'id'>): Promise<void>;
  onDelete(id: number): Promise<void>;
  className?: string;
}

const Project = (props: ProjectProps) => {
  const { data, isActive, onSelected, onUpdate, status, onStatusChange, onDelete, className } = props;
  const isEditing = isActive && status === 'editing';
  const isDeleting = isActive && status === 'deleting';
  const formRef = useRef<FormType>();

  // 选中项目
  const handleSelectProject = useCallback(() => {
    onSelected(data.id);
  }, [onSelected, data.id]);

  // 删除项目
  const handleDelete = useCallback(async () => {
    return onDelete(data.id);
  }, [onDelete, data.id]);

  const handleSubmit = useCallback(async () => {
    if (formRef.current) {
      await onUpdate(Object.assign({}, data, await formRef.current.validateFields()));
    }
  }, [onUpdate, data]);

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
          content={<Form data={data} formRef={formRef} />}
          placement="bottom"
          title="编辑项目"
          onOk={handleSubmit}
        >
          <Icon
            type="bianji"
            className={classnames(styles.icon, { [styles.active]: isEditing })}
            onClick={() => onStatusChange('editing')}
          />
        </Popover>

        <Popover
          trigger="click"
          placement="bottom"
          content="删除后不可恢复，确认删除？"
          title="删除项目"
          onOk={handleDelete}
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
