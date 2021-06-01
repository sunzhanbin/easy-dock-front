import React, { memo } from 'react';
import styled from 'styled-components';
import { DatePicker } from 'antd';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
`;

const Date = (props: any) => {
  const { tip, label } = props;
  return (
    <Container>
      <div className="label_container">
        <div className="label">{label}</div>
        <div className="tip">{tip}</div>
      </div>
      <DatePicker />
    </Container>
  );
};
export default memo(Date);
