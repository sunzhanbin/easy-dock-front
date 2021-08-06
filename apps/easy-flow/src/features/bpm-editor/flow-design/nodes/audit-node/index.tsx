import { memo } from 'react';
import { Icon } from '@common/components';
import { MemberList } from '@components/member-selector';
import useShowMembers from '../../hooks/use-show-members';
import BaseNode from '../base-node';
import { AuditNode as AuditNodeType } from '@type/flow';

export interface AuditNodeProps {
  node: AuditNodeType;
}

function AuditNode(props: AuditNodeProps) {
  const { node } = props;
  const showMembers = useShowMembers(node.correlationMemberConfig.members);

  return (
    <BaseNode icon={<Icon type="shenhejiedian" />} node={node}>
      {showMembers.length ? <MemberList members={showMembers} /> : '设置此节点'}
    </BaseNode>
  );
}

export default memo(AuditNode);
