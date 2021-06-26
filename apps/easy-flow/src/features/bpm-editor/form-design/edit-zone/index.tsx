import { memo, useEffect, useState, useMemo, useCallback } from 'react';
import FormEditor from '@/components/panel-components/form-editor';
import { store } from '@app/store';
import { editProps } from '../formdesign-slice';
import { FieldType, SchemaConfigItem } from '@/type';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { componentPropsSelector, selectedFieldSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import styles from './index.module.scss';

const EditZone = () => {
  const dispatch = useAppDispatch();
  const selectedField = useAppSelector(selectedFieldSelector);
  const byId = useAppSelector(componentPropsSelector);
  const [title, setTitle] = useState<string>('');
  const [editList, setEditList] = useState<SchemaConfigItem[]>([]);
  useEffect(() => {
    setTimeout(() => {
      const formDesign = store.getState().formDesign;
      const filedType = formDesign.selectedField?.split('_')[0] || '';
      if (filedType) {
        const editConfig = formDesign.schema[filedType as FieldType]?.config;
        const baseInfo = formDesign.schema[filedType as FieldType]?.baseInfo;
        setEditList(editConfig as SchemaConfigItem[]);
        setTitle(baseInfo?.name as string);
      }
    }, 0);
  }, [selectedField, byId]);
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
  const renderTitle = useMemo(() => <div className={styles.edit_title}>{title}</div>, [title]);
  return (
    <div className={styles.container}>
      {selectedField ? (
        <>
          {renderTitle}
          <FormEditor config={editList} initValues={byId[selectedField]} onSave={onSave} componentId={selectedField} />
        </>
      ) : null}
    </div>
  );
};

export default memo(EditZone);
