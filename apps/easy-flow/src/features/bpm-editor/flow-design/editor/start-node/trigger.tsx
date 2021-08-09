import { memo } from 'react';
import { Space, Button } from 'antd';
import classnames from 'classnames';
import { TriggerType } from '@type/flow';
import useMemoCallback from '@common/hooks/use-memo-callback';
import styles from './index.module.scss';

function Trigger({ value, onChange }: { value?: TriggerType; onChange?(value: TriggerType): void }) {
  const handleValueChange = useMemoCallback((newValue: TriggerType) => {
    if (newValue === value || !onChange) return;

    onChange(newValue);
  });

  return (
    <Space size={0} className={styles.btns}>
      <Button
        size="large"
        className={classnames(styles.manual, styles.button, {
          [styles.active]: value === TriggerType.MANUAL,
        })}
        onClick={() => handleValueChange(TriggerType.MANUAL)}
      >
        人工发起
      </Button>
      <Button
        size="large"
        // disabled
        className={classnames(styles.timing, styles.button, {
          [styles.active]: value === TriggerType.TIMING,
        })}
        onClick={() => handleValueChange(TriggerType.TIMING)}
      >
        定时发起
      </Button>
      <Button
        size="large"
        disabled
        className={classnames(styles.signal, styles.button, {
          [styles.active]: value === TriggerType.SIGNAL,
        })}
        onClick={() => handleValueChange(TriggerType.SIGNAL)}
      >
        信号发起
      </Button>
    </Space>
  );
}

export default memo(Trigger);
