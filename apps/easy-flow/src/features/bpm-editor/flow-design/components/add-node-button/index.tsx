import { memo, useState, useMemo } from "react";
import classnames from "classnames";
import { Button, Popover } from "antd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { Icon } from "@common/components";
import { addNode } from "../../flow-slice";
import { getPopupContainer } from "../../util";
import { NodeType, AddableNode } from "@type/flow";
import styles from "./index.module.scss";
import { useAppDispatch } from "@/app/hooks";

interface AddNodeButtonProps {
  prevId: string;
  className?: string;
}

function AddNodeButton(props: AddNodeButtonProps) {
  const { prevId, className } = props;
  const dispatch = useAppDispatch();
  const [showAddPopover, setShowAddPopover] = useState(false);
  const [showAutoNode, setShowAutoNode] = useState<boolean>(false);

  const handleAddNode = useMemoCallback((type: AddableNode["type"]) => {
    // 将业务逻辑放在redux里处理
    dispatch(addNode({ prevId, type }));
    setShowAddPopover(false);
    showAutoNode && setShowAutoNode(false);
  });

  const autoNodePopoverContent = useMemo(() => {
    return (
      <div className={styles["node-list"]}>
        <div
          className={styles["push-data"]}
          onClick={() => {
            handleAddNode(NodeType.AutoNodePushData);
          }}
        >
          <Icon type="shujulianjie" />
          <span>数据连接</span>
        </div>
        <div
          className={styles["trigger-flow"]}
          onClick={() => {
            handleAddNode(NodeType.AutoNodeTriggerProcess);
          }}
        >
          <Icon type="liuchengchufa" />
          <span>流程触发</span>
        </div>
      </div>
    );
  }, [handleAddNode]);

  const addPopoverContent = useMemo(() => {
    return (
      <div className={styles["add-list"]}>
        <div onClick={() => handleAddNode(NodeType.AuditNode)}>
          <Icon type="lineshenpijiedian" />
          <span>添加审批节点</span>
        </div>
        <div onClick={() => handleAddNode(NodeType.FillNode)}>
          <Icon type="linetianxiejiedian" />
          <span>添加填写节点</span>
        </div>

        <div onClick={() => handleAddNode(NodeType.BranchNode)}>
          <Icon type="jicheng" />
          <span>添加子分支</span>
        </div>

        <div onClick={() => handleAddNode(NodeType.CCNode)}>
          <Icon type="chaosongjiedian" />
          <span>添加抄送节点</span>
        </div>

        <Popover
          className={styles["auto-node"]}
          getPopupContainer={getPopupContainer}
          placement="rightTop"
          arrowContent={null}
          visible={showAutoNode}
          onVisibleChange={setShowAutoNode}
          content={autoNodePopoverContent}
        >
          <div>
            <Icon type="geshiyouhua" />
            <span>添加自动节点</span>
          </div>
        </Popover>
      </div>
    );
    // eslint-disable-next-line
  }, [showAutoNode, autoNodePopoverContent, handleAddNode, getPopupContainer, setShowAutoNode]);

  return (
    <Popover
      className={styles.popover}
      getPopupContainer={getPopupContainer}
      placement="rightTop"
      arrowContent={null}
      visible={showAddPopover}
      onVisibleChange={setShowAddPopover}
      content={addPopoverContent}
    >
      <div className={classnames(styles.container, className)}>
        <Button
          className={classnames(styles["add-button"], { [styles.active]: showAddPopover })}
          type="default"
          icon={<Icon type="xinzeng" />}
        />
      </div>
    </Popover>
  );
}

export default memo(AddNodeButton);
