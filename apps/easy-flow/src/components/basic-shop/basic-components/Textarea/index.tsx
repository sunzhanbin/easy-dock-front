import { memo, useMemo } from 'react';
import { useLocation } from 'react-router';
import { Input } from 'antd';
import { TextAreaProps } from 'antd/lib/input';
import { useRouteMatch } from 'react-router-dom';

const { TextArea } = Input;

const TextareaComponent = (props: TextAreaProps) => {
  const location = useLocation();
  const match = useRouteMatch();
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
      if (location.pathname === `${match.url}`) {
        prop.value = defaultValue as string;
      }
    }
    return Object.assign({}, props, prop);
  }, [defaultValue, readOnly, location, props, match, onChange]);
  return <TextArea {...propList} />;
};

export default memo(TextareaComponent);
