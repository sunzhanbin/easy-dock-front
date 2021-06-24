import { AllComponentType, FormField, MoveConfig, TConfigItem } from '@/type';
import { Tooltip } from 'antd';
import LabelContent from '../label-content';
import { Icon } from '@common/components';
import React, { memo, FC, useMemo, useCallback } from 'react';
import { store } from '@app/store';
import {
  moveUp,
  moveDown,
  exchange,
  editProps,
  comAdded,
  comDeleted,
} from '@/features/bpm-editor/form-design/formdesign-slice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import useLoadComponents from '@/hooks/use-load-components';
import styles from './index.module.scss';
import { selectedFieldSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import useDataSource from '@/hooks/use-data-source';

type Component = React.FC | React.ComponentClass;
const SourceBox: FC<{
  type: string;
  config: FormField;
  id: string;
  moveConfig: MoveConfig;
  rowIndex: number;
}> = ({ type, config, id, moveConfig, rowIndex }) => {
  const dispatch = useAppDispatch();
  const selectedField = useAppSelector(selectedFieldSelector);
  const options = useDataSource((config as any)?.dataSource);
  // 获取组件源码
  const compSources: any = useLoadComponents(type as AllComponentType['type']) as Component;
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
        <div className={styles.container}>
          <div className={styles.component_container}>
            <LabelContent label={propList.label} desc={propList.desc} />
            {(type === 'Radio' || type === 'Checkbox' || type === 'Select') && options ? (
              <Component {...(propList as TConfigItem)} options={options} />
            ) : (
              <Component {...(propList as TConfigItem)} />
            )}
          </div>
          <div className={styles.operation}>
            <Tooltip title="复制">
              <span>
                <Icon className={styles.iconfont} type="fuzhi" onClick={handleCopy} />
              </span>
            </Tooltip>
            <Tooltip title="删除">
              <span>
                <Icon className={styles.iconfont} type="shanchu" onClick={handleDelete} />
              </span>
            </Tooltip>
          </div>
          {moveConfig.up && (
            <div className={styles.moveUp} style={{ display: id === selectedField ? 'block' : 'none' }}>
              <Icon className={styles.iconfont} type="jiantouxiangshang" onClick={handleMoveUp} />
            </div>
          )}
          {moveConfig.down && (
            <div className={styles.moveDown} style={{ display: id === selectedField ? 'block' : 'none' }}>
              <Icon className={styles.iconfont} type="jiantouxiangxia" onClick={handleMoveDown} />
            </div>
          )}
          {moveConfig.left && (
            <div className={styles.moveLeft} style={{ display: id === selectedField ? 'block' : 'none' }}>
              <Icon className={styles.iconfont} type="hengxiangqiehuan" onClick={handleMoveLeft} />
            </div>
          )}
          {moveConfig.right && (
            <div className={styles.moveRight} style={{ display: id === selectedField ? 'block' : 'none' }}>
              <Icon className={styles.iconfont} type="hengxiangqiehuan" onClick={handleMoveRight} />
            </div>
          )}
        </div>
      );
    }
    return null;
  }, [
    id,
    type,
    moveConfig,
    compSources,
    selectedField,
    propList,
    options,
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
