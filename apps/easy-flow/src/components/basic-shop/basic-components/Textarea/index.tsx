import { memo, useMemo } from 'react';
import { Input } from 'antd';
import { TextAreaProps } from 'antd/lib/input';

const { TextArea } = Input;

const TextareaComponent = (props: TextAreaProps) => {
  const { defaultValue, onChange } = props;
  const propList = useMemo(() => {
    const prop: { [k: string]: string | number | boolean | undefined | Function } = {
      rows: 4,
      maxLength: 1000, //最大长度200 v1.0.0暂定
      showCount: true,
      size: 'large',
      placeholder: '请输入',
      onChange: onChange,
    };
    if (defaultValue) {
      prop.defaultValue = defaultValue as string;
    }
    const result = Object.assign({}, props, prop);
    delete result.fieldName;
    delete result.colSpace;
    return result;
  }, [defaultValue, props, onChange]);
  return <TextArea {...propList} key={defaultValue as string} />;
};

export default memo(TextareaComponent);
