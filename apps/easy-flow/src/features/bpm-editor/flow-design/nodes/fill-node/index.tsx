import { memo } from 'react';
import { Icon } from '@common/components';
import { MemberList } from '@components/member-selector';
import useMemoCallback from '@common/hooks/use-memo-callback';
import useShowMembers from '../../hooks/use-show-members';
import BaseNode from '../base-node';
import { FillNode as FillNodeType } from '@type/flow';

export interface FillNodeProps {
  node: FillNodeType;
  onClick(node: this['node']): void;
}

function FillNode(props: FillNodeProps) {
  const { node, onClick } = props;
  const showMembers = useShowMembers(node.correlationMemberConfig.members);
  const handleNodeClick = useMemoCallback(() => {
    onClick(node);
  });

  return (
    <BaseNode icon={<Icon type="tianxiejiedian" />} onClick={handleNodeClick} node={node}>
      {showMembers.length ? <MemberList members={showMembers} /> : '设置此节点'}
    </BaseNode>
  );
}

export default memo(FillNode);
