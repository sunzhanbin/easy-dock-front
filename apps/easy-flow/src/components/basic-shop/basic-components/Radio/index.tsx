import React, { memo, useMemo } from 'react';
import { Radio } from 'antd';
import { RadioField } from '@/type';

const RadioComponent = (props: RadioField) => {
  const { optionList, readonly } = props;
  const options = useMemo(() => {
    return optionList.content;
  }, [optionList]);
  return (
    <Radio.Group disabled={readonly}>
      {options.map(({ key, value }) => (
        <Radio value={key} key={key}>
          {value}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default memo(RadioComponent);
