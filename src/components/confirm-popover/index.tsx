import React, { useCallback, useMemo, useRef, useState } from 'react';
import Icon from '@components/icon';
import classnames from 'classnames';
import { Button, Popover } from 'antd';
import { AbstractTooltipProps } from 'antd/lib/tooltip';
import styles from './index.module.scss';

interface PopoverConfirmProps {
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

function PopoverConfirm(props: PopoverConfirmProps) {
  const { title, children, okText = '确认', onOk, content, placement, trigger = 'click' } = props;
  const [loading, setLoading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const containerRef = useRef(null);
  const handleOkClick = useCallback(async () => {
    if (!onOk) {
      return;
    }

    const okPromise = onOk();

    if (!okPromise || !okPromise.then) {
      return;
    }

    setLoading(true);

    try {
      await okPromise;

      // 成功后关闭popover
      if (containerRef.current) {
        setShowPopover(false);
      }
    } finally {
      // 防止卸载后继续setstate
      if (containerRef.current) {
        setLoading(false);
      }
    }
  }, [onOk]);

  const handleCancel = useCallback(() => {
    setShowPopover(false);
  }, []);

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
            <Button type="primary" size="large" loading={loading} onClick={handleOkClick}>
              {okText}
            </Button>
          </div>
        )}
      </div>
    );
  }, [content, handleOkClick, handleCancel, loading, okText, onOk, title]);

  return (
    <Popover
      trigger={trigger}
      visible={showPopover}
      getPopupContainer={getPopupContainer}
      onVisibleChange={setShowPopover}
      content={popoverContent}
      destroyTooltipOnHide
      placement={placement}
      className={styles.popover}
    >
      <div className={styles.content} ref={containerRef}>
        {children}
      </div>
    </Popover>
  );
}

export default React.memo(PopoverConfirm);
