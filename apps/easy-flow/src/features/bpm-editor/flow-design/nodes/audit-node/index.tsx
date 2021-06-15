import { memo } from 'react';
import { Icon } from '@common/components';
import { MemberList } from '@components/member-selector';
import useMemoCallback from '@common/hooks/use-memo-callback';
import useShowMembers from '../../hooks/use-show-members';
import BaseNode from '../base-node';
import { AuditNode as AuditNodeType, FillNode as FillNodeType, AllNode } from '@type/flow';

export interface AuditNodeProps {
  node: AuditNodeType | FillNodeType;
  onClick(node: this['node'], currentNodePrevNodes: this['prevNodes']): void;
  prevNodes?: AllNode[];
}

function AuditNode(props: AuditNodeProps) {
  const { node, prevNodes, onClick } = props;
  const showMembers = useShowMembers(node.correlationMemberConfig.members);
  const handleNodeClick = useMemoCallback(() => {
    onClick(node, prevNodes);
  });

  return (
    <BaseNode icon={<Icon type="shenhejiedian" />} onClick={handleNodeClick} node={node}>
      {showMembers.length ? <MemberList members={showMembers} /> : '设置此节点'}
    </BaseNode>
  );
}

export default memo(AuditNode);
