import { memo } from "react";
import { Checkbox, Form } from "antd";
import MilestonePercentComponent from "./milestone-percent";
import { MilestonePercentProps } from "./milestone-percent";

const MilestoneNodeConfig = (props: MilestonePercentProps) => {
  return (
    <>
      <Form.Item name={["progress", "enable"]} valuePropName="checked" style={{ marginBottom: "12px" }}>
        <Checkbox>设置为里程碑节点</Checkbox>
      </Form.Item>
      <MilestonePercentComponent {...props} />
    </>
  );
};

export default memo(MilestoneNodeConfig);
