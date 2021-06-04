import React, { memo, useMemo } from 'react';
import { Checkbox } from 'antd';
import { CheckboxField } from '@/type';

const CheckboxComponent = (props: CheckboxField) => {
  const { optionList, readonly } = props;
  const options = useMemo(() => {
    return optionList.content.map((item) => item.value);
  }, [optionList]);
  return <Checkbox.Group disabled={readonly} options={options}></Checkbox.Group>;
};

export default memo(CheckboxComponent);
