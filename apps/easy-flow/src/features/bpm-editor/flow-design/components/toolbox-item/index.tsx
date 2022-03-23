import { memo, FC, useEffect } from "react";
import { DragSourceMonitor, useDrag } from "react-dnd";
import classNames from "classnames";
import { Icon, Text } from "@common/components";
import { NodeType } from "@/type/flow";
import styles from "./index.module.scss";
import { useAppDispatch } from "@/app/hooks";
import { setIsDragging } from "../../flow-slice";

export interface ToolboxItemProps {
  icon?: string;
  id?: number;
  shape?: "square" | "rect";
  type: NodeType;
  name: string;
}

const ToolboxItem: FC<ToolboxItemProps> = ({ icon, id, type, name, shape = "square" }) => {
  const dispatch = useAppDispatch();
  const [collectProps, drag, preview] = useDrag(
    () => ({
      type: "flow-node",
      item: () => {
        return { type, id };
      },
      collect: (monitor: DragSourceMonitor) => {
        return { isDragging: monitor.isDragging() };
      },
    }),
    [type, id],
  );
  useEffect(() => {
    dispatch(setIsDragging(collectProps.isDragging));
  }, [collectProps.isDragging, dispatch]);
  return (
    <div className={styles.container}>
      <div className={classNames(styles["toolbox-item"], styles[shape])} ref={drag}>
        {icon && (
          <div className={styles["icon-container"]}>
            <Icon type={icon} className={styles.icon} />
          </div>
        )}
        <div className={styles.name}>
          <Text text={name} />
        </div>
      </div>
      <div className={classNames(styles["toolbox-item"], styles[shape], styles.preview)} ref={preview}>
        {icon && (
          <div className={styles["icon-container"]}>
            <Icon type={icon} className={styles.icon} />
          </div>
        )}
        <div className={styles.name}>
          <Text text={name} />
        </div>
      </div>
    </div>
  );
};

export default memo(ToolboxItem);
