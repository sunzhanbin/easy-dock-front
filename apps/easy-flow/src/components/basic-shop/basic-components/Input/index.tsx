import React, { FC, memo } from "react";
import styled from 'styled-components';
import { Input } from "antd";
import { SingleTextField } from "@/type";

const InputComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width:100%;
  .title{
    display: flex;
    justify-content: space-between;
    padding: 0 0 8px;
    font-weight: 500;
    word-wrap: break-word;
  }
`;

const InputComponent = (props: SingleTextField) => {
  const { title } = props;
  console.info(title, 'title');
  return (
    <InputComponentContainer>
      <div className="title">{title}</div>
      <Input />
    </InputComponentContainer>
  );
};

export default memo(InputComponent);