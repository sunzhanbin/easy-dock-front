import { memo } from 'react';
import StartNode from '../start';
import UserNode from '../user';
import BranchNode from '../branch';
import FinishNode from '../finish';
import { NodeType, AllNode } from '../../types';

interface FlowProps {
  data: AllNode[];
}

function Flow(props: FlowProps) {
  const { data } = props;

  return (
    <div>
      {data.map((node) => {
        switch (node.type) {
          case NodeType.StartNode: {
            return <StartNode key={node.id} node={node} />;
          }

          case NodeType.UserNode: {
            return <UserNode key={node.id} node={node} />;
          }

          case NodeType.BranchNode: {
            return <BranchNode key={node.id} node={node} />;
          }

          case NodeType.FinishNode: {
            return <FinishNode key={node.id} node={node} />;
          }
        }
      })}
    </div>
  );
}

export default memo(Flow);
