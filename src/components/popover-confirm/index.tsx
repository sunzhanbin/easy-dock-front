import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Popover, Button } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { AbstractTooltipProps } from 'antd/lib/tooltip';
import { AsyncButton } from '@components';
import styles from './index.module.scss';

interface PopoverProps {
  title: string;
  children: React.ReactNode;
  content?: React.ReactNode;
  okText?: string;
  onConfirm?(): Promise<void> | void;
  placement?: AbstractTooltipProps['placement'];
  trigger?: AbstractTooltipProps['trigger'];
  visible?: boolean;
  onVisibleChange?(visible: boolean): void;
  getPopupContainer?: AbstractTooltipProps['getTooltipContainer'];
}

const defaultGetPopupContainer: AbstractTooltipProps['getTooltipContainer'] = (c) => c;

function EnnPopover(props: PopoverProps) {
  const {
    title,
    children,
    okText = '确认',
    onConfirm,
    content,
    placement,
    trigger = 'click',
    onVisibleChange,
    visible,
    getPopupContainer = defaultGetPopupContainer,
  } = props;
  const [showPopover, setShowPopover] = useState(false);
  const hasUnmounted = useRef(false);

  useEffect(() => {
    return () => {
      hasUnmounted.current = true;
    };
  }, []);

  const handleCancel = useCallback(() => {
    if (onVisibleChange) {
      onVisibleChange(false);
    } else {
      setShowPopover(false);
    }
  }, [onVisibleChange]);

  const handleClickOk = useMemo(() => {
    if (onConfirm) {
      return async () => {
        await onConfirm();

        if (onVisibleChange) {
          onVisibleChange(false);
        } else {
          setShowPopover(false);
        }
      };
    } else {
      return undefined;
    }
  }, [onConfirm, onVisibleChange]);

  const popoverContent = useMemo(() => {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <ExclamationCircleFilled className={styles.icon} />
          <div className={styles.content}>
            <div className={styles.title}>{title}</div>
            {content}
          </div>
        </div>
        <div className={styles.footer}>
          <Button className={styles.cancel} type="text" size="middle" onClick={handleCancel}>
            取消
          </Button>
          <AsyncButton type="primary" size="middle" onClick={handleClickOk}>
            {okText}
          </AsyncButton>
        </div>
      </div>
    );
  }, [content, handleCancel, okText, handleClickOk, title]);

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
