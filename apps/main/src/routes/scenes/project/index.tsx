import React, { useCallback, useMemo, useRef, useState } from 'react';
import classnames from 'classnames';
import Icon from '@components/icon';
import Popover from '@/components/popover';
import PopConfirm from '@/components/popover-confirm';
import Form, { FormType } from './form';
import { ProjectShape } from '../types';
import styles from './index.module.scss';

interface ProjectProps {
  data: ProjectShape;
  isActive: boolean;
  onSelected(id: number): void;
  onUpdate(values: ProjectShape & Omit<ProjectShape, 'id'>): Promise<void>;
  onDelete(id: number): Promise<void>;
  className?: string;
}

const Project = (props: ProjectProps) => {
  const { data, isActive, onSelected, onUpdate, onDelete, className } = props;
  const [currentProjectIsEditing, setCurrentProjectIsEditing] = useState(false);
  const [currentProjectIsDeleting, setCurrentProjectIsDeleting] = useState(false);
  const formRef = useRef<FormType>();

  // 选中项目
  const handleSelectProject = useCallback(() => {
    onSelected(data.id);
  }, [onSelected, data.id]);

  // 删除项目
  const handleDelete = useCallback(async () => {
    return onDelete(data.id);
  }, [onDelete, data.id]);

  // 编辑项目
  const handleEditing = useCallback(async () => {
    if (formRef.current) {
      try {
        await onUpdate(Object.assign({}, data, await formRef.current.validateFields()));
      } finally {
        setCurrentProjectIsEditing(false);
      }
    }
  }, [onUpdate, data]);

  const getPopupContainer = useMemo(() => () => document.body, []);

  return (
    <div
      onClick={handleSelectProject}
      className={classnames(
        className,
        styles.project,
        { [styles.active]: isActive },
        { [styles.editing]: currentProjectIsEditing || currentProjectIsDeleting },
      )}
    >
      <div className={styles.content}>
        <div className={styles.name}>{data.name}</div>
        <div>{data.appCount || 0}</div>
      </div>
      <div className={styles.icons}>
        <Popover
          trigger="click"
          content={<Form data={data} formRef={formRef} />}
          placement="bottom"
          title="编辑项目"
          onOk={handleEditing}
          visible={currentProjectIsEditing}
          onVisibleChange={setCurrentProjectIsEditing}
          getPopupContainer={getPopupContainer}
        >
          <div className={styles['edit-icon-container']}>
            <Icon type="bianji" className={classnames(styles.icon, { [styles.active]: currentProjectIsEditing })} />
          </div>
        </Popover>

        <PopConfirm
          trigger="click"
          placement="bottom"
          content="删除后不可恢复，确认删除？"
          title="删除项目"
          onConfirm={handleDelete}
          visible={currentProjectIsDeleting}
          onVisibleChange={setCurrentProjectIsDeleting}
          getPopupContainer={getPopupContainer}
        >
          <div>
            <Icon type="shanchu" className={classnames(styles.icon, { [styles.active]: currentProjectIsDeleting })} />
          </div>
        </PopConfirm>
      </div>
    </div>
  );
};

export default React.memo(Project);
