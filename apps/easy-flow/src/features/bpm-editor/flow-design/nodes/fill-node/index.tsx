import { memo } from "react";
import { Icon } from "@common/components";
import { FillNode as FillNodeType } from "@type/flow";
import BaseNode from "../base-node";
import MemberList from "../../components/member-list";

export interface FillNodeProps {
  node: FillNodeType;
}

function FillNode(props: FillNodeProps) {
  const { node } = props;

  return (
    <BaseNode icon={<Icon type="tianxiejiedian" />} node={node}>
      <MemberList config={node.correlationMemberConfig} />
    </BaseNode>
  );
}

export default memo(FillNode);
