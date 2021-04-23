import React, { useCallback, useState } from 'react';
import Icon from '@components/icon';
import { Button } from 'antd';
import styles from './index.module.scss';

interface ActionCardProps {
  title: string;
  children: React.ReactNode;
  okText?: string;
  onOk?(): void | Promise<void>;
  onCancel(): void;
}

function ActionCard(props: ActionCardProps) {
  const { title, children, okText = '确认', onOk, onCancel } = props;
  const [loading, setLoading] = useState(false);
  const handleClick = useCallback(async () => {
    if (onOk) {
      const okPromise = onOk();

      if (okPromise && typeof okPromise.then === 'function') {
        setLoading(true);

        try {
          await okPromise;
        } finally {
          setLoading(false);
        }
      }
    }
  }, [onOk]);
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <Icon type="guanbi" className={styles.close} onClick={onCancel} />
      </div>
      <div className={styles.content}>{children}</div>
      <div className={styles.footer}>
        <Button type="primary" loading={loading} onClick={handleClick}>
          {okText}
        </Button>
      </div>
    </div>
  );
}

export default React.memo(ActionCard);
