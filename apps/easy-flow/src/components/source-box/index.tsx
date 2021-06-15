import { AllComponentType, FormField, MoveConfig, TConfigItem } from '@/type';
import { Tooltip } from 'antd';
import LabelContent from '../label-content';
import { Icon } from '@common/components';
import React, { memo, FC, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { store } from '@app/store';
import {
  moveUp,
  moveDown,
  exchange,
  editProps,
  comAdded,
  comDeleted,
} from '@/features/bpm-editor/form-design/formdesign-slice';
import { useAppDispatch } from '@/app/hooks';
import useLoadComponents from '@/hooks/use-load-components';

const BoxContainer = styled.div`
  cursor: move;
  div {
    &:first-child {
      pointer-events: none;
    }
  }
  &:hover {
    .operation {
      display: block;
    }
  }
  .operation {
    position: absolute;
    top: 0;
    right: 0;
    display: none;
    width: 52px;
    height: 22px;
    background: #8b8fa1;
    border-radius: 0px 3px 0px 3px;
    .iconfont {
      display: inline-block;
      width: 16px;
      height: 16px;
      line-height: 16px;
      font-size: 16px;
      color: #fff;
      cursor: pointer;
      &:first-child {
        margin: 3px 12px 3px 4px;
      }
      &:last-child {
        margin: 3px 4px 3px 0;
      }
    }
  }
  .moveUp,
  .moveDown,
  .moveLeft,
  .moveRight {
    display: none;
    position: absolute;
    z-index: 2;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    background: #ffffff;
    border-radius: 3px;
    border: 1px solid #4c5cdb;
    cursor: pointer;
    .iconfont {
      position: absolute;
      top: 4px;
      left: 2px;
      width: 10px;
      height: 10px;
      line-height: 10px;
      font-size: 10px;
      color: #4c5cdb;
    }
  }
  .moveUp {
    top: -9px;
    left: 50%;
    transform: translateX(-9px);
  }
  .moveDown {
    bottom: -9px;
    left: 50%;
    transform: translateX(-9px);
  }
  .moveLeft {
    top: 50%;
    left: -9px;
    transform: translateY(-9px);
  }
  .moveRight {
    top: 50%;
    right: -9px;
    transform: translateY(-9px);
  }
`;
type Component = React.FC | React.ComponentClass;
const SourceBox: FC<{
  type: string;
  config: FormField;
  id: string;
  moveConfig: MoveConfig;
  rowIndex: number;
}> = ({ type, config, id, moveConfig, rowIndex }) => {
  const dispatch = useAppDispatch();
  // 获取组件源码
  const compSources: Component = useLoadComponents(type as AllComponentType['type']) as Component;
  const propList = useMemo(() => {
    return Object.assign({}, config, { id });
  }, [config, id]);
  const handleCopy = useCallback(() => {
    const formDesign = store.getState().formDesign;
    const com = Object.assign({}, formDesign.byId[id]);
    dispatch(comAdded(com, rowIndex + 1));
  }, [id, rowIndex, dispatch]);
  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch(comDeleted({ id }));
    },
    [id, dispatch],
  );
  const handleMoveUp = useCallback(() => {
    dispatch(moveUp({ id }));
    const formDesign = store.getState().formDesign;
    const rowList = formDesign.layout;
    const componentMap = formDesign.byId;
    const currentRow = rowList[rowIndex - 1];
    const nextRow = rowList[rowIndex];
    // 当前行重新布局
    currentRow.forEach((id) => {
      const config = Object.assign({}, componentMap[id], { colSpace: currentRow.length === 2 ? '2' : '1' });
      dispatch(editProps({ id, config }));
    });
    // 如果有下一行，重新布局
    nextRow &&
      nextRow.forEach((id) => {
        const config = Object.assign({}, componentMap[id], {
          colSpace: nextRow.length === 1 ? '4' : nextRow.length === 2 ? '2' : '1',
        });
        dispatch(editProps({ id, config }));
      });
  }, [id, rowIndex, dispatch]);
  const handleMoveDown = useCallback(() => {
    dispatch(moveDown({ id }));
    const formDesign = store.getState().formDesign;
    const rowList = formDesign.layout;
    const componentMap = formDesign.byId;
    const componentIdList = rowList[rowIndex];
    const length = componentIdList.length;
    // 当前行重新布局
    componentIdList.forEach((id) => {
      const config = Object.assign({}, componentMap[id], { colSpace: length === 1 ? '4' : length === 2 ? '2' : '1' });
      dispatch(editProps({ id, config }));
    });
    // 下移之后一定是独占一行
    dispatch(editProps({ id, config: Object.assign({}, componentMap[id], { colSpace: '4' }) }));
  }, [id, rowIndex, dispatch]);
  const handleMoveLeft = useCallback(() => {
    dispatch(exchange({ id, direction: 'left' }));
  }, [id, dispatch]);
  const handleMoveRight = useCallback(() => {
    dispatch(exchange({ id, direction: 'right' }));
  }, [id, dispatch]);
  const content = useMemo(() => {
    if (compSources) {
      const Component = compSources;
      return (
        <BoxContainer>
          <div className="component_container">
            <LabelContent label={propList.label} desc={propList.desc} />
            <Component {...(propList as TConfigItem)} />
          </div>
          <div className="operation">
            <Tooltip title="复制">
              <Icon className="iconfont" type="fuzhi" onClick={handleCopy} />
            </Tooltip>
            <Tooltip title="删除">
              <Icon className="iconfont" type="shanchu" onClick={handleDelete} />
            </Tooltip>
          </div>
          {moveConfig.up && (
            <div className="moveUp">
              <Icon className="iconfont" type="jiantouxiangshang" onClick={handleMoveUp} />
            </div>
          )}
          {moveConfig.down && (
            <div className="moveDown">
              <Icon className="iconfont" type="jiantouxiangxia" onClick={handleMoveDown} />
            </div>
          )}
          {moveConfig.left && (
            <div className="moveLeft">
              <Icon className="iconfont" type="hengxiangqiehuan" onClick={handleMoveLeft} />
            </div>
          )}
          {moveConfig.right && (
            <div className="moveRight">
              <Icon className="iconfont" type="hengxiangqiehuan" onClick={handleMoveRight} />
            </div>
          )}
        </BoxContainer>
      );
    }
    return null;
  }, [
    moveConfig,
    compSources,
    propList,
    handleCopy,
    handleDelete,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    handleMoveUp,
  ]);
  return <>{content}</>;
};

export default memo(SourceBox);
