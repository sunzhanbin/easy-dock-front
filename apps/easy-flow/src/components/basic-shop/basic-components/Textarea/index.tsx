import { memo, useMemo } from 'react';
import { Input } from 'antd';
import { TextAreaProps } from 'antd/lib/input';

const { TextArea } = Input;

const TextareaComponent = (props: TextAreaProps) => {
  const { defaultValue, readOnly, onChange } = props;
  const propList = useMemo(() => {
    const prop: { [k: string]: string | number | boolean | undefined | Function } = {
      rows: 4,
      size: 'large',
      placeholder: '请输入',
      readOnly: readOnly,
      disabled: readOnly,
      onChange: onChange,
    };
    if (defaultValue) {
      prop.defaultValue = defaultValue as string;
    }
    const result = Object.assign({}, props, prop);
    delete result.fieldName;
    delete result.colSpace;
    return result;
  }, [defaultValue, readOnly, props, onChange]);
  return <TextArea {...propList} key={defaultValue as string} />;
};

export default memo(TextareaComponent);
