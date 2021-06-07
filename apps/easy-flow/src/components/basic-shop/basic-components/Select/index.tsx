import React, { memo, useMemo } from 'react';
import { Select } from 'antd';
import { SelectField } from '@/type';

const { Option } = Select;

const SelectComponent = (props: SelectField & { id: string }) => {
  const { defaultValue, multiple, showSearch, selectOptionList, readonly } = props;
  const optionList = useMemo(() => {
    return selectOptionList?.content || [];
  }, [selectOptionList]);
  const propList = useMemo(() => {
    const prop: { [k: string]: string | boolean } = {
      size: 'large',
      showSearch: showSearch,
      placeholder: '请选择',
      disabled: readonly as boolean,
    };
    if (multiple) {
      prop.mode = 'multiple';
    }
    if (defaultValue) {
      prop.defaultValue = defaultValue as string;
      prop.value = defaultValue as string;
    }
    return prop;
  }, [defaultValue, multiple, showSearch, readonly]);
  return (
    <Select {...propList} style={{ width: '100%' }}>
      {optionList.map(({ key, value }) => (
        <Option value={key} key={key}>
          {value}
        </Option>
      ))}
    </Select>
  );
};

export default memo(SelectComponent);
