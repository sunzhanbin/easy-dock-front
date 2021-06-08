import React, { memo, useMemo } from 'react';
import { useLocation } from 'react-router';
import { Input } from 'antd';
import { TextAreaProps } from 'antd/lib/input';

const { TextArea } = Input;

const TextareaComponent = (props: TextAreaProps) => {
  const location = useLocation();
  const { defaultValue, readOnly, onChange } = props;
  const propList = useMemo(() => {
    const prop: { [k: string]: string | number | boolean | undefined | Function } = {
      rows: 4,
      size: 'large',
      placeholder: '请输入',
      readOnly: readOnly,
      onChange: onChange,
    };
    if (defaultValue) {
      prop.defaultValue = defaultValue as string;
      if (location.pathname === '/form-design') {
        prop.value = defaultValue as string;
      }
    }
    return Object.assign({}, props, prop);
  }, [defaultValue, readOnly, location, props, onChange]);
  return <TextArea {...propList} />;
};

export default memo(TextareaComponent);
