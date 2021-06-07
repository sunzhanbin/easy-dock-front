import React, { memo, FC } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  .label_container {
    .label {
      font-size: 12px;
      font-weight: 500;
      color: rgba(24, 31, 67, 0.95);
      line-height: 20px;
      margin-bottom: 2px;
    }
    .desc {
      font-size: 12px;
      font-weight: 400;
      color: rgba(24, 31, 67, 0.5);
      line-height: 20px;
      word-break: break-all;
    }
  }
`;

const LabelContent: FC<{ label: string; desc?: string }> = ({ label, desc }) => {
  return (
    <Container>
      <div className="label_container">
        <div className="label">{label}</div>
        <div className="desc">{desc}</div>
      </div>
    </Container>
  );
};

export default memo(LabelContent);
