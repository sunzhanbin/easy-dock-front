import { memo, FC, useMemo } from "react";
import classNames from "classnames";
import { NodeType } from "@type/flow";
import styles from "./index.module.scss";
import auditNodeImage from "@assets/AuditNode.png";
import branchNodeImage from "@assets/BranchNode.png";
import CCNodeImage from "@assets/CCNode.png";
import DataPushNodeImage from "@assets/DataPushNode.png";
import fillNodeImage from "@assets/FillNode.png";
import processNodeImage from "@assets/ProcessNode.png";

interface ShadowNodeProps {
  type: NodeType;
  parentType?: string;
  className?: string;
}

const ShadowNode: FC<ShadowNodeProps> = ({ type, parentType = "common", className }) => {
  const content = useMemo(() => {
    if (type === NodeType.AuditNode) {
      return <img src={auditNodeImage} alt="branch" />;
    }
    if (type === NodeType.FillNode) {
      return <img src={fillNodeImage} alt="branch" />;
    }
    if (type === NodeType.CCNode) {
      return <img src={CCNodeImage} alt="branch" />;
    }
    if (type === NodeType.BranchNode) {
      return <img src={branchNodeImage} alt="branch" className={styles.image} />;
    }
    if (type === NodeType.AutoNodePushData) {
      return <img src={DataPushNodeImage} alt="branch" />;
    }
    if (type === NodeType.AutoNodeTriggerProcess) {
      return <img src={processNodeImage} alt="branch" />;
    }
    return null;
  }, [type]);
  return <div className={classNames(styles["shadow-node"], styles[parentType], className && className)}>{content}</div>;
};

export default memo(ShadowNode);
