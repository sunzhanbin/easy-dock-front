import { memo } from 'react';
import { Icon } from '@common/components';
import BaseNode from '../base-node';
import { AutoNode as AutoNodeType } from '@type/flow';

interface AutoNodeProps {
  node: AutoNodeType;
}

function AutoNode(props: AutoNodeProps) {
  const { node } = props;

  return (
    <BaseNode node={node} icon={<Icon type="zidongjiediandise" />}>
      {node.name ? '已办结' : '请设置此节点'}
    </BaseNode>
  );
}

export default memo(AutoNode);
