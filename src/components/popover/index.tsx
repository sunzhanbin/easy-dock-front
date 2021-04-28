import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames';
import { Popover } from 'antd';
import { AbstractTooltipProps } from 'antd/lib/tooltip';
import Icon from '@components/icon';
import { AsyncButton } from '@components';
import styles from './index.module.scss';

interface PopoverProps {
  title: string;
  children: React.ReactNode;
  content?: React.ReactNode;
  okText?: string;
  onOk?(): Promise<void> | void;
  placement?: AbstractTooltipProps['placement'];
  trigger?: AbstractTooltipProps['trigger'];
  visible?: boolean;
  onVisibleChange?(visible: boolean): void;
}

const getPopupContainer: AbstractTooltipProps['getTooltipContainer'] = (c) => c;

function EnnPopover(props: PopoverProps) {
  const {
    title,
    children,
    okText = '确认',
    onOk,
    content,
    placement,
    trigger = 'click',
    onVisibleChange,
    visible,
  } = props;
  const [showPopover, setShowPopover] = useState(false);
  const hasUnmounted = useRef(false);

  useEffect(() => {
    return () => {
      hasUnmounted.current = true;
    };
  }, []);

  const handleCancel = useCallback(() => {
    if (typeof onVisibleChange === 'function') {
      onVisibleChange(false);
    } else {
      setShowPopover(false);
    }
  }, [onVisibleChange]);

  const popoverContent = useMemo(() => {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <Icon type="guanbi" className={styles.close} onClick={handleCancel} />
        </div>
        <div className={classnames(styles.content)}>{content}</div>
        {onOk && (
          <div className={styles.footer}>
            <AsyncButton type="primary" size="large" onClick={onOk}>
              {okText}
            </AsyncButton>
          </div>
        )}
      </div>
    );
  }, [content, handleCancel, okText, onOk, title]);

  // 受控模式下由外层接管
  const isControlled = typeof onVisibleChange === 'function';

  return (
    <Popover
      trigger={trigger}
      visible={isControlled ? visible : showPopover}
      getPopupContainer={getPopupContainer}
      onVisibleChange={isControlled ? onVisibleChange : setShowPopover}
      content={popoverContent}
      destroyTooltipOnHide
      placement={placement}
      className={styles.popover}
    >
      {children}
    </Popover>
  );
}

export default React.memo(EnnPopover);
