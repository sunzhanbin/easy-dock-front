import { memo, useEffect, useState, useMemo, useCallback } from 'react';
import CompAttrEditor from '@/features/bpm-editor/components/panel-components/comp-attr-editor';
import FormAttrEditor from '@/features/bpm-editor/components/panel-components/form-attr-editor';
import { editProps, editSubComponentProps, setSubComponentConfig } from '../formdesign-slice';
import { FieldType, FormField, SchemaConfigItem } from '@/type';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  componentPropsSelector,
  formDesignSelector,
  selectedFieldSelector,
  subComponentConfigSelector,
} from '@/features/bpm-editor/form-design/formzone-reducer';
import { Tabs } from 'antd';
import styles from './index.module.scss';
import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';

const defaultNumberConfig = {
  key: 'defaultNumber',
  placeholder: '请输入',
  label: '默认值',
  defaultValue: '',
  type: 'InputNumber',
  direction: 'vertical',
  required: false,
  isProps: false,
};

const { TabPane } = Tabs;

const EditZone = () => {
  const dispatch = useAppDispatch();
  const selectedField = useAppSelector(selectedFieldSelector);
  const formDesign = useAppSelector(formDesignSelector);
  const byId = useAppSelector(componentPropsSelector);
  const subComponentConfig = useAppSelector(subComponentConfigSelector);
  const [title, setTitle] = useState<string>('');
  const [editList, setEditList] = useState<SchemaConfigItem[]>([]);
  const [activeKey, setActiveKey] = useState<string>('1');
  const [componentId, setComponentId] = useState<string>(selectedField);
  const [componentType, setComponentType] = useState<string>('');
  const [initValues, setInitValues] = useState({});
  const fieldType = useMemo<string>(() => {
    if (formDesign.selectedField && byId) {
      return byId?.[formDesign.selectedField]?.type || '';
    }
    return '';
  }, [formDesign.selectedField, byId]);
  useEffect(() => {
    Promise.resolve().then(() => {
      // 编辑子控件
      if (subComponentConfig) {
        const { parentId, type } = subComponentConfig;
        const { label: parentLabel } = byId[parentId] || {};
        let editConfig = formDesign.schema[type as FieldType]?.config;
        editConfig = editConfig ? [...editConfig] : [];
        let newConfig = { ...subComponentConfig };
        // tab内的数字控件默认值不需要公式计算
        if (type === 'InputNumber') {
          const index = editConfig.findIndex((v) => v.key === 'defaultNumber');
          if (subComponentConfig.decimal?.enable) {
            const precision = subComponentConfig.decimal?.precision || 1;
            (defaultNumberConfig as any).precision = precision;
          } else {
            (defaultNumberConfig as any).precision = undefined;
          }
          if (subComponentConfig.numlimit?.enable) {
            const min = subComponentConfig.numlimit?.numrange?.min;
            const max = subComponentConfig.numlimit?.numrange?.max;
            (defaultNumberConfig as any).min = min;
            (defaultNumberConfig as any).max = max;
          } else {
            (defaultNumberConfig as any).min = undefined;
            (defaultNumberConfig as any).max = undefined;
          }
          index > -1 && editConfig.splice(index, 1, defaultNumberConfig as SchemaConfigItem);
          newConfig = {
            ...newConfig,
            defaultNumber: typeof newConfig.defaultNumber === 'number' ? newConfig.defaultNumber : undefined,
          };
        }
        const baseInfo = formDesign.schema[type as FieldType]?.baseInfo;
        setEditList(editConfig as SchemaConfigItem[]);
        setTitle(`${parentLabel} · ${baseInfo?.name}`);
        setInitValues(newConfig);
        setComponentId(subComponentConfig.id);
        setComponentType(subComponentConfig.type);
        return;
      }
      // 编辑控件
      if (fieldType && formDesign.schema) {
        const editConfig = formDesign.schema[fieldType as FieldType]?.config;
        const baseInfo = formDesign.schema[fieldType as FieldType]?.baseInfo;
        setEditList(editConfig as SchemaConfigItem[]);
        setTitle(baseInfo?.name as string);
        setInitValues(byId[selectedField]);
        setComponentId(selectedField);
        setComponentType(fieldType);
      }
    });
  }, [byId, formDesign, subComponentConfig, selectedField, fieldType]);
  useEffect(() => {
    selectedField ? setActiveKey('1') : setActiveKey('2');
  }, [selectedField]);
  const onSave = useMemoCallback((values, isValidate) => {
    if (subComponentConfig) {
      const componentType: FieldType = subComponentConfig.type;
      const editConfig = formDesign.schema[componentType]?.config || [];
      const propKeyList = editConfig.filter((v) => v.isProps).map((v) => v.key);
      const props: { [k: string]: any } = {};
      Object.keys(values).forEach((key) => {
        if (propKeyList.includes(key)) {
          props[key] = values[key];
        }
      });
      dispatch(
        editSubComponentProps({
          parentId: subComponentConfig.parentId,
          config: { ...subComponentConfig, ...values },
          props,
        }),
      );
      return;
    }
    dispatch(
      editProps({
        id: selectedField,
        config: { ...values, type: fieldType, id: selectedField },
        isEdit: true,
        isValidate,
      }),
    );
  });
  const changeTabKey = useCallback((key) => {
    setActiveKey(key);
  }, []);
  const handleBack = useMemoCallback(() => {
    dispatch(setSubComponentConfig({ config: null }));
  });
  const renderTitle = useMemo(() => {
    if (subComponentConfig) {
      return (
        <div className={styles['title_wrap']}>
          <div className={styles.back} onClick={handleBack}>
            <Icon type="fanhui" className={styles.icon} />
          </div>
          <div className={styles.edit_title}>{title}</div>
        </div>
      );
    }
    return <div className={styles.edit_title}>{title}</div>;
  }, [title, subComponentConfig, handleBack]);
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
            initValues={initValues as FormField}
            onSave={onSave}
            componentId={componentId}
            componentType={componentType}
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
