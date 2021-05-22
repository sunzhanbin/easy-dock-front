import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { load, flowDataSelector } from './flow-slice';
import { AllNode, BranchNode as BranchNodeType, NodeType } from './types';
import { StartNode, UserNode, FinishNode } from './nodes';
import { UserNodeProps } from './nodes/user';
import { StartNodeEditor, UserNodeEditor } from './editor';
import styles from './index.module.scss';

function FlowDesign() {
  const dispatch = useDispatch();
  const { loading, data: flow, fieldsTemplate } = useSelector(flowDataSelector);
  const [currentEditNode, setCurrentEditNode] = useState<AllNode | null>(null);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [currentEditNodePrevNodes, setCurrentEditNodePrevNodes] = useState<AllNode[]>([]);

  useEffect(() => {
    dispatch(load('appkey'));
  }, [dispatch]);

  const handleClickNode = useMemoCallback((node: Exclude<AllNode, BranchNodeType>) => {
    setCurrentEditNode(node);
    setShowEditDrawer(true);
  });

  const handleCloseNodeEditor = useMemoCallback(() => {
    setShowEditDrawer(false);
  });

  const handleClickUserNode: UserNodeProps['onClick'] = useMemoCallback((node, prevNodes) => {
    setCurrentEditNode(node);
    setCurrentEditNodePrevNodes(prevNodes);
    setShowEditDrawer(true);
  });

  const currentEditNodeTypeName = useMemo(() => {
    if (currentEditNode) {
      if (currentEditNode.type === NodeType.UserNode) {
        return '用户节点';
      } else if (currentEditNode.type === NodeType.StartNode) {
        return '开始节点';
      } else if (currentEditNode.type === NodeType.FinishNode) {
        return '结束节点';
      }
    }

    return '';
  }, [currentEditNode?.type]);

  return (
    <div className={styles.flow}>
      <div className={styles.content}>
        {flow.map((node, index) => {
          switch (node.type) {
            case NodeType.StartNode: {
              return <StartNode key={node.id} node={node} onClick={handleClickNode} />;
            }

            case NodeType.UserNode: {
              const prevNodes = flow.slice(0, index);
              return (
                <UserNode
                  key={node.id}
                  node={node}
                  onClick={handleClickUserNode}
                  prevNodes={prevNodes}
                />
              );
            }

            case NodeType.FinishNode: {
              return <FinishNode key={node.id} node={node} />;
            }
          }
        })}
      </div>
      <Drawer
        width={368}
        visible={showEditDrawer}
        getContainer={false}
        onClose={handleCloseNodeEditor}
        destroyOnClose
        closable={false}
      >
        <div className={styles.editor}>
          <div className={styles.title}>{currentEditNodeTypeName}</div>

          {currentEditNode && currentEditNode.type === NodeType.StartNode && (
            <StartNodeEditor node={currentEditNode} />
          )}

          {currentEditNode && currentEditNode.type === NodeType.UserNode && (
            <UserNodeEditor node={currentEditNode} prevNodes={currentEditNodePrevNodes} />
          )}
        </div>
      </Drawer>
    </div>
  );
}

export default React.memo(FlowDesign);
