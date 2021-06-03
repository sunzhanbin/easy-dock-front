import { memo, useCallback, useMemo } from 'react';
import { Icon } from '@common/components';
import { MemberList } from '@components/member-selector';
import useShowMembers from '../../hooks/use-show-members';
import BaseNode from '../base-node';
import { AuditNode as AuditNodeType, FillNode as FillNodeType, AllNode } from '@type/flow';

export interface AuditNodeProps {
  node: AuditNodeType | FillNodeType;
  onClick(node: this['node'], currentNodePrevNodes: AllNode[]): void;
  prevNodes: AllNode[];
}

function AuditNode(props: AuditNodeProps) {
  const { node, prevNodes, onClick } = props;
  const handleNodeClick = useCallback(() => {
    onClick(node, prevNodes);
  }, [onClick, node, prevNodes]);
  const showMembers = useShowMembers(node.correlationMemberConfig.members);

  return (
    <BaseNode icon={<Icon type="yonghujiedian" />} onClick={handleNodeClick} node={node}>
      {showMembers.length ? <MemberList members={showMembers} /> : '设置此节点'}
    </BaseNode>
  );
}

export default memo(AuditNode);
