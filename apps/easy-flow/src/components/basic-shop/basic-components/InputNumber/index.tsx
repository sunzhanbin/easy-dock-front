import { memo, useMemo } from 'react';
import { InputNumber } from 'antd';
import { Icon } from '@common/components';
import { InputNumberProps } from 'antd/lib/input-number';
import styles from './index.module.scss';

const TextareaComponent = (props: InputNumberProps) => {
  const { defaultValue, readOnly, onChange } = props;
  const propList = useMemo(() => {
    const prop: { [k: string]: string | number | boolean | undefined | Function } = {
      size: 'large',
      placeholder: '请输入',
      readOnly: readOnly,
      onChange: onChange,
    };
    if (defaultValue) {
      prop.defaultValue = defaultValue;
    }
    const result = Object.assign({}, props, prop);
    delete result.fieldName;
    delete result.colSpace;
    return result;
  }, [defaultValue, readOnly, props, onChange]);

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

export default memo(TextareaComponent);
