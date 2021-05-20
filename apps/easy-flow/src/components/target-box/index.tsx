import React, { FC, memo, useCallback } from 'react';
import styled from 'styled-components';
import { store } from '@app/store';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/app/hooks';
import { comAdded } from '../../features/bpm-editor/form-design/formdesign-slice';
import { configSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { FieldType, FormField } from '@/type';

const TargetBoxContainer = styled.div`
  flex: 0 0 98px;
  height: 36px;
  line-height:36px;
  align-items: center;
  margin-top: 12px;
  cursor: pointer;
  
  .iconfont{
    margin:0 8px;
    color: #aaaeb3;
  }
  .component_name{
    width: 56px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  &:hover{
    background-image: url('https://file.qingflow.com/assets/widget/cover.png');
    background-size: 98px 36px;
  }
`;


const TargetBox: FC<{ icon: string, displayName: string, type: FieldType }> = ({ icon, displayName, type }) => {
  const dispatch = useDispatch();
  const configMap = useAppSelector(configSelector);
  const addComponent = useCallback(() => {
    const formDesign = store.getState().formDesign;
    const com = { ...configMap[type] };
    const rowIndex = formDesign?.layout?.length || -1;
    dispatch(comAdded((com as FormField), rowIndex + 1));
  }, [type])
  return (
    <TargetBoxContainer onClick={addComponent}>
      <span className={`iconfont ${icon}`}></span>
      <span className="component_name">{displayName}</span>
    </TargetBoxContainer>
  );
};

export default memo(TargetBox);
