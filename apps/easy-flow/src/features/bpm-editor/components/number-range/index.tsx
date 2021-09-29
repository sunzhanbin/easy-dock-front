import { memo, useState, useCallback, useEffect } from 'react';
import { InputNumber } from 'antd';
import classnames from 'classnames';
import styles from './index.module.scss';

interface EditProps {
  className?: string;
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
}

const NumberRange = ({ className, value, onChange }: EditProps) => {
  const [minNumber, setMinNumber] = useState<number | undefined>(value && value.length > 0 ? value[0] : undefined);
  const [maxNumber, setMaxNumber] = useState<number | undefined>(value && value.length > 1 ? value[1] : undefined);
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
  useEffect(() => {
    if (value) {
      setMinNumber(value[0]);
      setMaxNumber(value[1]);
    }
  }, [value, setMinNumber, setMaxNumber]);
  return (
    <div className={classnames(styles.numberRange, className ? className : '')}>
      <InputNumber
        className={styles.min}
        placeholder="最小值"
        size="large"
        max={maxNumber || undefined}
        value={minNumber}
        onChange={changeMinNumber}
      />
      <InputNumber
        className={styles.max}
        placeholder="最大值"
        size="large"
        min={minNumber || undefined}
        value={maxNumber}
        onChange={changeMaxNumber}
      />
    </div>
  );
};

export default memo(NumberRange);
