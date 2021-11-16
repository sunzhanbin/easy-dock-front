import { memo, useMemo } from 'react';
import { InputNumber } from 'antd';
import { Icon } from '@common/components';
import { InputNumberProps } from 'antd/lib/input-number';
import styles from './index.module.scss';

const InputNumberComponent = (props: InputNumberProps & { scope?: { min: number; max: number } }) => {
  const { defaultValue, onChange, precision, scope } = props;
  const propList = useMemo(() => {
    const prop: { [k: string]: string | number | boolean | undefined | Function } = {
      size: 'large',
      placeholder: '请输入',
      max: Number.MAX_SAFE_INTEGER,
      min: Number.MIN_SAFE_INTEGER,
      onChange: onChange,
    };
    if (defaultValue) {
      prop.defaultValue = defaultValue;
    }
    precision && (prop.precision = precision);
    if (scope) {
      prop.min = scope.min;
      prop.max = scope.max;
    }
    const result = Object.assign({}, props, prop);
    delete result.fieldName;
    delete result.colSpace;
    delete result.defaultValue;
    delete result.defaultNumber;
    return result;
  }, [defaultValue, props, precision, scope, onChange]);

  return (
    <div className={styles.container}>
      <div className={styles.number_container}>
        <div className={styles.icon}>
          <Icon className={styles.iconfont} type="shuzi123" />
        </div>
        <InputNumber {...propList} key={String(defaultValue)} />
      </div>
    </div>
  );
};

export default memo(InputNumberComponent);
