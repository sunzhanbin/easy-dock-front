import { memo, FC, useMemo } from "react";
import classNames from "classnames";
import { NodeType } from "@type/flow";
import styles from "./index.module.scss";
import BaseNode from "./base-node";
import BranchNode from "./branch-node";
import { Icon } from "@common/components";

interface ShadowNodeProps {
  type: NodeType;
  parentType?: string;
  className?: string;
}

const ShadowNode: FC<ShadowNodeProps> = ({ type, parentType = "common", className }) => {
  const content = useMemo(() => {
    if (type === NodeType.AuditNode) {
      return <BaseNode icon={<Icon type="shenhejiedian" />} type={NodeType.AuditNode} text="审批节点" />;
    }
    if (type === NodeType.FillNode) {
      return <BaseNode icon={<Icon type="tianxiejiedian" />} type={NodeType.FillNode} text="填写节点" />;
    }
    if (type === NodeType.CCNode) {
      return <BaseNode icon={<Icon type="chaosongdise" />} type={NodeType.CCNode} text="抄送节点" />;
    }
    if (type === NodeType.BranchNode) {
      return <BranchNode className={styles["branch-node"]} />;
    }
    if (type === NodeType.AutoNodePushData) {
      return (
        <BaseNode icon={<Icon type="shujulianjiedise" />} type={NodeType.AutoNodePushData} text="自动节点-数据连接" />
      );
    }
    if (type === NodeType.AutoNodeTriggerProcess) {
      return (
        <BaseNode
          icon={<Icon type="liuchengchufadise" />}
          type={NodeType.AutoNodeTriggerProcess}
          text="自动节点-触发流程"
        />
      );
    }
    if (type === NodeType.PluginNode) {
      return <BaseNode icon={<Icon type="chajiandise" />} type={NodeType.PluginNode} text="插件节点" />;
    }
    return null;
  }, [type]);
  return <div className={classNames(styles["shadow-node"], styles[parentType], className && className)}>{content}</div>;
};

export default memo(ShadowNode);
