import React, { FC, memo } from 'react';
import { getToolboxImageUrl } from '@utils';
import { SchemaItem } from '@type';
import styled from 'styled-components';

const ToolboxItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  > img {
    width: 65px;
  }
  > div {
    text-align: center;
  }
`;

const ToolboxItem: FC<{ baseInfo: Partial<SchemaItem['baseInfo']> }> = ({ baseInfo }) => {
  return (
    <ToolboxItemContainer>
      <img src={getToolboxImageUrl(baseInfo.icon!)}></img>
      <div>{baseInfo.name}</div>
    </ToolboxItemContainer>
  );
};

export default memo(ToolboxItem);
