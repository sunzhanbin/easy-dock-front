import { memo } from "react";
import { validateRule } from "@utils/const";
import { Form, InputNumber } from "antd";
import { FormInstance } from "antd/lib/form";

export type MilestonePercentProps = {
  form: FormInstance<any>;
};

const MilestonePercent = ({ form }: MilestonePercentProps) => {
  const disabled = !form.getFieldValue(["milestone", "enable"]);
  return (
    <>
      <Form.Item
        name={["milestone", "percent"]}
        rules={[
          {
            validator(_, value) {
              return validateRule(value, "百分比不能为空");
            },
          },
        ]}
      >
        <InputNumber size="large" min={1} max={99} placeholder="请输入" disabled={disabled} />
      </Form.Item>
    </>
  );
};

const MilestonePercentComponent = (props: MilestonePercentProps) => {
  return (
    <Form.Item name="milestone">
      <MilestonePercent {...props} />
    </Form.Item>
  );
};
export default memo(MilestonePercentComponent);
