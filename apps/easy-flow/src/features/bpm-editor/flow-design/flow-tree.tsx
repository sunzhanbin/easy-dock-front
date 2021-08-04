import { Fragment, memo } from 'react';
import { AllNode, NodeType } from '@type/flow';
import { StartNode, AuditNode, FillNode, FinishNode, CCNode } from './nodes';

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

          case NodeType.BranchNode: {
            return (
              <div>
                {node.branches.map((branch) => {
                  return (
                    <Fragment key={branch.id}>
                      <div>分支</div>
                      <FlowTree data={branch.nodes} />
                    </Fragment>
                  );
                })}
              </div>
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
