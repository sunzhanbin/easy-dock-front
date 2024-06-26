import React, { memo, FC, useMemo, useCallback, useRef, useEffect } from "react";
import { Icon, Loading } from "@common/components";
import { Tooltip } from "antd";
import { AllComponentType, FormField, MoveConfig, RadioField, TConfigItem } from "@/type";
import {
  exchange,
  comAdded,
  comDeleted,
  moveUpAction,
  moveDownAction,
} from "@/features/bpm-editor/form-design/formdesign-slice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import useLoadComponents from "@/hooks/use-load-components";
import { formDesignSelector, selectedFieldSelector } from "@/features/bpm-editor/form-design/formzone-reducer";

import useDataSource from "@/hooks/use-data-source";
import styles from "./index.module.scss";
import LabelContent from "../label-content";

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
  const formDesign = useAppSelector(formDesignSelector);
  const sourceRef = useRef<any>(null);

  const dataSource = useMemo(() => {
    if (config && (config as RadioField)?.dataSource) {
      const source = (config as RadioField)?.dataSource;
      return source;
    }
    return null;
  }, [config]);
  useEffect(() => {
    sourceRef.current = dataSource;
  }, [dataSource]);

  const [options, loading] = useDataSource({ prevDataSource: sourceRef.current, dataSource });
  // 获取组件源码
  const compSources = useLoadComponents(type as AllComponentType["type"]) as Component;
  const propList = useMemo(() => {
    const type = config?.type;
    if (type === "Radio" || type === "Checkbox" || type === "InputNumber") {
      return Object.assign({}, config, { id, options });
    }
    return Object.assign({}, config, { id });
  }, [config, id, options]);
  const handleCopy = useCallback(() => {
    const com = Object.assign({}, formDesign.byId[id]);
    dispatch(comAdded(com, rowIndex + 1));
  }, [id, rowIndex, formDesign, dispatch]);
  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch(comDeleted({ id }));
    },
    [id, dispatch],
  );
  const handleMoveUp = useCallback(() => {
    dispatch(moveUpAction({ id, rowIndex }));
  }, [id, rowIndex, dispatch]);
  const handleMoveDown = useCallback(() => {
    dispatch(moveDownAction({ id, rowIndex }));
  }, [id, rowIndex, dispatch]);
  const handleMoveLeft = useCallback(() => {
    dispatch(exchange({ id, direction: "left" }));
  }, [id, dispatch]);
  const handleMoveRight = useCallback(() => {
    dispatch(exchange({ id, direction: "right" }));
  }, [id, dispatch]);
  const content = useMemo(() => {
    if (compSources) {
      const Component = compSources;
      return (
        <div className={styles.container}>
          {loading && <Loading />}
          <div className={styles.component_container}>
            {type !== "DescText" && <LabelContent label={propList.label} desc={propList.desc} />}
            <Component {...(propList as TConfigItem)} />
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
            <div className={styles.moveUp} style={{ display: id === selectedField ? "block" : "none" }}>
              <Icon className={styles.iconfont} type="jiantouxiangshang" onClick={handleMoveUp} />
            </div>
          )}
          {moveConfig.down && (
            <div className={styles.moveDown} style={{ display: id === selectedField ? "block" : "none" }}>
              <Icon className={styles.iconfont} type="jiantouxiangxia" onClick={handleMoveDown} />
            </div>
          )}
          {moveConfig.left && (
            <div className={styles.moveLeft} style={{ display: id === selectedField ? "block" : "none" }}>
              <Icon className={styles.iconfont} type="hengxiangqiehuan" onClick={handleMoveLeft} />
            </div>
          )}
          {moveConfig.right && (
            <div className={styles.moveRight} style={{ display: id === selectedField ? "block" : "none" }}>
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
    loading,
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
