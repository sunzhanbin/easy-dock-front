import React, { FC, memo } from 'react';
import styled from 'styled-components';
import ToolBoxItem from '@/components/toolbox-item';
import { useAppSelector } from '@app/hooks';
import { toolboxSelector } from './toolbox-reducer';
import Loading from '@components/loading';
import { map } from 'lodash';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const ToolBoxContainer = styled.div`
  width: 288px;
  padding: 25px 24px;
  height: calc(100vh - 64px);
  background: rgba(24, 39, 67, 0.04);
  .component_list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    font-size: 14px;
  }
`;
const ToolboxGroup = styled.div`
  width: 100%;
  .groupTitle {
    height: 22px;
    line-height: 22px;
    font-size: 14px;
    font-weight: 600;
    color: rgba(24, 31, 67, 0.95);
  }
  .componentContainer {
    display: flex;
    align-content: space-around;
    flex-wrap: wrap;
    padding-top: 12px;
    > div {
      margin-right: 12px;
      margin-bottom: 12px;
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
`;

const ToolBox: FC<{}> = () => {
  const components = useAppSelector(toolboxSelector);
  const comGroups = map(components, (value, key) => {
    return (
      <ToolboxGroup key={key}>
        <div className="groupTitle">{key}</div>
        <div className="componentContainer">
          {map(value, (tool, index) => {
            const { name, icon, type } = tool;
            return (
              <Draggable draggableId={type} index={+index} key={name}>
                {(dragProvided) => (
                  <div ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps}>
                    <ToolBoxItem icon={icon} displayName={name} type={type}></ToolBoxItem>
                  </div>
                )}
              </Draggable>
            );
          })}
        </div>
      </ToolboxGroup>
    );
  });
  if (!comGroups) return <Loading></Loading>;
  return (
    <ToolBoxContainer>
      <Droppable droppableId="component_zone">
        {(dropProvided) => (
          <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
            <div>{comGroups}</div>
            {dropProvided.placeholder}
          </div>
        )}
      </Droppable>
    </ToolBoxContainer>
  );
};

export default memo(ToolBox);
