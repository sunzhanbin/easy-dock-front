import React, { memo, useEffect, useMemo, useState } from 'react';
import { Radio } from 'antd';
import { OptionItem, SelectOptionItem } from '@/type';
import { RadioGroupProps } from 'antd/lib/radio';
import { runtimeAxios } from '@/utils';

const RadioComponent = (props: RadioGroupProps & { readOnly: boolean; dataSource: SelectOptionItem }) => {
  const { dataSource, readOnly, onChange } = props;

  const [options, setOptions] = useState<OptionItem[]>([]);
  useEffect(() => {
    if (dataSource?.type === 'custom') {
      const list = dataSource?.data || [];
      setOptions(list);
    } else {
      const { fieldId, appId } = dataSource || {};
      if (fieldId && appId) {
        runtimeAxios.get(`/subapp/${appId}/form/${fieldId}/data`).then((res) => {
          const list = (res.data?.data || []).map((item: string) => ({ key: item, value: item }));
          setOptions(list);
        });
      }
    }
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
