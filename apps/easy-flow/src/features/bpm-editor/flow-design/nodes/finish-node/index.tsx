import { memo } from 'react';
import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import BaseNode from '../base-node';
import { FinishNode as FinishNodeType } from '@type/flow';

interface FinishNodeProps {
  node: FinishNodeType;
  onClick(node: FinishNodeType): void;
}

function FinishNode(props: FinishNodeProps) {
  const { node, onClick } = props;
  const handleClick = useMemoCallback(() => {
    onClick(node);
  });

  return (
    <BaseNode node={node} onClick={handleClick} icon={<Icon type="jieshujiedian" />}>
      {node.name ? '已办结' : '请设置此节点'}
    </BaseNode>
  );
}

export default memo(FinishNode);
