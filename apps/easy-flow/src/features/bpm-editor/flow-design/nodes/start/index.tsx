import { memo } from 'react';
import { StartNode as StartNodeType } from '../../types';

interface StartNodeProps {
  node: StartNodeType;
}

function StartNode(props: StartNodeProps) {
  const { node } = props;

  return <div>start</div>;
}

export default memo(StartNode);
