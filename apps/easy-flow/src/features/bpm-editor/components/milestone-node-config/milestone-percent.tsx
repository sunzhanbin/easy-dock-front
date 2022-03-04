import { memo } from "react";
import { validateRule } from "@utils/const";
import { Form, InputNumber } from "antd";
import { FormInstance } from "antd/lib/form";
import styles from "./index.module.scss";

export type MilestonePercentProps = {
  form: FormInstance<any>;
};

const MilestonePercent = ({ form }: MilestonePercentProps) => {
  const enable = form.getFieldValue(["progress", "enable"]);
  if (!enable) return null;
  return (
    <div className={styles["milestone-node-percent"]}>
      <span>当流程通过该节点时，进度值为</span>
      <Form.Item
        name={["progress", "percent"]}
        rules={[
          {
            validator(_, value) {
              return validateRule(value, "百分比不能为空");
            },
          },
        ]}
        noStyle
      >
        <InputNumber size="large" min={1} max={99} placeholder="请输入" />
      </Form.Item>
      <span>%</span>
    </div>
  );
};

const MilestonePercentComponent = (props: MilestonePercentProps) => {
  return (
    <Form.Item name="progress" noStyle>
      <MilestonePercent {...props} />
    </Form.Item>
  );
};
export default memo(MilestonePercentComponent);
