import { memo, useMemo } from 'react';
import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { StartNode as StartNodeType, TriggerType } from '@type/flow';
import Base from '../base-node';

interface StartNodeProps {
  node: StartNodeType;
  onClick(node: StartNodeType): void;
}

function StartNode(props: StartNodeProps) {
  const { node, onClick } = props;
  const handleClick = useMemoCallback(() => {
    onClick(node);
  });

  const textDescription = useMemo(() => {
    if (node.trigger.type === TriggerType.MANUAL) {
      return '人工发起';
    } else if (node.trigger.type === TriggerType.TIMING) {
      return '定时发起';
    } else if (node.trigger.type === TriggerType.SIGNAL) {
      return '信号发起';
    }

    return '';
  }, [node.trigger.type]);

  return (
    <Base node={node} onClick={handleClick} icon={<Icon type="baocunbingzhixing" />}>
      {textDescription}
    </Base>
  );
}

export default memo(StartNode);
