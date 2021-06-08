import React, { memo, useMemo } from 'react';
import { useLocation } from 'react-router';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';

const InputComponent = (props: InputProps) => {
  const { defaultValue, readOnly, onChange } = props;
  const location = useLocation();
  const propList = useMemo(() => {
    const props: { [k: string]: string | boolean | number | undefined | null } = {
      size: 'large',
      placeholder: '请输入',
      readOnly: readOnly,
    };
    if (defaultValue) {
      props.defaultValue = defaultValue as string;
      if (location.pathname === '/form-design') {
        props.value = defaultValue as string;
      }
    }
    return props;
  }, [defaultValue, readOnly, location]);
  return <Input {...propList} onChange={onChange} />;
};

export default memo(InputComponent);
