import React, { memo, useEffect, useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import FormEditor from '@/components/panel-components/form-editor';
import { store } from '@app/store';
import { editProps } from '../formdesign-slice';
import { FieldType, SchemaConfigItem } from '@/type';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { componentPropsSelector, selectedFieldSelector } from '@/features/bpm-editor/form-design/formzone-reducer';

const EditZoneContainer = styled.div`
  flex: 0 0 260px;
  height: calc(100vh - 64px);
  background: #fff;
  padding: 20px 21px;
  overflow-y: auto;
  box-shadow: 0px 6px 24px 0px rgba(24, 31, 67, 0.1);
  .edit_title {
    font-size: 18px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
    margin-bottom: 14px;
  }
`;

const EditZone = () => {
  const dispatch = useAppDispatch();
  const selectedField = useAppSelector(selectedFieldSelector);
  const byId = useAppSelector(componentPropsSelector);
  const [title, setTitle] = useState<string>('');
  const [editList, setEditList] = useState<SchemaConfigItem[]>([]);
  useEffect(() => {
    const formDesign = store.getState().formDesign;
    const filedType = formDesign.selectedField?.split('_')[0] || '';
    if (filedType) {
      const editConfig = formDesign.schema[filedType as FieldType]?.config;
      const baseInfo = formDesign.schema[filedType as FieldType]?.baseInfo;
      setEditList(editConfig as SchemaConfigItem[]);
      setTitle(baseInfo?.name as string);
    }
  }, [selectedField, byId]);
  const onSave = useCallback(
    (values) => {
      dispatch(
        editProps({
          id: selectedField,
          config: { ...values, type: selectedField?.split('_')[0] || '', id: selectedField },
          isEdit: true,
        }),
      );
    },
    [selectedField, dispatch],
  );
  const renderTitle = useMemo(() => <div className="edit_title">{title}</div>, [title]);
  return (
    <EditZoneContainer>
      {selectedField ? (
        <>
          {renderTitle}
          <FormEditor config={editList} initValues={byId[selectedField]} onSave={onSave} componentId={selectedField} />
        </>
      ) : null}
    </EditZoneContainer>
  );
};

export default memo(EditZone);
