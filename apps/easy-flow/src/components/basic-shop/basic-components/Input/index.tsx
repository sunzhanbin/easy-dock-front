import { memo, useMemo } from 'react';
import { useLocation } from 'react-router';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import { useRouteMatch } from 'react-router-dom';

const InputComponent = (props: InputProps & { unique: boolean }) => {
  const { defaultValue, readOnly, unique, onChange } = props;
  const location = useLocation();
  const match = useRouteMatch();
  const propList = useMemo(() => {
    const prop: { [k: string]: string | boolean | number | undefined | null | Function } = {
      size: 'large',
      placeholder: '请输入',
      readOnly: readOnly,
      unique: unique,
      onChange: onChange,
    };
    if (defaultValue) {
      prop.defaultValue = defaultValue as string;
      if (location.pathname === `${match.url}`) {
        prop.value = defaultValue as string;
      }
    }
    return Object.assign({}, props, prop);
  }, [defaultValue, readOnly, unique, location, props, match, onChange]);
  return <Input {...propList} />;
};

export default memo(InputComponent);
