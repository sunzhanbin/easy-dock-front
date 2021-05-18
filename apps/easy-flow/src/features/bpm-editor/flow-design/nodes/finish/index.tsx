import { memo } from 'react';
import { FinishNode as FinishNodeType } from '../../types';

interface FinishNodeProps {
  node: FinishNodeType;
}
function FinishNode(props: FinishNodeProps) {
  const { node } = props;

  return <div>end</div>;
}

export default memo(FinishNode);
