import { memo, FC } from "react";
import { Collapse } from "antd";
import ToolboxItem, { ToolboxItemProps } from "../toolbox-item";
import { NodeType } from "@/type/flow";
import styles from "./index.module.scss";

const { Panel } = Collapse;
const commonNodeList: ToolboxItemProps[] = [
  { name: "填写节点", type: NodeType.FillNode },
  { name: "审批节点", type: NodeType.AuditNode },
  { name: "子分支节点", type: NodeType.BranchNode },
  { name: "抄送节点", type: NodeType.CCNode },
  { name: "自动节点-数据推送", type: NodeType.AutoNodePushData },
  { name: "自动节点-数据连接", type: NodeType.AutoNodeTriggerProcess },
];

const Toolbox: FC = () => {
  return (
    <div className={styles.toolbox}>
      <Collapse defaultActiveKey="common" ghost expandIconPosition="right">
        <Panel header="通用节点" key="common" className={styles.panel}>
          <div className={styles["node-container"]}>
            {commonNodeList.map(({ icon, type, name }) => (
              <ToolboxItem icon={icon} name={name} type={type} key={name} />
            ))}
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default memo(Toolbox);
