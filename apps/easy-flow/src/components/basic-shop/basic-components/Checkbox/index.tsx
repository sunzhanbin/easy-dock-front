import React, { memo, useMemo } from 'react';
import { Checkbox } from 'antd';
import { SelectOptionItem } from '@/type';
import { CheckboxGroupProps } from 'antd/lib/checkbox';

const CheckboxComponent = (props: CheckboxGroupProps & { readOnly: boolean; optionList: SelectOptionItem }) => {
  const { optionList, readOnly, onChange } = props;
  const options = useMemo(() => {
    return (optionList?.content || []).map((item) => item.value);
  }, [optionList]);
  return <Checkbox.Group disabled={readOnly} options={options} onChange={onChange}></Checkbox.Group>;
};

export default memo(CheckboxComponent);
