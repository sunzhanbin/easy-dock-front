import { memo, useMemo } from 'react';
import { Checkbox } from 'antd';
import { OptionItem } from '@/type';
import { CheckboxGroupProps } from 'antd/lib/checkbox';

const CheckboxComponent = (props: CheckboxGroupProps & { readOnly: boolean; options: OptionItem[] }) => {
  const { readOnly, onChange, options } = props;
  const optionList = useMemo(() => {
    return (options || []).map((item: OptionItem) => item.value);
  }, [options]);
  const propList = useMemo(() => {
    const prop: { [k: string]: string | boolean | string[] | Function } = {
      disabled: readOnly,
      options: optionList,
      onChange: onChange as Function,
    };
    return Object.assign({}, props, prop);
  }, [optionList, readOnly, props, onChange]);
  return <Checkbox.Group {...propList}></Checkbox.Group>;
};

export default memo(CheckboxComponent);
