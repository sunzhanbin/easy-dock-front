import React, { memo, useEffect, useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import FormEditor from '@/components/panel-components/FormEditor';
import { store } from '@app/store';
import { useDispatch } from 'react-redux';
import { editProps } from '../formdesign-slice';
import { FieldType, FormField, SchemaConfigItem } from '@/type';

const EditZoneContainer = styled.div`
    flex: 0 0 265px;
    height: calc(100vh - 64px);
    background: #fff;
    padding: 20px;
    overflow-y:auto;
`


const EditZone = () => {
    const dispatch = useDispatch();
    const [selectId, setSelectId] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [editList, setEditList] = useState<SchemaConfigItem[]>([]);
    const [config, setConfig] = useState<FormField | null>(null);
    useEffect(() => {
        store.subscribe(() => {
            const formDesign = store.getState().formDesign;
            const filedType = formDesign.selectedField?.split('_')[0] || '';
            if (filedType) {
                const editConfig = formDesign.schema[(filedType as FieldType)]?.config;
                const baseInfo = formDesign.schema[(filedType as FieldType)]?.baseInfo;
                setEditList((editConfig as SchemaConfigItem[]));
                setTitle((baseInfo?.name as string));
                setSelectId((formDesign.selectedField as string));
                setConfig(formDesign.byId[(formDesign.selectedField as string)]);
            } else {
                setSelectId('');
            }
        })
    }, []);
    const onSave = useCallback((values) => {
        dispatch(editProps({ id: selectId, config: values }));
    }, [selectId]);
    const renderTitle = useMemo(() => (
        <div className="edit_title">{title}</div>
    ), [title])
    return (
        <EditZoneContainer>
            {
                selectId
                    ? <>
                        {renderTitle}
                        <FormEditor config={editList} initValues={(config as FormField)} onSave={onSave} componentId={selectId} />
                    </> : null
            }
        </EditZoneContainer>
    )
}

export default memo(EditZone);