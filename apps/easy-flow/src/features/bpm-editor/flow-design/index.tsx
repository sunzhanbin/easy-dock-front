import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { load, flowDataSelector } from './flow-slice';
import { AllNode, BranchNode as BranchNodeType, NodeType } from './types';
import { StartNode, UserNode, FinishNode } from './nodes';
import { StartNodeEditor } from './editor';
import styles from './index.module.scss';

function FlowDesign() {
  const dispatch = useDispatch();
  const { loading, data: flow, fieldsTemplate } = useSelector(flowDataSelector);
  const [currentEditNode, setCurrentEditNode] = useState<AllNode | null>(null);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
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

  return (
    <div className={styles.flow}>
      <div className={styles.content}>
        {flow.map((node) => {
          switch (node.type) {
            case NodeType.StartNode: {
              return <StartNode key={node.id} node={node} onClick={handleClickNode} />;
            }

            case NodeType.UserNode: {
              return <UserNode key={node.id} node={node} onClick={() => {}} />;
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
        drawerStyle={{ top: 64 }}
        closable={false}
      >
        <div className={styles.editor}>
          <div className={styles.title}>开始节点</div>
          {currentEditNode && currentEditNode.type === NodeType.StartNode && (
            <StartNodeEditor node={currentEditNode} />
          )}
        </div>
      </Drawer>
    </div>
  );
}

export default React.memo(FlowDesign);
