import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Prompt, useParams, useLocation, useHistory } from 'react-router-dom';
import { Drawer, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Loading, Icon, AsyncButton } from '@common/components';
import { load, flowDataSelector, save, setDirty } from './flow-slice';
import { AllNode, BranchNode as BranchNodeType, NodeType } from '@type/flow';
import { StartNode, AuditNode, FillNode, FinishNode, CardHeader } from './nodes';
import { AuditNodeProps } from './nodes/audit-node';
import { StartNodeEditor, AuditNodeEditor, FillNodeEditor, FinishNodeEditor } from './editor';
import styles from './index.module.scss';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

function FlowDesign() {
  const dispatch = useAppDispatch();
  const { bpmId } = useParams<{ bpmId: string }>();
  const { loading, data: flow, dirty, invalidNodesMap } = useAppSelector(flowDataSelector);
  const [currentEditNode, setCurrentEditNode] = useState<AllNode | null>(null);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [currentEditNodePrevNodes, setCurrentEditNodePrevNodes] = useState<AllNode[]>([]);
  const [saving, setSaving] = useState(false);
  const [showUnsaveModal, setShowUnsaveModal] = useState(false);
  const history = useHistory();
  const targetUrlRef = useRef<string>();
  const cancelSaveRef = useRef<boolean>();

  useEffect(() => {
    dispatch(load(bpmId));
  }, [dispatch, bpmId]);

  useEffect(() => {
    // history.block()
  }, [history]);

  const handleClickNode = useMemoCallback((node: Exclude<AllNode, BranchNodeType>) => {
    setCurrentEditNode(node);
    setShowEditDrawer(true);
  });

  const handleCloseNodeEditor = useMemoCallback(() => {
    setShowEditDrawer(false);
  });

  const handleClickAuditNode: AuditNodeProps['onClick'] = useMemoCallback((node, prevNodes) => {
    setCurrentEditNode(node);
    setCurrentEditNodePrevNodes(prevNodes || []);
    setShowEditDrawer(true);
  });

  useEffect(() => {
    function handleSave(event: KeyboardEvent) {
      if (event.key === 's' && (navigator.platform.match('Mac') ? event.metaKey : event.ctrlKey)) {
        event.preventDefault();

        dispatch(save(bpmId));
      }
    }

    document.body.addEventListener('keydown', handleSave, false);

    return () => {
      document.body.removeEventListener('keydown', handleSave);
    };
  }, [dispatch, bpmId]);

  const drawerHeader = useMemo(() => {
    if (currentEditNode) {
      if (currentEditNode.type === NodeType.AuditNode) {
        return (
          <CardHeader icon={<Icon type="shenhejiedian" />} type={currentEditNode.type}>
            审批节点
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
          <CardHeader icon={<Icon type="tianxiejiedian" />} type={currentEditNode.type}>
            填写节点
          </CardHeader>
        );
      }
    }

    return null;
  }, [currentEditNode]);

  const handleConfirmLeave = useMemoCallback((location: ReturnType<typeof useLocation>) => {
    if (dirty && !cancelSaveRef.current) {
      targetUrlRef.current = location.pathname + location.search;
      setShowUnsaveModal(true);

      return false;
    }

    return true;
  });

  const handleSave = useMemoCallback(async () => {
    setSaving(true);

    await dispatch(save(bpmId));

    setSaving(false);
  });

  const handleCloseUnsaveModal = useMemoCallback(() => {
    setShowUnsaveModal(false);
  });

  const handleCancelUnsaveModal = useMemoCallback(() => {
    dispatch(setDirty(false));
    setShowUnsaveModal(false);
    cancelSaveRef.current = true;

    if (targetUrlRef.current) {
      history.push(targetUrlRef.current);
    }
  });

  return (
    <div className={styles.flow}>
      {dirty && <Prompt when={dirty} message={handleConfirmLeave} />}
      {loading && <Loading />}
      <div className={styles.content}>
        {flow.map((node, index) => {
          const prevNodes = flow.slice(0, index);

          switch (node.type) {
            case NodeType.StartNode: {
              return <StartNode key={node.id} node={node} onClick={handleClickNode} />;
            }

            case NodeType.AuditNode: {
              return <AuditNode key={node.id} node={node} onClick={handleClickAuditNode} prevNodes={prevNodes} />;
            }

            case NodeType.FillNode: {
              return <FillNode key={node.id} node={node} onClick={handleClickNode} />;
            }

            case NodeType.FinishNode: {
              return <FinishNode key={node.id} node={node} onClick={handleClickNode} />;
            }
            default: {
              return null;
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

          {currentEditNode && currentEditNode.type === NodeType.FinishNode && (
            <FinishNodeEditor node={currentEditNode} />
          )}
        </div>
      </Drawer>

      <Modal
        maskClosable={false}
        destroyOnClose
        visible={showUnsaveModal}
        width={352}
        title={
          <div className={styles.tiptitle}>
            <ExclamationCircleFilled />
            提示
          </div>
        }
        onCancel={handleCloseUnsaveModal}
        footer={
          <>
            <AsyncButton size="large" onClick={handleCancelUnsaveModal}>
              放弃保存
            </AsyncButton>
            <AsyncButton type="primary" size="large" onClick={handleSave}>
              保存更改
            </AsyncButton>
          </>
        }
      >
        当前有未保存的更改，您在离开当前页面是否要保存这些更改?
      </Modal>
    </div>
  );
}

export default React.memo(FlowDesign);
