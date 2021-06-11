import { FC, memo, useCallback, useEffect } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import DesignZone from './design-zone';
import ToolBox from './toolbox';
import EditZone from './edit-zone';
import { DragDropContext, DraggableLocation, DropResult } from 'react-beautiful-dnd';
import { store } from '@app/store';
import { moveRow, comAdded } from './formdesign-slice';
import { FieldType, FormField, TConfigItem, TConfigMap } from '@/type';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectedFieldSelector } from './formzone-reducer';

const WorkbenchContainer = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  background-color: rgb(245, 245, 247);
`;

const FormDesign: FC<{}> = () => {
  const dispatch = useAppDispatch();
  const selectedField = useAppSelector(selectedFieldSelector);
  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;
      if (destination && source) {
        const { droppableId: targetId, index: targetIndex } = destination as DraggableLocation;
        const { droppableId: sourceId, index: sourceIndex } = source as DraggableLocation;
        if (targetId === 'form_zone' && sourceId === 'form_zone') {
          dispatch(moveRow({ sourceIndex, targetIndex }));
        }
        if (targetId === 'form_zone' && sourceId === 'component_zone') {
          const schema = store.getState().formDesign.schema;
          const configMap: TConfigMap = {};
          if (schema) {
            const keys: string[] = Object.keys(schema);
            keys.forEach((key) => {
              const configItem: TConfigItem = { type: key };
              schema[key as FieldType]?.config.forEach(({ key, defaultValue }) => {
                configItem[key] = defaultValue;
              });
              configMap[key as FieldType] = configItem;
            });
            const com = { ...configMap[draggableId] };
            dispatch(comAdded(com as FormField, targetIndex));
          }
        }
      }
    },
    [dispatch],
  );
  const onDragStart = useCallback(() => {}, []);
  const onDragUpdate = useCallback(() => {}, []);

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart} onDragUpdate={onDragUpdate}>
      <WorkbenchContainer>
        <ToolBox></ToolBox>
        <DesignZone></DesignZone>
        {selectedField ? <EditZone></EditZone> : null}
      </WorkbenchContainer>
    </DragDropContext>
  );
};

export default memo(FormDesign);
