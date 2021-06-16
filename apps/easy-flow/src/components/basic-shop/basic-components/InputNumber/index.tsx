import { memo, useMemo } from 'react';
import { useLocation } from 'react-router';
import { InputNumber } from 'antd';
import { Icon } from '@common/components';
import { InputNumberProps } from 'antd/lib/input-number';
import { useRouteMatch } from 'react-router-dom';
import styles from './index.module.scss';

const TextareaComponent = (props: InputNumberProps) => {
  const location = useLocation();
  const match = useRouteMatch();
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
      if (location.pathname === `${match.url}`) {
        prop.value = defaultValue;
      }
    }
    return Object.assign({}, props, prop);
  }, [defaultValue, readOnly, location, props, match, onChange]);

  return (
    <div className={styles.container}>
      <div className={styles.number_container}>
        <div className={styles.icon}>
          <Icon className={styles.iconfont} type="shuzi123" />
        </div>
        <InputNumber {...propList} />
      </div>
    </div>
  );
};

export default memo(TextareaComponent);
