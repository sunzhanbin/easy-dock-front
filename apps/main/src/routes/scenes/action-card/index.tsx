import React, { useCallback, useRef, useState } from "react";
import Icon from "@components/icon";
import classnames from "classnames";
import { Button } from "antd";
import styles from "./index.module.scss";

interface ActionCardProps {
  title: string;
  children: React.ReactNode;
  okText?: string;
  onOk?(): Promise<void>;
  onCancel(): void;
  contentClassName?: string;
}

function ActionCard(props: ActionCardProps) {
  const { title, children, okText = "确认", onOk, onCancel, contentClassName } = props;
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const handleClick = useCallback(async () => {
    if (onOk) {
      const okPromise = onOk();

      if (okPromise) {
        setLoading(true);

        try {
          await okPromise;
        } finally {
          // 防止卸载后继续setstate
          if (containerRef.current) {
            setLoading(false);
          }
        }
      }
    }
  }, [onOk]);
  return (
    <div className={styles.card} ref={containerRef}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <Icon type="guanbi" className={styles.close} onClick={onCancel} />
      </div>
      <div className={classnames(styles.content, contentClassName)}>{children}</div>
      <div className={styles.footer}>
        <Button type="primary" loading={loading} onClick={handleClick}>
          {okText}
        </Button>
      </div>
    </div>
  );
}

export default React.memo(ActionCard);
