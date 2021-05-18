import { memo } from 'react';
import { BranchNode as BranchNodeType } from '../../types';
import Flow from '../flow';

interface BranchNodeProps {
  node: BranchNodeType;
}

function BranchNode(props: BranchNodeProps) {
  const { node } = props;

  return (
    <div>
      <div>分支节点</div>
      {node.branches.map((branch, index) => {
        return (
          <div key={index}>
            <div>分支子节点{index}</div>
            <Flow data={branch.nodes} />
          </div>
        );
      })}
    </div>
  );
}

export default memo(BranchNode);
