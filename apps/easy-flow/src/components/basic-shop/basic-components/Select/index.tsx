import React, { memo, useMemo } from 'react';
import { Select } from 'antd';
import styled from 'styled-components';
import { SelectField } from '@/type';

const { Option } = Select;

const SelectComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const SelectComponent = (props: SelectField & { id: string }) => {
  const { label, defaultValue, tip, multiple, showSearch, selectOptionList } = props;
  const optionList = useMemo(() => {
    return selectOptionList?.content || [];
  }, [selectOptionList]);
  const propList = useMemo(() => {
    const prop: { [k: string]: string | boolean } = { size: 'large', showSearch: showSearch, placeholder: '请选择' };
    if (multiple) {
      prop.mode = 'multiple';
    }
    if (defaultValue) {
      prop.defaultValue = defaultValue as string;
    }
    return prop;
  }, [defaultValue, multiple, showSearch]);
  return (
    <SelectComponentContainer>
      <div className="label_container">
        <div className="label">{label}</div>
        <div className="tip">{tip}</div>
      </div>
      <Select {...propList}>
        {optionList.map(({ key, value }) => (
          <Option value={key} key={key}>
            {value}
          </Option>
        ))}
      </Select>
    </SelectComponentContainer>
  );
};

export default memo(SelectComponent);
