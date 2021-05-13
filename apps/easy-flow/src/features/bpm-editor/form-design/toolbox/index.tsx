import { FC, memo, useState } from 'react';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { toolboxSelector } from '../toolbox-reducer';
import { map } from 'lodash';
import ToolboxItem from '@components/toolbox-item';
import Loading from '@components/loading';
import { Draggable } from 'react-beautiful-dnd';

const ToolboxContainer = styled.div`
  width: 275px;
  height: calc(100vh - 157px);
  background: #fff;
`;
const ToolboxGroup = styled.div`
  width: 100%;
  background: #fff;
  padding: 30px 10px;
  .groupTitle {
    font-size: 16px;
    font-weight: 600;
    padding: 0px 10px 20px 10px;
  }
  .componentContainer {
    display: flex;
    justify-content: space-between;
    align-content: space-around;
    padding: 0px 20px;
  }
`;

const Toolbox: FC<{}> = () => {
  const components = useAppSelector(toolboxSelector);
  const comGroups = map(components, (value, key) => {
    return (
      <ToolboxGroup key={key}>
        <div className="groupTitle">{key}</div>
        <div className="componentContainer">
          {map(value, (tool) => {
            const { version, category, ...rest } = tool;
            return <ToolboxItem baseInfo={rest} key={tool.type}></ToolboxItem>;
          })}
        </div>
      </ToolboxGroup>
    );
  });
  if (!comGroups) return <Loading></Loading>;
  return <ToolboxContainer>{comGroups}</ToolboxContainer>;
};

export default memo(Toolbox);
