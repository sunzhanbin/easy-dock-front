import { memo, useMemo } from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';

const InputComponent = (props: InputProps & { unique: boolean }) => {
  const { defaultValue, unique, onChange } = props;
  const propList = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const prop: { [k: string]: string | boolean | number | undefined | null | Function } = {
      size: 'large',
      placeholder: '请输入',
      maxLength: 200, //最大长度200 v1.0.0暂定
      unique: String(unique),
      onChange: onChange,
    };
    if (defaultValue) {
      prop.defaultValue = defaultValue as string;
    }
    const result = Object.assign({}, props, prop);
    delete result.fieldName;
    delete result.colSpace;
    return result;
  }, [defaultValue, unique, props, onChange]);
  return <Input {...propList} key={defaultValue as string} />;
};

export default memo(InputComponent);
