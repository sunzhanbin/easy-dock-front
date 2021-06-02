import React, { memo, useMemo } from 'react';
import styled from 'styled-components';
import { Checkbox } from 'antd';
import { CheckboxField } from '@/type';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const CheckboxComponent = (props: CheckboxField) => {
  const { label, tip, fieldName, optionList, readonly } = props;
  const options = useMemo(() => {
    return optionList.content.map((item) => item.value);
  }, [optionList]);
  return (
    <Container>
      <div className="label_container">
        <div className="label">{label}</div>
        <div className="tip">{tip}</div>
      </div>
      <Checkbox.Group disabled={readonly} options={options}></Checkbox.Group>
    </Container>
  );
};

export default memo(CheckboxComponent);
