import { memo, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Drawer } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Loading, Icon } from "@common/components";
import { NodeType } from "@type/flow";
import { CardHeader } from "./nodes";
import Toolbox from "./components/toolbox";
import {
  StartNodeEditor,
  AuditNodeEditor,
  FillNodeEditor,
  PluginNodeEditor,
  CCNodeEditor,
  FinishNodeEditor,
  SubBranchEditor,
  AutoNodePushDataEditor,
  AutoNodeTriggerProcess,
} from "./editor";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { load, flowDataSelector, save, setChoosedNode } from "./flow-slice";
import useMemoCallback from "@common/hooks/use-memo-callback";
import FlowTree from "./flow-tree";
import styles from "./index.module.scss";

function FlowDesign() {
  const dispatch = useAppDispatch();
  const { bpmId } = useParams<{ bpmId: string }>();
  const { loading, data: flow, choosedNode } = useAppSelector(flowDataSelector);
  const handleCloseDrawer = useMemoCallback(() => {
    if (choosedNode) {
      dispatch(setChoosedNode(null));
    }
  });

  useEffect(() => {
    dispatch(load(bpmId));
  }, [dispatch, bpmId]);

  useEffect(() => {
    return () => {
      dispatch(setChoosedNode(null));
    };
  }, [dispatch]);

  useEffect(() => {
    function handleSave(event: KeyboardEvent) {
      if (event.key === "s" && (navigator.userAgent.match("Mac") ? event.metaKey : event.ctrlKey)) {
        event.preventDefault();

        dispatch(save({ subappId: bpmId, showTip: true }));
      }
    }

    document.body.addEventListener("keydown", handleSave, false);

    return () => {
      document.body.removeEventListener("keydown", handleSave);
    };
  }, [dispatch, bpmId]);

  const drawerHeader = useMemo(() => {
    if (!choosedNode) {
      return null;
    }

    if (choosedNode.type === NodeType.SubBranch) {
      return <div className={styles["branch-title"]}>分支节点</div>;
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
    } else if (choosedNode.type === NodeType.AutoNodePushData) {
      return (
        <CardHeader icon={<Icon type="shujulianjiedise" />} type={choosedNode.type}>
          自动节点_数据连接
        </CardHeader>
      );
    } else if (choosedNode.type === NodeType.AutoNodeTriggerProcess) {
      return (
        <CardHeader icon={<Icon type="liuchengchufadise" />} type={choosedNode.type}>
          自动节点_触发流程
        </CardHeader>
      );
    } else if (choosedNode.type === NodeType.PluginNode) {
      return (
        <CardHeader icon={<Icon type="chajiandise" />} type={choosedNode.type}>
          插件节点
        </CardHeader>
      );
    }
  }, [choosedNode]);

  const drawerWidth = useMemo(() => {
    if (choosedNode && NodeType.SubBranch === choosedNode.type) {
      return 600;
    }
    if (choosedNode && [NodeType.AutoNodePushData, NodeType.PluginNode].includes(choosedNode.type)) {
      return 500;
    }

    return 368;
  }, [choosedNode]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles["scroll-container"]}>
        <div className={styles.tool}>
          <Toolbox />
        </div>
        <div className={styles.flow} onClick={handleCloseDrawer} id="flow-container">
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
          mask={false}
        >
          {drawerHeader}

          <div className={styles.editor}>
            {choosedNode && choosedNode.type === NodeType.StartNode && <StartNodeEditor node={choosedNode} />}

            {choosedNode && choosedNode.type === NodeType.AuditNode && <AuditNodeEditor node={choosedNode} />}

            {choosedNode && choosedNode.type === NodeType.FillNode && <FillNodeEditor node={choosedNode} />}

            {choosedNode && choosedNode.type === NodeType.CCNode && <CCNodeEditor node={choosedNode} />}

            {choosedNode && choosedNode.type === NodeType.FinishNode && <FinishNodeEditor node={choosedNode} />}

            {choosedNode && choosedNode.type === NodeType.PluginNode && <PluginNodeEditor node={choosedNode} />}

            {choosedNode && choosedNode.type === NodeType.SubBranch && <SubBranchEditor branch={choosedNode} />}

            {choosedNode && choosedNode.type === NodeType.AutoNodePushData && (
              <AutoNodePushDataEditor node={choosedNode} />
            )}
            {choosedNode && choosedNode.type === NodeType.AutoNodeTriggerProcess && (
              <AutoNodeTriggerProcess node={choosedNode} />
            )}
          </div>
        </Drawer>
      </div>
    </DndProvider>
  );
}

export default memo(FlowDesign);
