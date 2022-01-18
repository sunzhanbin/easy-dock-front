import { memo } from "react";
import { Icon } from "@common/components";
import BaseNode from "../base-node";
import { FinishNode as FinishNodeType } from "@type/flow";

interface FinishNodeProps {
  node: FinishNodeType;
}

function FinishNode(props: FinishNodeProps) {
  const { node } = props;

  return (
    <BaseNode node={node} icon={<Icon type="jieshujiedian" />}>
      {node.name ? "已办结" : "请设置此节点"}
    </BaseNode>
  );
}

export default memo(FinishNode);
