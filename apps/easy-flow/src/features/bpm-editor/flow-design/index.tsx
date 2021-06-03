import React, { useEffect, useMemo, useState } from 'react';
import { Prompt } from 'react-router-dom';
import { Drawer } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Loading, Icon } from '@common/components';
import { load, flowDataSelector, save } from './flow-slice';
import { AllNode, BranchNode as BranchNodeType, NodeType } from '@type/flow';
import { StartNode, UserNode, FinishNode, CardHeader } from './nodes';
import { AuditNodeProps } from './nodes/audit-node';
import { StartNodeEditor, AuditNodeEditor, FillNodeEditor } from './editor';
import styles from './index.module.scss';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

function FlowDesign() {
  const dispatch = useAppDispatch();
  const { loading, data: flow, dirty } = useAppSelector(flowDataSelector);
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

  const handleClickUserNode: AuditNodeProps['onClick'] = useMemoCallback((node, prevNodes) => {
    setCurrentEditNode(node);
    setCurrentEditNodePrevNodes(prevNodes);
    setShowEditDrawer(true);
  });

  useEffect(() => {
    function handleSave(event: KeyboardEvent) {
      if (event.key === 's' && (navigator.platform.match('Mac') ? event.metaKey : event.ctrlKey)) {
        event.preventDefault();

        dispatch(save('appkey'));
      }
    }

    document.body.addEventListener('keydown', handleSave, false);

    return () => {
      document.body.removeEventListener('keydown', handleSave);
    };
  }, []);

  const drawerHeader = useMemo(() => {
    if (currentEditNode) {
      if (currentEditNode.type === NodeType.AuditNode) {
        return (
          <CardHeader icon={<Icon type="yonghujiedian" />} type={currentEditNode.type}>
            用户节点
          </CardHeader>
        );
      } else if (currentEditNode.type === NodeType.StartNode) {
        return (
          <CardHeader icon={<Icon type="baocunbingzhixing" />} type={currentEditNode.type}>
            开始节点
          </CardHeader>
        );
      } else if (currentEditNode.type === NodeType.FinishNode) {
        return (
          <CardHeader icon={<Icon type="jieshujiedian" />} type={currentEditNode.type}>
            结束节点
          </CardHeader>
        );
      } else if (currentEditNode.type === NodeType.FillNode) {
        return (
          <CardHeader icon={<Icon type="jieshujiedian" />} type={currentEditNode.type}>
            填写节点
          </CardHeader>
        );
      }
    }

    return null;
  }, [currentEditNode?.type]);

  const handleConfirmLeave = useMemoCallback(() => {
    return true;
  });

  return (
    <div className={styles.flow}>
      <Prompt when={dirty} message={handleConfirmLeave} />
      {loading && <Loading />}
      <div className={styles.content}>
        {flow.map((node, index) => {
          const prevNodes = flow.slice(0, index);

          switch (node.type) {
            case NodeType.StartNode: {
              return <StartNode key={node.id} node={node} onClick={handleClickNode} />;
            }

            case NodeType.AuditNode: {
              return <UserNode key={node.id} node={node} onClick={handleClickUserNode} prevNodes={prevNodes} />;
            }

            case NodeType.FillNode: {
              return <UserNode key={node.id} node={node} onClick={handleClickUserNode} prevNodes={prevNodes} />;
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
        {drawerHeader}

        <div className={styles.editor}>
          {currentEditNode && currentEditNode.type === NodeType.StartNode && <StartNodeEditor node={currentEditNode} />}

          {currentEditNode && currentEditNode.type === NodeType.AuditNode && (
            <AuditNodeEditor node={currentEditNode} prevNodes={currentEditNodePrevNodes} />
          )}

          {currentEditNode && currentEditNode.type === NodeType.FillNode && (
            <FillNodeEditor node={currentEditNode} prevNodes={currentEditNodePrevNodes} />
          )}
        </div>
      </Drawer>
    </div>
  );
}

export default React.memo(FlowDesign);
