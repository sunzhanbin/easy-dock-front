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
  AutoNodeEditor,
} from './editor';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { load, flowDataSelector, save, setChoosedNode, loadApis } from './flow-slice';
import useMemoCallback from '@common/hooks/use-memo-callback';
import FlowTree from './flow-tree';
import styles from './index.module.scss';

function FlowDesign() {
  const dispatch = useAppDispatch();
  const { bpmId } = useParams<{ bpmId: string }>();
  const { loading, data: flow, choosedNode } = useAppSelector(flowDataSelector);
  const handleCloseDrawer = useMemoCallback(() => {
    dispatch(setChoosedNode(null));
  });

  useEffect(() => {
    dispatch(load(bpmId));
  }, [dispatch, bpmId]);

  useEffect(() => {
    // 页面加载时请求服务列表为自动节点显示接口名称
    dispatch(loadApis());

    return () => {
      dispatch(setChoosedNode(null));
    };
  }, [dispatch]);

  useEffect(() => {
    function handleSave(event: KeyboardEvent) {
      if (event.key === 's' && (navigator.platform.match('Mac') ? event.metaKey : event.ctrlKey)) {
        event.preventDefault();

        dispatch(save({ subappId: bpmId, showTip: true }));
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
        <CardHeader icon={<Icon type="chaosongdise" />} type={choosedNode.type}>
          抄送节点
        </CardHeader>
      );
    } else if (choosedNode.type === NodeType.AutoNode) {
      return (
        <CardHeader icon={<Icon type="zidongjiediandise" />} type={choosedNode.type}>
          自动节点
        </CardHeader>
      );
    }
  }, [choosedNode]);

  const drawerWidth = useMemo(() => {
    if (choosedNode && choosedNode.type === NodeType.SubBranch) {
      return 600;
    }

    return 368;
  }, [choosedNode]);

  return (
    <div className={styles['scroll-container']}>
      <div className={styles.flow}>
        {loading && <Loading />}

        <div className={styles.content} id="flow-design-container">
          <FlowTree data={flow} />
        </div>
      </div>
      <Drawer
        width={drawerWidth}
        visible={!!choosedNode}
        getContainer={false}
        onClose={handleCloseDrawer}
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

          {choosedNode && choosedNode.type === NodeType.AutoNode && <AutoNodeEditor node={choosedNode} />}
        </div>
      </Drawer>
    </div>
  );
}

export default memo(FlowDesign);