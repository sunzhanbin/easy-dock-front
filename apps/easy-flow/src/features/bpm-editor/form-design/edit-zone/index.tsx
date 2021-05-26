import React, { memo, useEffect, useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import FormEditor from '@/components/panel-components/FormEditor';
import { store } from '@app/store';
import { useDispatch } from 'react-redux';
import { editProps } from '../formdesign-slice';
import { FieldType, FormField, SchemaConfigItem } from '@/type';
import { useAppSelector } from '@/app/hooks';
import { selectedFieldSelector } from '@/features/bpm-editor/form-design/formzone-reducer';

const EditZoneContainer = styled.div`
    flex: 0 0 260px;
    height: calc(100vh - 64px);
    background: #fff;
    padding: 20px 21px;
    overflow-y:auto;
    .edit_title{
        font-size: 18px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 28px;
        margin-bottom: 14px;
    }
`


const EditZone = () => {
    const dispatch = useDispatch();
    const selectedField = useAppSelector(selectedFieldSelector);
    const [title, setTitle] = useState<string>('');
    const [editList, setEditList] = useState<SchemaConfigItem[]>([]);
    const [config, setConfig] = useState<FormField | null>(null);
    useEffect(() => {
        const formDesign = store.getState().formDesign;
        const filedType = formDesign.selectedField?.split('_')[0] || '';
        if (filedType) {
            const editConfig = formDesign.schema[(filedType as FieldType)]?.config;
            const baseInfo = formDesign.schema[(filedType as FieldType)]?.baseInfo;
            setEditList((editConfig as SchemaConfigItem[]));
            setTitle((baseInfo?.name as string));
            setConfig(formDesign.byId[(formDesign.selectedField as string)]);
        }
    }, [selectedField])
    const onSave = useCallback((values) => {
        dispatch(editProps({ id: selectedField, config: values }));
    }, [selectedField]);
    const renderTitle = useMemo(() => (
        <div className="edit_title">{title}</div>
    ), [title])
    return (
        <EditZoneContainer>
            {
                selectedField
                    ? <>
                        {renderTitle}
                        <FormEditor config={editList} initValues={(config as FormField)} onSave={onSave} componentId={selectedField} />
                    </> : null
            }
        </EditZoneContainer>
    )
}

export default memo(EditZone);