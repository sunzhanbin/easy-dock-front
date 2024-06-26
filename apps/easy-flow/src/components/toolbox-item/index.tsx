import { FC, memo, useCallback } from "react";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { configSelector, formDesignSelector } from "@/features/bpm-editor/form-design/formzone-reducer";
import { FieldType, FormField } from "@/type";
import { Icon } from "@common/components";
import { useDrag } from "react-dnd";
import styles from "./index.module.scss";
import { comAdded, comInserted } from "../../features/bpm-editor/form-design/formdesign-slice";

interface DropResult {
  rowIndex: number;
  hoverIndex: number;
  id: string;
}

const ToolBoxItem: FC<{ icon: string; displayName: string; type: FieldType; disabled?: boolean }> = ({
  icon,
  displayName,
  type,
  disabled = false,
}) => {
  const dispatch = useAppDispatch();
  const configMap = useAppSelector(configSelector);
  const formDesign = useAppSelector(formDesignSelector);
  const [, drag] = useDrag(
    () => ({
      type: "toolItem",
      item: { rowIndex: -1, id: type },
      canDrag: () => {
        return !disabled;
      },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<DropResult>();
        console.log("dropResult", dropResult);
        const com = { ...configMap[type], type };
        dropResult && dispatch(comInserted(com as FormField, dropResult?.hoverIndex));
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }),
    [type, disabled],
  );
  const addComponent = useCallback(() => {
    if (disabled) {
      return;
    }
    const com = { ...configMap[type], type };
    const rowIndex = formDesign?.layout?.length || -1;
    dispatch(comAdded(com as FormField, rowIndex + 1));
  }, [type, configMap, formDesign, disabled, dispatch]);
  return (
    <div
      className={classNames(styles.container, disabled ? styles.disabled : "")}
      onClick={addComponent}
      ref={drag}
      // eslint-disable-next-line
      role="toolItem"
      data-testid={`toolItem-${type}`}
    >
      <div className={styles.icon_container}>
        <Icon type={icon} className={styles.iconfont} />
      </div>
      <span className={styles.component_name}>{displayName}</span>
    </div>
  );
};

export default memo(ToolBoxItem);
