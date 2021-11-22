import { FC, memo, useEffect } from 'react';
import { useParams } from 'react-router';
import DesignZone from './design-zone';
import ToolBox from './toolbox';
import EditZone from './edit-zone';
import {
  setLayout,
  setById,
  selectField,
  setIsDirty,
  setErrors,
  setFormRules,
  setPropertyRules,
} from './formdesign-slice';
import { ComponentConfig, ConfigItem, FieldType, FormFieldMap } from '@/type';
import { useAppDispatch } from '@/app/hooks';
import { axios } from '@/utils';
import styles from './index.module.scss';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const FormDesign: FC<{}> = () => {
  const dispatch = useAppDispatch();
  const { bpmId: subAppId } = useParams<{ bpmId: string }>();

  useEffect(() => {
    // 初始化表单数据
    axios.get(`/form/${subAppId}`).then((res) => {
      const { meta } = res.data;
      if (meta) {
        const { layout, components, formRules, propertyRules } = meta;
        const byId: { [k: string]: ConfigItem } = {};
        const selectFieldId = (layout.length > 0 && layout[0].length > 0 && layout[0][0]) || '';
        // 解析控件属性配置
        components.forEach(({ config, props }: ComponentConfig) => {
          const { id } = config;
          const type = byId[id]?.type || '';
          const componentConfig: ConfigItem = { type, id };
          const excludeKeys = ['version', 'rules', 'canSubmit'];
          Object.keys(props).forEach((key) => {
            componentConfig[key] = props[key];
          });
          Object.keys(config).forEach((key) => {
            if (!excludeKeys.includes(key)) {
              componentConfig[key] = config[key];
            }
          });
          byId[id] = componentConfig;
        });
        dispatch(setFormRules({ formRules }));
        dispatch(setPropertyRules({ propertyRules }));
        dispatch(setById({ byId: byId as FormFieldMap }));
        dispatch(setLayout({ layout }));
        selectFieldId && dispatch(selectField({ id: selectFieldId }));
      } else {
        dispatch(setFormRules({ formRules: [] }));
        dispatch(setPropertyRules({ propertyRules: [] }));
        dispatch(setById({ byId: {} }));
        dispatch(setLayout({ layout: [] }));
        dispatch(selectField({ id: '' }));
      }
      dispatch(setErrors({ errors: [] }));
      dispatch(setIsDirty({ isDirty: false }));
    });
  }, [subAppId, dispatch]);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className={styles.container}>
          <ToolBox></ToolBox>
          <DesignZone></DesignZone>
          <EditZone></EditZone>
        </div>
      </DndProvider>
    </>
  );
};

export default memo(FormDesign);
