import React, { memo, useMemo } from 'react';
import { useLocation } from 'react-router';
import { Select } from 'antd';
import { SelectOptionItem } from '@/type';
import { SelectProps } from 'antd/lib/select';

const { Option } = Select;

const SelectComponent = (
  props: SelectProps<string> & { readOnly: boolean; multiple: boolean; selectOptionList: SelectOptionItem },
) => {
  const { defaultValue, multiple, showSearch, selectOptionList, readOnly, onChange } = props;
  const location = useLocation();
  const optionList = useMemo(() => {
    return selectOptionList?.content || [];
  }, [selectOptionList]);
  const propList = useMemo(() => {
    const prop: { [k: string]: string | boolean } = {
      size: 'large',
      showSearch: showSearch as boolean,
      placeholder: '请选择',
      disabled: readOnly as boolean,
    };
    if (multiple) {
      prop.mode = 'multiple';
    }
    if (defaultValue) {
      prop.defaultValue = defaultValue as string;
      if (location.pathname === '/form-design') {
        prop.value = defaultValue as string;
      }
    }
    return prop;
  }, [defaultValue, multiple, showSearch, readOnly, location]);
  return (
    <Select {...propList} onChange={onChange} style={{ width: '100%' }}>
      {optionList.map(({ key, value }) => (
        <Option value={key} key={key}>
          {value}
        </Option>
      ))}
    </Select>
  );
};

export default memo(SelectComponent);
