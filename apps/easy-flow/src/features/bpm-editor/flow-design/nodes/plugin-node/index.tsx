import { memo, FC } from "react";
import { PluginNode as NodeProps } from "@/type/flow";
import { Icon } from "@common/components";
import BaseNode from "../base-node";
import styles from "./index.module.scss";

const PluginNode: FC<{ node: NodeProps }> = ({ node }) => {
  return (
    <BaseNode node={node} icon={<Icon type="shujulianjiedise" />}>
      <div className={styles.text}>
        <span className={styles.desc}>调用插件</span>
        <span className={styles.name}>{node.dataConfig.name}</span>
      </div>
    </BaseNode>
  );
};

export default memo(PluginNode);
