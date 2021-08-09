import { memo, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Drawer } from 'antd';
import { Loading, Icon } from '@common/components';
import { NodeType } from '@type/flow';
import { CardHeader } from './nodes';
import {
  StartNodeEditor,
  AuditNodeEditor,
  FillNodeEditor,
  CCNodeEditor,
  FinishNodeEditor,
  SubBranchEditor,
} from './editor';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { load, flowDataSelector, save, setChoosedNode } from './flow-slice';
import useMemoCallback from '@common/hooks/use-memo-callback';
import FlowTree from './flow-tree';
import styles from './index.module.scss';

function FlowDesign() {
  const dispatch = useAppDispatch();
  const { bpmId } = useParams<{ bpmId: string }>();
  const { loading, data: flow, choosedNode } = useAppSelector(flowDataSelector);

  useEffect(() => {
    dispatch(load(bpmId));
  }, [dispatch, bpmId]);

  const handleCloseNodeEditor = useMemoCallback(() => {
    dispatch(setChoosedNode(null));
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
    if (!choosedNode) {
      return null;
    }

    if (choosedNode.type === NodeType.SubBranch) {
      return <div className={styles['branch-title']}>分支节点</div>;
    }

    if (choosedNode.type === NodeType.AuditNode) {
      return (
        <CardHeader icon={<Icon type="shenhejiedian" />} type={choosedNode.type}>
          审批节点
        </CardHeader>
      );
    } else if (choosedNode.type === NodeType.StartNode) {
      return (
        <CardHeader icon={<Icon type="baocunbingzhixing" />} type={choosedNode.type}>
          开始节点
        </CardHeader>
      );
    } else if (choosedNode.type === NodeType.FinishNode) {
      return (
        <CardHeader icon={<Icon type="jieshujiedian" />} type={choosedNode.type}>
          结束节点
        </CardHeader>
      );
    } else if (choosedNode.type === NodeType.FillNode) {
      return (
        <CardHeader icon={<Icon type="tianxiejiedian" />} type={choosedNode.type}>
          填写节点
        </CardHeader>
      );
    } else if (choosedNode.type === NodeType.CCNode) {
      return (
        <CardHeader icon={<Icon type="yonghujiedian" />} type={choosedNode.type}>
          抄送节点
        </CardHeader>
      );
    }
  }, [choosedNode]);

  const drawerWidth = useMemo(() => {
    if (choosedNode && choosedNode.type === NodeType.SubBranch) {
      return 440;
    }

    return 368;
  }, [choosedNode?.type]);

  return (
    <div className={styles.flow}>
      {loading && <Loading />}

      <div className={styles.content}>
        <FlowTree data={flow} />
      </div>

      <Drawer
        width={drawerWidth}
        visible={!!choosedNode}
        getContainer={false}
        onClose={handleCloseNodeEditor}
        destroyOnClose
        closable={false}
      >
        {drawerHeader}

        <div className={styles.editor}>
          {choosedNode && choosedNode.type === NodeType.StartNode && <StartNodeEditor node={choosedNode} />}

          {choosedNode && choosedNode.type === NodeType.AuditNode && <AuditNodeEditor node={choosedNode} />}

          {choosedNode && choosedNode.type === NodeType.FillNode && <FillNodeEditor node={choosedNode} />}

          {choosedNode && choosedNode.type === NodeType.CCNode && <CCNodeEditor node={choosedNode} />}

          {choosedNode && choosedNode.type === NodeType.FinishNode && <FinishNodeEditor node={choosedNode} />}

          {choosedNode && choosedNode.type === NodeType.SubBranch && <SubBranchEditor branch={choosedNode} />}
        </div>
      </Drawer>
    </div>
  );
}

export default memo(FlowDesign);
