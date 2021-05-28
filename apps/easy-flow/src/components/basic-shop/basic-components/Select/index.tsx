import React, { memo } from 'react';
import { Select } from 'antd';
import styled from 'styled-components';
import { SelectField } from '@/type';

const SelectComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const SelectComponent = (props: SelectField & { id: string }) => {
  const { label, defaultValue, tip, multiple, showSearch } = props;
  return (
    <SelectComponentContainer>
      <div className="label_container">
        <div className="label">{label}</div>
        <div className="tip">{tip}</div>
      </div>
      <Select defaultValue={defaultValue} showSearch={showSearch} size="large"></Select>
    </SelectComponentContainer>
  );
};

export default memo(SelectComponent);
