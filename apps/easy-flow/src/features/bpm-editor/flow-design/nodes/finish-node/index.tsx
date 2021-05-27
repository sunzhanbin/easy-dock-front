import { memo } from 'react';
import BaseNode from '../base-node';
import { Icon } from '@common/components';
import { FinishNode as FinishNodeType } from '../../types';

interface FinishNodeProps {
  node: FinishNodeType;
}
function FinishNode(props: FinishNodeProps) {
  const { node } = props;

  return (
    <BaseNode node={node} onClick={() => {}} icon={<Icon type="jieshujiedian" />}>
      已办结
    </BaseNode>
  );
}

export default memo(FinishNode);
