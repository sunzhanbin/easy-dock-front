import { memo } from 'react';
import { AllNode, NodeType } from '@type/flow';
import {
  StartNode,
  AuditNode,
  FillNode,
  FinishNode,
  CCNode,
  BranchNode,
  Branch,
  AutoNodePushData,
  AutoNodeTriggerProcess,
} from './nodes';

interface FlowTreeProps {
  data: AllNode[];
}

function FlowTree(props: FlowTreeProps) {
  const { data } = props;

  return (
    <>
      {data.map((node) => {
        switch (node.type) {
          case NodeType.StartNode: {
            return <StartNode key={node.id} node={node} />;
          }

          case NodeType.AuditNode: {
            return <AuditNode key={node.id} node={node} />;
          }

          case NodeType.FillNode: {
            return <FillNode key={node.id} node={node} />;
          }

          case NodeType.CCNode: {
            return <CCNode key={node.id} node={node} />;
          }

          case NodeType.FinishNode: {
            return <FinishNode key={node.id} node={node} />;
          }

          case NodeType.AutoNodePushData: {
            return <AutoNodePushData key={node.id} node={node} />;
          }

          case NodeType.AutoNodeTriggerProcess: {
            return <AutoNodeTriggerProcess key={node.id} node={node} />;
          }

          case NodeType.BranchNode: {
            return (
              <BranchNode key={node.id} data={node}>
                {node.branches.map((branch) => (
                  <Branch key={branch.id} data={branch} parentNode={node}>
                    {<FlowTree data={branch.nodes} />}
                  </Branch>
                ))}
              </BranchNode>
            );
          }

          default: {
            return null;
          }
        }
      })}
    </>
  );
}

export default memo(FlowTree);
