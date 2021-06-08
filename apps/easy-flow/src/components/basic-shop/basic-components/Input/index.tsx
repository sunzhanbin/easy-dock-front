import React, { memo, useMemo } from 'react';
import { useLocation } from 'react-router';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';

const InputComponent = (props: InputProps & { isUniq: boolean }) => {
  const { defaultValue, readOnly, isUniq, onChange } = props;
  const location = useLocation();
  const propList = useMemo(() => {
    const prop: { [k: string]: string | boolean | number | undefined | null | Function } = {
      size: 'large',
      placeholder: '请输入',
      readOnly: readOnly,
      isUniq: isUniq,
      onChange: onChange,
    };
    if (defaultValue) {
      prop.defaultValue = defaultValue as string;
      if (location.pathname === '/form-design') {
        prop.value = defaultValue as string;
      }
    }
    return Object.assign({}, props, prop);
  }, [defaultValue, readOnly, isUniq, location, props, onChange]);
  return <Input {...propList} />;
};

export default memo(InputComponent);
