import { memo, FC, useEffect } from "react";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { Icon } from "@common/components";
import { NodeType } from "@/type/flow";
import styles from "./index.module.scss";
import { useAppDispatch } from "@/app/hooks";
import { setIsDragging } from "../../flow-slice";

export interface ToolboxItemProps {
  icon?: string;
  type: NodeType;
  name: string;
}

const ToolboxItem: FC<ToolboxItemProps> = ({ icon, type, name }) => {
  const dispatch = useAppDispatch();
  const [collectProps, drag] = useDrag(
    () => ({
      type: "flow-node",
      item: () => {
        return { type };
      },
      collect: (monitor: DragSourceMonitor) => {
        return { isDragging: monitor.isDragging() };
      },
    }),
    [type],
  );
  useEffect(() => {
    dispatch(setIsDragging(collectProps.isDragging));
  }, [collectProps.isDragging, dispatch]);
  return (
    <div className={styles["toolbox-item"]} ref={drag}>
      {icon && (
        <div className={styles["icon-container"]}>
          <Icon type={icon} className={styles.icon} />
        </div>
      )}
      <div className={styles.name}>{name}</div>
    </div>
  );
};

export default memo(ToolboxItem);
