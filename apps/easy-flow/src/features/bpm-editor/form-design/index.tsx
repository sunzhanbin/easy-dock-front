import { FC, memo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import DesignZone from './design-zone';
import Toolbox from './toolbox';
import { DragDropContext } from 'react-beautiful-dnd';

const WorkbenchContainer = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  background-color: rgb(245, 245, 247);
`;

const FormDesign: FC<{}> = () => {
  const onDragEnd = useCallback(() => {}, []);
  const onDragStart = useCallback(() => {}, []);
  const onDragUpdate = useCallback(() => {}, []);

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart} onDragUpdate={onDragUpdate}>
      <WorkbenchContainer>
        <Toolbox></Toolbox>
        <DesignZone></DesignZone>
      </WorkbenchContainer>
    </DragDropContext>
  );
};

export default memo(FormDesign);
