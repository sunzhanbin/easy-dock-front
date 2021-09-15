import { memo } from 'react';
import { Icon } from '@common/components';
import { AuditNode as AuditNodeType } from '@type/flow';
import BaseNode from '../base-node';
import MemberList from '../../components/member-list';

export interface AuditNodeProps {
  node: AuditNodeType;
}

function AuditNode(props: AuditNodeProps) {
  const { node } = props;

  return (
    <BaseNode icon={<Icon type="shenhejiedian" />} node={node}>
      <MemberList config={node.correlationMemberConfig} />
    </BaseNode>
  );
}

export default memo(AuditNode);
