import React, { memo, useMemo } from 'react';
import styled from 'styled-components';
import { Radio } from 'antd';
import { RadioField } from '@/type';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const RadioComponent = (props: RadioField) => {
  const { label, tip, fieldName, optionList, readonly } = props;
  const options = useMemo(() => {
    return optionList.content;
  }, [optionList]);
  return (
    <Container>
      <div className="label_container">
        <div className="label">{label}</div>
        <div className="tip">{tip}</div>
      </div>
      <Radio.Group disabled={readonly}>
        {options.map(({ key, value }) => (
          <Radio value={key} key={key}>
            {value}
          </Radio>
        ))}
      </Radio.Group>
    </Container>
  );
};

export default memo(RadioComponent);
