import { memo, ReactNode, useCallback, useState, useMemo } from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import classnames from "classnames";
import { Icon, PopoverConfirm } from "@common/components";
import {
  addNode,
  delNode,
  flowDataSelector,
  isDraggingSelector,
  setChoosedNode,
  showIconSelector,
} from "../../flow-slice";
import ShadowNode from "../../components/shadow-node";
import { NodeType, AllNode, BranchNode, AddableNode } from "@type/flow";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import useMemoCallback from "@common/hooks/use-memo-callback";
import styles from "./index.module.scss";
import AddNodeButton from "../../components/add-node-button";
import useFlowMode from "../../hooks/use-flow-mode";

interface BaseProps {
  icon: ReactNode;
  node: Exclude<AllNode, BranchNode>;
  onDelete?(): void;
  children: ReactNode;
}

interface CardHeaderProps {
  icon: ReactNode;
  children?: ReactNode;
  className?: string;
  type: NodeType;
}

const typeClassMap: any = {
  [NodeType.AuditNode]: styles["audit-node"],
  [NodeType.FillNode]: styles["fill-node"],
  [NodeType.CCNode]: styles["cc-node"],
  [NodeType.AutoNodePushData]: styles["auto-node"],
  [NodeType.AutoNodeTriggerProcess]: styles["auto-node"],
  [NodeType.PluginNode]: styles["plugin-node"],
};

export const CardHeader = memo(function CardHeader(props: CardHeaderProps) {
  const { icon, children, className, type } = props;

  const typeClass = useMemo<string>(() => {
    return typeClassMap[type] || "";
  }, [type]);

  return (
    <div className={classnames(styles.header, typeClass, className)}>
      <div className={styles["icon-box"]}>{icon}</div>
      <div className={styles.title}>{children}</div>
    </div>
  );
});

function Base(props: BaseProps) {
  const dispatch = useAppDispatch();
  const { invalidNodesMap } = useAppSelector(flowDataSelector);
  const showIcon = useAppSelector(showIconSelector);
  const isDragging = useAppSelector(isDraggingSelector);
  const flowMode = useFlowMode();
  const { icon, node, children } = props;
  const { type, name } = node;
  const [showDeletePopover, setShowDeletePopover] = useState(false);
  const [collectProps, drop] = useDrop(
    () => ({
      accept: "flow-node",
      collect: (monitor: DropTargetMonitor) => {
        const item = monitor.getItem<{ type: AddableNode["type"] }>();
        return {
          isOver: monitor.isOver(),
          type: item?.type,
        };
      },
      drop: (v, monitor: DropTargetMonitor) => {
        const item = monitor.getItem<{ type: AddableNode["type"]; id?: number }>();
        dispatch(addNode({ prevId: node.id, type: item?.type, id: item.id }));
      },
    }),
    [node.id],
  );
  const handleDeleteConfirm = useCallback(() => {
    dispatch(delNode(node.id));
  }, [dispatch, node.id]);
  const handleNodeClick = useMemoCallback(() => {
    dispatch(setChoosedNode(node));
  });
  // 当前拖拽元素是否与放置区重叠
  const isOver = useMemo(() => collectProps.isOver, [collectProps.isOver]);
  // 当前拖拽元素的节点类型
  const nodeType = useMemo(() => collectProps.type, [collectProps.type]);

  const showDelete = useMemo(() => {
    return [
      NodeType.AuditNode,
      NodeType.FillNode,
      NodeType.CCNode,
      NodeType.AutoNodePushData,
      NodeType.AutoNodeTriggerProcess,
      NodeType.PluginNode,
    ].includes(type);
  }, [type]);

  return (
    <div className={styles.node}>
      <div
        className={classnames(styles.card, {
          [styles.invalid]: invalidNodesMap[node.id] && invalidNodesMap[node.id].errors.length > 0,
        })}
        onClick={handleNodeClick}
      >
        <CardHeader icon={showIcon ? icon : null} type={node.type}>
          {node.name}
        </CardHeader>
        <div className={styles.content}>{children}</div>
      </div>
      {isOver && <ShadowNode type={nodeType} className={styles["temp-node"]} />}
      {type !== NodeType.FinishNode && (
        <div
          className={classnames(
            styles.footer,
            isOver && styles.over,
            isOver && nodeType === NodeType.BranchNode && styles["sub-branch"],
            isDragging && styles.isDragging,
          )}
          ref={drop}
        >
          {flowMode !== "preview" && showIcon && <AddNodeButton prevId={node.id} />}
        </div>
      )}

      {flowMode !== "preview" && showDelete && (
        <div className={classnames(styles.actions, { [styles.show]: showDeletePopover })}>
          <PopoverConfirm
            title="确认删除"
            onConfirm={handleDeleteConfirm}
            visible={showDeletePopover}
            onVisibleChange={setShowDeletePopover}
            getPopupContainer={() => document.body}
            trigger="click"
            content={`确认删除 ${name} 吗？`}
          >
            <div className={styles.action}>
              <Icon type="shanchu" className={styles.icon} />
            </div>
          </PopoverConfirm>
        </div>
      )}
    </div>
  );
}

export default memo(Base);
