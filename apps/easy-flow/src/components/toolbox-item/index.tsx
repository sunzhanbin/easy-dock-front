import React, { FC } from 'react';
import { getToolboxImageUrl } from '@utils';
import { SchemaItem } from '@type';
import styled from 'styled-components';

const ToolboxItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ToolboxItem: FC<{ schema: SchemaItem }> = ({ schema }) => {
  return (
    <ToolboxItemContainer>
      <img src={getToolboxImageUrl(schema.baseInfo.icon)}></img>
      <div>{schema.baseInfo.name}</div>
    </ToolboxItemContainer>
  );
};
