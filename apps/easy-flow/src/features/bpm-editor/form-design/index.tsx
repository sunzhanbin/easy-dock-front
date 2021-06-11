import { FC, memo, useCallback, useEffect } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import DesignZone from './design-zone';
import ToolBox from './toolbox';
import EditZone from './edit-zone';
import { DragDropContext, DraggableLocation, DropResult } from 'react-beautiful-dnd';
import { store } from '@app/store';
import { moveRow, comAdded, setLayout, setById, selectField } from './formdesign-slice';
import { ComponentConfig, ConfigItem, FieldType, FormField, FormFieldMap, TConfigItem, TConfigMap } from '@/type';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectedFieldSelector } from './formzone-reducer';
import { axios } from '@/utils';

const WorkbenchContainer = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  background-color: rgb(245, 245, 247);
`;

const FormDesign: FC<{}> = () => {
  const dispatch = useAppDispatch();
  const { bpmId: subAppId } = useParams<{ bpmId: string }>();
  useEffect(() => {
    // 初始化表单数据
    axios.get(`/form/${subAppId}`).then((res) => {
      const { meta } = res.data;
      if (meta) {
        const { layout, components } = meta;
        const byId: { [k: string]: ConfigItem } = {};
        const selectFieldId = (layout.length > 0 && layout[0].length > 0 && layout[0][0]) || '';
        components.forEach(({ config, props }: ComponentConfig) => {
          const { id } = config;
          const componentConfig: ConfigItem = {};
          const excludeKeys = ['id', 'type', 'version', 'rules', 'canSubmit'];
          Object.keys(config).forEach((key) => {
            if (!excludeKeys.includes(key)) {
              componentConfig[key] = config[key];
            }
          });
          Object.keys(props).forEach((key) => {
            componentConfig[key] = props[key];
          });
          byId[id as string] = componentConfig;
        });
        dispatch(setById({ byId: byId as FormFieldMap }));
        dispatch(setLayout({ layout }));
        selectFieldId && dispatch(selectField({ id: selectFieldId }));
      }
    });
  }, [subAppId]);
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
