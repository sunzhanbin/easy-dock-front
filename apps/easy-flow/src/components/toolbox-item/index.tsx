import React, { FC, memo, useCallback } from 'react';
import styled from 'styled-components';
import { store } from '@app/store';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { configSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { comAdded } from '../../features/bpm-editor/form-design/formdesign-slice';
import { FieldType, FormField } from '@/type';

const ToolBoxItemContainer = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 3px;
  border: 1px solid rgba(24, 31, 67, 0.12);
  text-align: center;
  cursor: pointer;
  &:hover {
    border: 1px solid rgba(24, 31, 67, 0.5);
  }

  .icon_container {
    margin-top: 14px;
    text-align: center;
    .iconfont {
      display: inline-block;
      width: 20px;
      height: 20px;
      font-size: 17px;
      color: #4f5571;
    }
  }
  .component_name {
    font-size: 12px;
    font-weight: 400;
    color: rgba(24, 31, 67, 0.75);
    line-height: 20px;
    margin-top: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

const ToolBoxItem: FC<{ icon: string; displayName: string; type: FieldType }> = ({ icon, displayName, type }) => {
  const dispatch = useAppDispatch();
  const configMap = useAppSelector(configSelector);
  const addComponent = useCallback(() => {
    const formDesign = store.getState().formDesign;
    const com = { ...configMap[type], type };
    const rowIndex = formDesign?.layout?.length || -1;
    dispatch(comAdded(com as FormField, rowIndex + 1));
  }, [type]);
  return (
    <ToolBoxItemContainer onClick={addComponent}>
      <div className="icon_container">
        <span className={`iconfont ${icon}`}></span>
      </div>
      <span className="component_name">{displayName}</span>
    </ToolBoxItemContainer>
  );
};

export default memo(ToolBoxItem);
