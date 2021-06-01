import React, { memo } from 'react';
import styled from 'styled-components';
import { Input } from 'antd';
import { SingleTextField } from '@/type';

const { TextArea } = Input;

const TextareaComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
`;

const TextareaComponent = (props: SingleTextField & { id: string }) => {
  const { label, defaultValue, tip } = props;

  return (
    <TextareaComponentContainer>
      <div className="label_container">
        <div className="label">{label}</div>
        <div className="tip">{tip}</div>
      </div>
      <TextArea rows={4} value={defaultValue} defaultValue={defaultValue} size="large" />
    </TextareaComponentContainer>
  );
};

export default memo(TextareaComponent);
