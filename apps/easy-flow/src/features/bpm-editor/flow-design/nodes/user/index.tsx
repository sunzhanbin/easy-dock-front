import { memo, useCallback, useMemo } from 'react';
import { Icon } from '@common/components';
import MemberSelector from '@components/member-selector';
import BaseNode from '../base';
import { AuditNode as AuditNodeType, AllNode } from '../../types';

export interface UserNodeProps {
  node: AuditNodeType;
  onClick(node: AuditNodeType, currentNodePrevNodes: AllNode[]): void;
  prevNodes: AllNode[];
}

function UserNode(props: UserNodeProps) {
  const { node, prevNodes, onClick } = props;
  const handleNodeClick = useCallback(() => {
    onClick(node, prevNodes);
  }, [onClick, node, prevNodes]);

  const showMembers = useMemo(() => {
    const { departs, members } = node.correlationMemberConfig || {};
    if (departs.length || members.length) {
      return true;
    }

    return false;
  }, [node.correlationMemberConfig]);

  return (
    <BaseNode icon={<Icon type="yonghujiedian" />} onClick={handleNodeClick} node={node}>
      {showMembers ? (
        <MemberSelector value={node.correlationMemberConfig} readonly></MemberSelector>
      ) : (
        '设置此节点'
      )}
    </BaseNode>
  );
}

export default memo(UserNode);
