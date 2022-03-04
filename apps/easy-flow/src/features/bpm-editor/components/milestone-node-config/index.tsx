import { memo } from "react";
import { Checkbox, Form } from "antd";
import MilestonePercentComponent from "./milestone-percent";
import { MilestonePercentProps } from "./milestone-percent";
import styles from "./index.module.scss";

const MilestoneNodeConfig = (props: MilestonePercentProps) => {
  return (
    <div className={styles.progress}>
      <Form.Item name={["progress", "enable"]} valuePropName="checked" style={{ marginBottom: "12px" }}>
        <Checkbox>设置为里程碑节点</Checkbox>
      </Form.Item>
      <MilestonePercentComponent {...props} />
    </div>
  );
};

export default memo(MilestoneNodeConfig);
