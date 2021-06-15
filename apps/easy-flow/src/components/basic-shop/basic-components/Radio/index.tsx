import React, { memo, useMemo } from 'react';
import { Radio } from 'antd';
import { SelectOptionItem } from '@/type';
import { RadioGroupProps } from 'antd/lib/radio';

const RadioComponent = (props: RadioGroupProps & { readOnly: boolean; dataSource: SelectOptionItem }) => {
  const { dataSource, readOnly, onChange } = props;
  const options = useMemo(() => {
    return dataSource?.data || [];
  }, [dataSource]);
  const propList = useMemo(() => {
    return Object.assign({}, props, {
      disabled: readOnly,
      onChange: onChange as Function,
    });
  }, [readOnly, props, onChange]);
  return (
    <Radio.Group {...propList}>
      {options.map(({ key, value }) => (
        <Radio value={key} key={key}>
          {value}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default memo(RadioComponent);
