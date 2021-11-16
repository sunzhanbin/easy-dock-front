import { memo, useEffect, useState } from 'react';
import { Form, Switch } from 'antd';
import styles from './index.module.scss';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { AuthType } from '@/type/flow';

interface TimeoutActionProps {
  hasRequired?: boolean;
  value?: 'submit' | 'back' | null;
  onChange?: (val: this['value']) => void;
}

const TimeoutAction = ({ hasRequired = false, value, onChange }: TimeoutActionProps) => {
  const [autoSubmit, setAutoSubmit] = useState<boolean>(value === 'submit');
  const [autoBack, setAutoBack] = useState<boolean>(value === 'back');
  const handleChangeSubmit = useMemoCallback((checked) => {
    setAutoSubmit(checked);
    if (autoBack) {
      setAutoBack(false);
    }
    if (checked) {
      onChange && onChange('submit');
    } else {
      if (!autoBack) {
        onChange && onChange(null);
      }
    }
  });
  const handleChangeBack = useMemoCallback((checked) => {
    setAutoBack(checked);
    if (autoSubmit) {
      setAutoSubmit(false);
    }
    if (checked) {
      onChange && onChange('back');
    } else {
      if (!autoSubmit) {
        onChange && onChange(null);
      }
    }
  });
  useEffect(() => {
    if (hasRequired) {
      handleChangeSubmit(false);
    }
  }, [hasRequired]);
  return (
    <>
      <div className={styles.action}>
        <div className={styles.text}>超时自动通过</div>
        <Switch
          className={styles.switch}
          disabled={hasRequired}
          checked={autoSubmit}
          onChange={handleChangeSubmit}
        ></Switch>
      </div>
      <div className={styles.action}>
        <div className={styles.text}>超时自动驳回</div>
        <Switch className={styles.switch} checked={autoBack} onChange={handleChangeBack}></Switch>
      </div>
    </>
  );
};

export default memo(TimeoutAction);
