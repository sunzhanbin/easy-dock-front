import { memo, useMemo } from 'react';
import { Checkbox } from 'antd';
import { OptionItem } from '@/type';
import { CheckboxGroupProps } from 'antd/lib/checkbox';

const CheckboxComponent = (props: CheckboxGroupProps & { options: OptionItem[] }) => {
  const { onChange, options } = props;
  const optionList = useMemo(() => {
    return (options || []).map((item: OptionItem) => item.value);
  }, [options]);
  const propList = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const prop: { [k: string]: string | boolean | string[] | Function } = {
      options: optionList,
      // eslint-disable-next-line @typescript-eslint/ban-types
      onChange: onChange as Function,
    };
    const result = Object.assign({}, props, prop);
    delete result.fieldName;
    delete result.colSpace;
    delete result.dataSource;
    return result;
  }, [optionList, props, onChange]);
  return <Checkbox.Group {...propList}></Checkbox.Group>;
};

export default memo(CheckboxComponent);
