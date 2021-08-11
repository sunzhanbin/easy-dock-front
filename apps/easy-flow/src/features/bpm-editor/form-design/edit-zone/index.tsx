import { memo, useEffect, useState, useMemo, useCallback } from 'react';
import CompAttrEditor from '@/features/bpm-editor/components/panel-components/comp-attr-editor';
import FormAttrEditor from '@/features/bpm-editor/components/panel-components/form-attr-editor';
import { store } from '@app/store';
import { editProps } from '../formdesign-slice';
import { FieldType, SchemaConfigItem } from '@/type';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { componentPropsSelector, selectedFieldSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { Tabs } from 'antd';
import styles from './index.module.scss';

const { TabPane } = Tabs;

const EditZone = () => {
  const dispatch = useAppDispatch();
  const selectedField = useAppSelector(selectedFieldSelector);
  const byId = useAppSelector(componentPropsSelector);
  const [title, setTitle] = useState<string>('');
  const [editList, setEditList] = useState<SchemaConfigItem[]>([]);
  const [activeKey, setActiveKey] = useState<string>('1');
  useEffect(() => {
    setTimeout(() => {
      const formDesign = store.getState().formDesign;
      const filedType = formDesign.selectedField?.split('_')[0] || '';
      if (filedType && formDesign.schema) {
        const editConfig = formDesign.schema[filedType as FieldType]?.config;
        const baseInfo = formDesign.schema[filedType as FieldType]?.baseInfo;
        setEditList(editConfig as SchemaConfigItem[]);
        setTitle(baseInfo?.name as string);
      }
    }, 0);
    selectedField ? setActiveKey('1') : setActiveKey('2');
  }, [selectedField, byId, setActiveKey]);
  const onSave = useCallback(
    (values, isValidate) => {
      dispatch(
        editProps({
          id: selectedField,
          config: { ...values, type: selectedField?.split('_')[0] || '', id: selectedField },
          isEdit: true,
          isValidate,
        }),
      );
    },
    [selectedField, dispatch],
  );
  const changeTabKey = useCallback(
    (key) => {
      setActiveKey(key);
    },
    [setActiveKey],
  );
  const renderTitle = useMemo(() => <div className={styles.edit_title}>{title}</div>, [title]);
  const tabPanelProps = useMemo(() => {
    if (!selectedField) {
      return { disabled: true };
    }
    return null;
  }, [selectedField]);
  return (
    <div className={styles.container}>
      <Tabs activeKey={activeKey} onChange={changeTabKey}>
        <TabPane tab="控件属性" key="1" {...tabPanelProps}>
          {renderTitle}
          <CompAttrEditor
            config={editList}
            initValues={byId[selectedField]}
            onSave={onSave}
            componentId={selectedField}
          />
        </TabPane>
        <TabPane tab="表单属性" key="2">
          <FormAttrEditor />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default memo(EditZone);
