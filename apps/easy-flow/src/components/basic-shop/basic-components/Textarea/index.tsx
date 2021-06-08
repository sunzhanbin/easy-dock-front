import React, { memo, useMemo } from 'react';
import { useLocation } from 'react-router';
import { Input } from 'antd';
import { TextAreaProps } from 'antd/lib/input';

const { TextArea } = Input;

const TextareaComponent = (props: TextAreaProps) => {
  const location = useLocation();
  const { defaultValue, readOnly, onChange } = props;
  const propList = useMemo(() => {
    const props: { [k: string]: string | number | boolean | undefined } = {
      rows: 4,
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
  return <TextArea {...propList} onChange={onChange} />;
};

export default memo(TextareaComponent);
