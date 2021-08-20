import { memo } from 'react';
import { Icon } from '@common/components';
import { MemberList } from '@common/components/member-selector';
import { FillNode as FillNodeType } from '@type/flow';
import useShowMembers from '../../hooks/use-show-members';
import BaseNode from '../base-node';

export interface FillNodeProps {
  node: FillNodeType;
}

function FillNode(props: FillNodeProps) {
  const { node } = props;
  const showMembers = useShowMembers(node.correlationMemberConfig.members);

  return (
    <BaseNode icon={<Icon type="tianxiejiedian" />} node={node}>
      {showMembers.length ? <MemberList members={showMembers} /> : '设置此节点'}
    </BaseNode>
  );
}

export default memo(FillNode);
