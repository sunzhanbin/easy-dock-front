import { memo, FC } from "react";
import { useDrag } from "react-dnd";
import { Icon } from "@common/components";
import { NodeType } from "@/type/flow";
import styles from "./index.module.scss";

export interface ToolboxItemProps {
  icon?: string;
  type: NodeType;
  name: string;
}

const ToolboxItem: FC<ToolboxItemProps> = ({ icon, type, name }) => {
  const [, drag] = useDrag(
    () => ({
      type: "flow-node",
      item: () => {
        return { type };
      },
    }),
    [type],
  );
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
