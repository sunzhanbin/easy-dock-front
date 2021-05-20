import { memo, useCallback } from 'react';
import { Icon } from '@common/components';
import BaseNode from '../base';
import { UserNode as UserNodeType } from '../../types';

interface UserNodeProps {
  node: UserNodeType;
  onClick(node: UserNodeType): void;
}

function UserNode(props: UserNodeProps) {
  const { node, onClick } = props;
  const handleNodeClick = useCallback(() => {
    onClick(node);
  }, [onClick, node]);

  return (
    <BaseNode icon={<Icon type="yonghujiedian" />} onClick={handleNodeClick} node={node}>
      设置此节点
    </BaseNode>
  );
}

export default memo(UserNode);
