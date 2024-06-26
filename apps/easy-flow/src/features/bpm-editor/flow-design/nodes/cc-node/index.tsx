import { memo } from "react";
import { Icon } from "@common/components";
import { CCNode as CCNodeType } from "@type/flow";
import BaseNode from "../base-node";
import MemberList from "../../components/member-list";

interface CCNodeProps {
  node: CCNodeType;
}

function CCNode(props: CCNodeProps) {
  const { node } = props;

  return (
    <BaseNode icon={<Icon type="chaosongdise" />} node={node}>
      <MemberList config={node.correlationMemberConfig} />
    </BaseNode>
  );
}

export default memo(CCNode);
