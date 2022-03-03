import { memo } from "react";
import { Checkbox, Form } from "antd";
import MilestonePercentComponent from "./milestone-percent";
import styles from "@/features/bpm-editor/flow-design/editor/audit-node/index.module.scss";
import { MilestonePercentProps } from "./milestone-percent";

const MilestoneNodeConfig = (props: MilestonePercentProps) => {
  return (
    <>
      <Form.Item name={["milestone", "enable"]} valuePropName="checked" style={{ marginBottom: "12px" }}>
        <Checkbox>设置为里程碑节点</Checkbox>
      </Form.Item>
      <div className={styles["countersign-detail"]}>
        <span>当流程通过该节点时，进度值为</span>
        <MilestonePercentComponent {...props} />
        <span>%</span>
      </div>
    </>
  );
};

export default memo(MilestoneNodeConfig);
