import React, { memo, useMemo } from 'react';
import { Checkbox } from 'antd';
import { SelectOptionItem } from '@/type';
import { CheckboxGroupProps } from 'antd/lib/checkbox';

const CheckboxComponent = (props: CheckboxGroupProps & { readOnly: boolean; optionList: SelectOptionItem }) => {
  const { optionList, readOnly, onChange } = props;
  const options = useMemo(() => {
    return (optionList?.content || []).map((item) => item.value);
  }, [optionList]);
  const propList = useMemo(() => {
    const prop: { [k: string]: string | boolean | string[] | Function } = {
      disabled: readOnly,
      options: options,
      onChange: onChange as Function,
    };
    return Object.assign({}, props, prop);
  }, [options, readOnly, props, onChange]);
  return <Checkbox.Group {...propList}></Checkbox.Group>;
};

export default memo(CheckboxComponent);
