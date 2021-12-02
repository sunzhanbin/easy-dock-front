import { memo, useMemo } from 'react';
import { InputNumber } from 'antd';
import { Icon } from '@common/components';
import { InputNumberProps } from 'antd/lib/input-number';
import styles from './index.module.scss';
import { InputNumberField } from '@type';

const InputNumberComponent = (
  props: InputNumberProps & {
    decimal?: InputNumberField['decimal'];
    numlimit?: InputNumberField['numlimit'];
  } & {
    defaultNumber?: any;
  },
) => {
  const { onChange, decimal, numlimit, defaultNumber } = props;
  const propList = useMemo(() => {
    const prop: { [k: string]: string | number | boolean | undefined | Function } = {
      size: 'large',
      placeholder: '请输入',
      max: Number.MAX_SAFE_INTEGER,
      min: Number.MIN_SAFE_INTEGER,
      onChange: onChange,
    };
    decimal?.enable && (prop.precision = decimal.precision);
    if (numlimit?.numrange) {
      prop.min = numlimit.numrange.min;
      prop.max = numlimit.numrange.max;
    }
    if (defaultNumber?.customData) {
      prop.defaultValue = defaultNumber?.customData as string;
    }
    const result = Object.assign({}, props, prop);
    delete result.fieldName;
    delete result.colSpace;
    delete result.defaultNumber;
    delete result.decimal;
    delete result.numlimit;
    delete result.numrange;
    return result;
  }, [props, decimal, numlimit, onChange]);
  return (
    <div className={styles.container}>
      <div className={styles.number_container}>
        <div className={styles.icon}>
          <Icon className={styles.iconfont} type="shuzi123" />
        </div>
        <InputNumber {...propList} key={String(props.id)} />
      </div>
    </div>
  );
};

export default memo(InputNumberComponent);
