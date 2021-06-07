import React, { memo, useMemo } from 'react';
import { useLocation } from 'react-router';
import { Input } from 'antd';
import { SingleTextField } from '@/type';

const InputComponent = (props: SingleTextField & { id: string }) => {
  const { defaultValue, readonly } = props;
  const location = useLocation();
  const propList = useMemo(() => {
    const props: { [k: string]: string | boolean | number | undefined | null } = {
      size: 'large',
      placeholder: '请输入',
      readOnly: readonly,
    };
    if (defaultValue) {
      props.defaultValue = defaultValue;
      if (location.pathname === '/form-design') {
        props.value = defaultValue;
      }
    }
    return props;
  }, [defaultValue, readonly, location]);
  return <Input {...propList} />;
};

export default memo(InputComponent);
