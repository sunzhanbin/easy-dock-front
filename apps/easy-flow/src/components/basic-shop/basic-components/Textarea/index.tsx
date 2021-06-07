import React, { memo, useMemo } from 'react';
import { useLocation } from 'react-router';
import { Input } from 'antd';
import { MultipleTextField } from '@/type';

const { TextArea } = Input;

const TextareaComponent = (props: MultipleTextField) => {
  const location = useLocation();
  const { defaultValue, readonly } = props;
  const propList = useMemo(() => {
    const props: { [k: string]: string | number | boolean | undefined } = {
      rows: 4,
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
  return <TextArea {...propList} />;
};

export default memo(TextareaComponent);
