import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Prompt, useParams, useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import { Drawer, Modal } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Loading, Icon } from '@common/components';
import { load, flowDataSelector, save } from './flow-slice';
import { AllNode, BranchNode as BranchNodeType, NodeType } from '@type/flow';
import { StartNode, AuditNode, FillNode, FinishNode, CardHeader } from './nodes';
import { AuditNodeProps } from './nodes/audit-node';
import { StartNodeEditor, AuditNodeEditor, FillNodeEditor, FinishNodeEditor } from './editor';
import styles from './index.module.scss';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

function FlowDesign() {
  const dispatch = useAppDispatch();
  const { bpmId } = useParams<{ bpmId: string }>();
  const { loading, data: flow, dirty } = useAppSelector(flowDataSelector);
  const [currentEditNode, setCurrentEditNode] = useState<AllNode | null>(null);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [currentEditNodePrevNodes, setCurrentEditNodePrevNodes] = useState<AllNode[]>([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showUnSaveModal, setShowUnSaveModal] = useState(false);
  const { url } = useRouteMatch();
  const history = useHistory();
  const targetUrlRef = useRef<string>();
  const cancelSaveRef = useRef<boolean>();

  useEffect(() => {
    dispatch(load(bpmId));
  }, [dispatch, bpmId]);

  useEffect(() => {
    // 这里不能用dirt替代
    setShowPrompt((oldValue) => {
      if (oldValue) return true;

      return dirty;
    });
  }, [dirty]);

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
    if (dirty && url !== location.pathname && !cancelSaveRef.current) {
      targetUrlRef.current = location.pathname + location.search;
      setShowUnSaveModal(true);

      return false;
    }

    return true;
  });

  const handleSave = useMemoCallback(async () => {
    setSaving(true);

    await dispatch(save(bpmId));

    setSaving(false);
  });

  const handleCancelUnSaveModal = useMemoCallback(() => {
    setShowUnSaveModal(false);
    cancelSaveRef.current = true;

    if (targetUrlRef.current) {
      history.push(targetUrlRef.current);
    }
  });

  return (
    <div className={styles.flow}>
      {showPrompt && <Prompt when={dirty} message={handleConfirmLeave} />}
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
        visible={showUnSaveModal}
        width={352}
        title="提示"
        okButtonProps={{ size: 'large', loading: saving }}
        okText="保存更改"
        cancelButtonProps={{ size: 'large' }}
        cancelText="放弃保存"
        onOk={handleSave}
        onCancel={handleCancelUnSaveModal}
      >
        当前有未保存的更改，您在离开当前页面是否要保存这些更改?
      </Modal>
    </div>
  );
}

export default React.memo(FlowDesign);
