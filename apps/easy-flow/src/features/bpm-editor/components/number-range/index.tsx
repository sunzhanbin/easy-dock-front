import { memo, useState, useCallback } from 'react';
import { InputNumber } from 'antd';
import classnames from 'classnames';
import styles from './index.module.scss';

interface EditProps {
  className?: string;
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
}

const NumberRange = ({ className, value, onChange }: EditProps) => {
  const [minNumber, setMinNumber] = useState<number | undefined>(() => {
    if (value && value.length > 0) {
      return value[0];
    }
    return undefined;
  });
  const [maxNumber, setMaxNumber] = useState<number | undefined>(() => {
    if (value && value.length > 1) {
      return value[1];
    }
    return undefined;
  });
  const changeMinNumber = useCallback(
    (e) => {
      if (e !== null && e !== undefined) {
        setMinNumber(e);
        if (maxNumber) {
          onChange && onChange([e, maxNumber]);
        }
      }
    },
    [maxNumber, onChange],
  );
  const changeMaxNumber = useCallback(
    (e) => {
      if (e !== null && e !== undefined) {
        setMaxNumber(e);
        if (minNumber) {
          onChange && onChange([minNumber, e]);
        }
      }
    },
    [minNumber, onChange],
  );
  return (
    <div className={classnames(styles.numberRange, className ? className : '')}>
      <InputNumber
        className={styles.min}
        placeholder="最小值"
        size="large"
        max={maxNumber || undefined}
        defaultValue={minNumber}
        onChange={changeMinNumber}
      />
      <InputNumber
        className={styles.max}
        placeholder="最大值"
        size="large"
        min={minNumber || undefined}
        defaultValue={maxNumber}
        onChange={changeMaxNumber}
      />
    </div>
  );
};

export default memo(NumberRange);
