import React, { FC, memo } from "react";
import { Select } from "antd";
import styled from 'styled-components';

const SelectComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .title{
    display: flex;
    justify-content: space-between;
    padding: 0 0 8px;
    font-weight: 500;
    word-wrap: break-word;
  }
`;

const SelectComponent = (props: any) => {
  const { title } = props;
  return (
    <SelectComponentContainer>
      <div className="title">{title}</div>
      <Select />
    </SelectComponentContainer>
  );
};

export default memo(SelectComponent);