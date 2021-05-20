import { FC, memo, useCallback } from 'react';
import styled from 'styled-components';
import DesignZone from './design-zone';
// import Toolbox from './toolbox';
import ComponentList from './component-list';
import EditZone from './edit-zone';
import { DragDropContext } from 'react-beautiful-dnd';

const WorkbenchContainer = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  background-color: rgb(245, 245, 247);
`;

const FormDesign: FC<{}> = () => {
  const onDragEnd = useCallback(() => { }, []);
  const onDragStart = useCallback(() => { }, []);
  const onDragUpdate = useCallback(() => { }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart} onDragUpdate={onDragUpdate}>
      <WorkbenchContainer>
        <ComponentList></ComponentList>
        <DesignZone></DesignZone>
        <EditZone></EditZone>
      </WorkbenchContainer>
    </DragDropContext>
  );
};

export default memo(FormDesign);
