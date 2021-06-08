import React, { memo, useMemo } from 'react';
import { Radio } from 'antd';
import { SelectOptionItem } from '@/type';
import { RadioGroupProps } from 'antd/lib/radio';

const RadioComponent = (props: RadioGroupProps & { readOnly: boolean; optionList: SelectOptionItem }) => {
  const { optionList, readOnly, onChange } = props;
  const options = useMemo(() => {
    return optionList?.content || [];
  }, [optionList]);
  return (
    <Radio.Group disabled={readOnly} onChange={onChange}>
      {options.map(({ key, value }) => (
        <Radio value={key} key={key}>
          {value}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default memo(RadioComponent);
