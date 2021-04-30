import React, { useCallback, useState } from 'react';
import { Checkbox } from 'antd';
import classnames from 'classnames';
import Popover from '@/components/popover';
import Icon from '@components/icon';
import styles from './index.module.scss';

interface CardProps {
  title: string;
  checked?: boolean;
  className?: string;
  state: React.ReactNode;
  onChecked?(checked: boolean): void;
  onDelete?(): Promise<void>;
  children?: React.ReactNode;
}

export default function Card(props: CardProps) {
  const { checked, className, onChecked, state, title, children, onDelete } = props;
  const [showDeletePopover, setShowDeletePopover] = useState(false);
  const handleChecked = useCallback(() => {
    if (typeof onChecked === 'function') {
      onChecked(!checked);
    }
  }, [onChecked, checked]);

  return (
    <div
      className={classnames(
        styles.card,
        className,
        { [styles.checkable]: Boolean(onChecked) },
        { [styles['show-delete']]: showDeletePopover },
      )}
      onClick={handleChecked}
    >
      {onChecked && <Checkbox className={styles.checkbox} checked={checked} />}

      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.content}>{children}</div>
      </div>
      <div className={styles.status}>{state}</div>

      {onDelete && (
        <Popover
          placement="left"
          title="删除API"
          onVisibleChange={setShowDeletePopover}
          content="确认删除该API吗?"
          onOk={onDelete}
        >
          <div className={styles.del}>
            <Icon type="shanchu" />
          </div>
        </Popover>
      )}
    </div>
  );
}
