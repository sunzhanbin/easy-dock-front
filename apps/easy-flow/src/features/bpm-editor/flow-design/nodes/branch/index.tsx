import { memo, useCallback } from 'react';
import {
  BranchNode as BranchNodeType,
  UserNode as UserNodeType,
  AllNode,
  NodeType,
} from '../../types';
import UserNode from '../user';

type BranchType = BranchNodeType['branches'][number];

interface BranchNodeProps {
  data: BranchNodeType;
  onNodeClick(node: AllNode): void;
  onBranchClick(branch: BranchType): void;
}

interface BranchProps {
  data: BranchType;
  onClick(branch: BranchType): void;
}

function Branch(props: BranchProps) {
  const { data, onClick } = props;
  const handleClick = useCallback(() => {
    onClick(data);
  }, [data, onClick]);

  return <div onClick={handleClick}>分支</div>;
}

function BranchNode(props: BranchNodeProps) {
  const { data, onBranchClick, onNodeClick } = props;

  return (
    <div>
      <div>分支节点</div>
      {data.branches.map((sBranch) => {
        return (
          <div key={sBranch.id}>
            <Branch onClick={onBranchClick} data={sBranch} />

            {sBranch.nodes.map((sNode) => {
              if (sNode.type === NodeType.BranchNode) {
                return (
                  <BranchNode
                    key={sNode.id}
                    data={sNode}
                    onNodeClick={onNodeClick}
                    onBranchClick={onBranchClick}
                  />
                );
              } else if (sNode.type === NodeType.UserNode) {
                return <UserNode node={sNode} onClick={onNodeClick} key={sNode.id} />;
              } else {
                return null;
              }
            })}
          </div>
        );
      })}
    </div>
  );
}

export default memo(BranchNode);
