import { memo, useCallback } from 'react';
import { Icon } from '@common/components';
import BaseNode from '../base';
import { UserNode as UserNodeType, AllNode } from '../../types';

export interface UserNodeProps {
  node: UserNodeType;
  onClick(node: UserNodeType, currentNodePrevNodes: AllNode[]): void;
  prevNodes: AllNode[];
}

function UserNode(props: UserNodeProps) {
  const { node, prevNodes, onClick } = props;
  const handleNodeClick = useCallback(() => {
    onClick(node, prevNodes);
  }, [onClick, node, prevNodes]);

  return (
    <BaseNode icon={<Icon type="yonghujiedian" />} onClick={handleNodeClick} node={node}>
      设置此节点
    </BaseNode>
  );
}

export default memo(UserNode);
