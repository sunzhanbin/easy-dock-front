import { memo, useMemo } from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';

const SerialNumComponent = (props: InputProps & { unique: boolean }) => {
  const { defaultValue, onChange } = props;
  const propList = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const prop: { [k: string]: string | boolean | number | undefined | null | Function } = {
      size: 'large',
      placeholder: '自动生成无需填写',
      onChange: onChange,
      disabled: true,
    };
    if (defaultValue) {
      prop.defaultValue = defaultValue as string;
    }
    const result = Object.assign({}, props, prop);
    delete result.fieldName;
    delete result.colSpace;
    delete result.serialRule;
    return result;
  }, [defaultValue, props, onChange]);
  return <Input key={defaultValue as string} {...propList} />;
};

export default memo(SerialNumComponent);
