import { FC, memo, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import DesignZone from './design-zone';
import ToolBox from './toolbox';
import EditZone from './edit-zone';
import { DragDropContext, DraggableLocation, DropResult } from 'react-beautiful-dnd';
import { store } from '@app/store';
import { moveRow, comAdded, setLayout, setById, selectField, setIsDirty } from './formdesign-slice';
import { ComponentConfig, ConfigItem, FieldType, FormField, FormFieldMap, TConfigItem, TConfigMap } from '@/type';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { dirtySelector, selectedFieldSelector } from './formzone-reducer';
import { axios } from '@/utils';
import { Prompt, useHistory } from 'react-router-dom';
import { Popconfirm } from 'antd';
import styles from './index.module.scss';

const FormDesign: FC<{}> = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const selectedField = useAppSelector(selectedFieldSelector);
  const isDirty = useAppSelector(dirtySelector);
  const { bpmId: subAppId } = useParams<{ bpmId: string }>();
  const [isShowTip, setIsShowTip] = useState<boolean>(false);
  const [forceLeave, setForceLeave] = useState<boolean>(false);
  const [pathName, setPathName] = useState<string>('');
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
      } else {
        dispatch(setById({ byId: {} }));
        dispatch(setLayout({ layout: [] }));
      }
      dispatch(setIsDirty({ isDirty: false }));
    });
  }, [subAppId]);
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
  const handleConfirmLeave = useCallback(
    (location) => {
      if (forceLeave) {
        return true;
      }
      setPathName(location.pathname);
      setIsShowTip(true);
      return false;
    },
    [forceLeave, setPathName, setIsShowTip],
  );
  const handleOk = useCallback(() => {
    setForceLeave(true);
    setIsShowTip(false);
    setTimeout(() => {
      pathName && history.push(pathName);
    }, 0);
  }, [pathName, history, setForceLeave, setIsShowTip]);
  const handleCancel = useCallback(() => {
    setIsShowTip(false);
  }, [setIsShowTip]);
  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart} onDragUpdate={onDragUpdate}>
      <Prompt when={isDirty} message={handleConfirmLeave} />
      <Popconfirm
        title="当前表单尚未保存,请确认是否离开?"
        visible={isShowTip}
        onConfirm={handleOk}
        onCancel={handleCancel}
        overlayClassName="pop_tip"
      ></Popconfirm>
      {isShowTip && <div className="mask"></div>}
      <div className={styles.container}>
        <ToolBox></ToolBox>
        <DesignZone></DesignZone>
        {selectedField ? <EditZone></EditZone> : null}
      </div>
    </DragDropContext>
  );
};

export default memo(FormDesign);
