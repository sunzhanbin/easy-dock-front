import { FC, memo, useCallback } from 'react';
import styled from 'styled-components';
import DesignZone from './design-zone';
import ToolBox from './toolbox';
import EditZone from './edit-zone';
import { DragDropContext, DraggableLocation, DropResult } from 'react-beautiful-dnd';
import { store } from '@app/store';
import { useDispatch } from 'react-redux';
import { moveRow, comAdded } from './formdesign-slice';
import { FieldType, FormField, TConfigItem, TConfigMap } from '@/type';

const WorkbenchContainer = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  background-color: rgb(245, 245, 247);
`;

const FormDesign: FC<{}> = () => {
  const dispatch = useDispatch();
  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (destination && source) {
      const { droppableId: targetId, index: targetIndex } = (destination as DraggableLocation);
      const { droppableId: sourceId, index: sourceIndex } = (source as DraggableLocation);
      if (targetId === 'form_zone' && sourceId === 'form_zone') {
        dispatch(moveRow({ sourceIndex, targetIndex }));
      }
      if (targetId === 'form_zone' && sourceId === 'component_zone') {
        const schema = store.getState().formDesign.schema;
        const configMap: TConfigMap = {};
        if (schema) {
          const keys: string[] = Object.keys(schema);
          keys.forEach(key => {
            const configItem: TConfigItem = { type: key };
            schema[(key as FieldType)]?.config.forEach(({ key, defaultValue }) => {
              configItem[key] = defaultValue;
            })
            configMap[(key as FieldType)] = configItem;
          })
          const com = { ...configMap[draggableId] };
          dispatch(comAdded((com as FormField), targetIndex));
        }
      }
    }
  }, []);
  const onDragStart = useCallback(() => { }, []);
  const onDragUpdate = useCallback(() => { }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart} onDragUpdate={onDragUpdate}>
      <WorkbenchContainer>
        <ToolBox></ToolBox>
        <DesignZone></DesignZone>
        <EditZone></EditZone>
      </WorkbenchContainer>
    </DragDropContext>
  );
};

export default memo(FormDesign);
