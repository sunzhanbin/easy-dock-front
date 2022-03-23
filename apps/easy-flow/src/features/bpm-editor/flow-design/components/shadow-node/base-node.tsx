import { NodeType } from "@/type/flow";
import { memo, FC, ReactNode } from "react";
import { CardHeader } from "../../nodes";
import styles from "./base-node.module.scss";

interface BaseNodeProps {
  icon: ReactNode;
  type: NodeType;
  text: string;
}

const BaseNode: FC<BaseNodeProps> = ({ icon, type, text }) => {
  return (
    <div className={styles.container}>
      <CardHeader icon={icon} type={type} className={styles["base-node"]}>
        {text}
      </CardHeader>
      <div className={styles.content}>请设置此节点</div>
    </div>
  );
};

export default memo(BaseNode);
