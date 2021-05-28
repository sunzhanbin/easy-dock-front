import React, { memo } from 'react';
import styled from 'styled-components';
import { Input } from 'antd';
import { SingleTextField } from '@/type';

const InputComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
`;

const InputComponent = (props: SingleTextField & { id: string }) => {
  const { label, defaultValue, tip } = props;
  return (
    <InputComponentContainer>
      <div className="label_container">
        <div className="label">{label}</div>
        <div className="tip">{tip}</div>
      </div>
      <Input value={defaultValue} size="large" />
    </InputComponentContainer>
  );
};

export default memo(InputComponent);
