import { memo } from 'react';
import { Icon } from '@common/components';
import { CCNode as CCNodeType } from '@type/flow';
import { MemberList } from '@common/components/member-selector';
import BaseNode from '../base-node';
import useShowMembers from '../../hooks/use-show-members';

interface CCNodeProps {
  node: CCNodeType;
}

function CCNode(props: CCNodeProps) {
  const { node } = props;
  const showMembers = useShowMembers(node.correlationMemberConfig.members);

  return (
    <BaseNode icon={<Icon type="chaosongdise" />} node={node}>
      {showMembers.length ? <MemberList members={showMembers} /> : '设置此节点'}
    </BaseNode>
  );
}

export default memo(CCNode);
